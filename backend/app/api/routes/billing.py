import stripe
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.config import settings
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/billing", tags=["billing"])

# Initialize Stripe
if settings.STRIPE_SECRET_KEY:
    stripe.api_key = settings.STRIPE_SECRET_KEY


class CheckoutRequest(BaseModel):
    plan: str = "max"  # "pro" or "max"


@router.post("/checkout-session")
async def create_checkout_session(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a Stripe Checkout Session for Pro or Max subscriptions.
    Falls back to a Mock Mode if Stripe settings are not configured,
    which automatically upgrades the user locally.
    """
    plan = body.plan.lower()
    if plan not in ["pro", "max"]:
        raise HTTPException(status_code=400, detail="Invalid plan specified. Must be 'pro' or 'max'.")

    if not settings.STRIPE_SECRET_KEY:
        # Mock mode: automatically upgrade the user for local development testing
        current_user.subscription_tier = plan
        current_user.subscription_status = "active"
        # 1 year mock duration
        current_user.subscription_end = datetime.now(timezone.utc).replace(year=datetime.now(timezone.utc).year + 1)
        await db.commit()
        return {"url": f"{settings.FRONTEND_URL}/dashboard/settings?mock_success=true&plan={plan}"}

    try:
        # Create or retrieve Stripe Customer
        if not current_user.stripe_customer_id:
            customer = await stripe.Customer.create_async(
                email=current_user.email,
                name=current_user.name,
                metadata={"user_id": current_user.id}
            )
            current_user.stripe_customer_id = customer.id
            db.add(current_user)
            await db.commit()
            await db.refresh(current_user)

        price_id = settings.STRIPE_PRO_PRICE_ID if plan == "pro" else settings.STRIPE_MAX_PRICE_ID
        if not price_id:
            raise HTTPException(status_code=400, detail=f"Stripe Price ID for '{plan}' plan is not configured in .env.")

        session = await stripe.checkout.Session.create_async(
            customer=current_user.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
            mode="subscription",
            success_url=f"{settings.FRONTEND_URL}/dashboard/settings?session_id={{CHECKOUT_SESSION_ID}}&plan={plan}",
            cancel_url=f"{settings.FRONTEND_URL}/dashboard/settings",
            metadata={
                "user_id": current_user.id,
                "plan": plan
            }
        )
        return {"url": session.url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/portal-session")
async def create_portal_session(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a Stripe Customer Portal session so users can cancel or manage payment methods.
    Falls back to Mock Mode if Stripe settings are not configured,
    which downgrades the user back to Free.
    """
    if not settings.STRIPE_SECRET_KEY:
        # Mock mode: automatically cancel subscription for testing
        current_user.subscription_tier = "free"
        current_user.subscription_status = None
        current_user.subscription_end = None
        await db.commit()
        return {"url": f"{settings.FRONTEND_URL}/dashboard/settings?mock_cancel=true"}

    if not current_user.stripe_customer_id:
        raise HTTPException(status_code=400, detail="No billing customer associated with this account")

    try:
        session = await stripe.billing_portal.Session.create_async(
            customer=current_user.stripe_customer_id,
            return_url=f"{settings.FRONTEND_URL}/dashboard/settings",
        )
        return {"url": session.url}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="stripe-signature"),
    db: AsyncSession = Depends(get_db)
):
    """
    Handles real-time Stripe Webhook notifications to keep database tier
    in sync with payment state.
    """
    if not settings.STRIPE_SECRET_KEY or not settings.STRIPE_WEBHOOK_SECRET:
        raise HTTPException(status_code=400, detail="Webhook configuration missing")

    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signature verification failed: {e}")

    event_dict = event.to_dict()
    event_type = event_dict.get("type")
    data_object = event_dict.get("data", {}).get("object", {})

    if event_type == "checkout.session.completed":
        customer_id = data_object.get("customer")
        subscription_id = data_object.get("subscription")
        user_id = data_object.get("metadata", {}).get("user_id")
        plan = data_object.get("metadata", {}).get("plan", "max")

        if user_id:
            # Query user by id
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.stripe_customer_id = customer_id
                user.stripe_subscription_id = subscription_id
                user.subscription_tier = plan
                user.subscription_status = "active"
                
                # Fetch end date if present
                try:
                    sub = await stripe.Subscription.retrieve_async(subscription_id)
                    user.subscription_end = datetime.fromtimestamp(sub.current_period_end, tz=timezone.utc)
                except Exception as e:
                    # Fallback to 30 days from now if Stripe retrieve fails (e.g. for mock/invalid subscription ID in webhook tests)
                    user.subscription_end = datetime.now(timezone.utc) + timedelta(days=30)
                
                db.add(user)
                await db.commit()

    elif event_type == "customer.subscription.updated":
        customer_id = data_object.get("customer")
        subscription_id = data_object.get("id")
        status = data_object.get("status")
        period_end = data_object.get("current_period_end")
        items = data_object.get("items", {}).get("data", [])

        # Determine tier from stripe price ID
        tier = "max"
        if items:
            price_id = items[0].get("price", {}).get("id")
            if price_id == settings.STRIPE_PRO_PRICE_ID:
                tier = "pro"
            elif price_id == settings.STRIPE_MAX_PRICE_ID:
                tier = "max"

        # Query user by customer ID
        result = await db.execute(select(User).where(User.stripe_customer_id == customer_id))
        user = result.scalar_one_or_none()
        if user:
            user.stripe_subscription_id = subscription_id
            user.subscription_status = status
            if period_end:
                user.subscription_end = datetime.fromtimestamp(period_end, tz=timezone.utc)
            
            # Map statuses to tier
            if status in ["active", "trialing"]:
                user.subscription_tier = tier
            else:
                user.subscription_tier = "free"
            
            db.add(user)
            await db.commit()

    elif event_type == "customer.subscription.deleted":
        customer_id = data_object.get("customer")
        
        result = await db.execute(select(User).where(User.stripe_customer_id == customer_id))
        user = result.scalar_one_or_none()
        if user:
            user.stripe_subscription_id = None
            user.subscription_tier = "free"
            user.subscription_status = "canceled"
            user.subscription_end = None
            
            db.add(user)
            await db.commit()

    return {"status": "success"}
