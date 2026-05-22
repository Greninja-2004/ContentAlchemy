from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone, timedelta
import httpx
import urllib.parse

from app.core.database import get_db
from app.core.config import settings
from app.core.security import hash_password, verify_password, create_access_token
from app.api.deps import get_current_user
from app.models.user import User
from app.models.generation import Generation
from app.schemas.auth import SignupRequest, LoginRequest, AuthResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=body.email,
        name=body.name,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token(str(user.id))
    return AuthResponse(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(str(user.id))
    return AuthResponse(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.get("/usage")
async def get_usage(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    tier = (current_user.subscription_tier or "free").lower()
    limit = -1
    if tier == "free":
        limit = 2
    elif tier == "pro":
        limit = 15
    # for max/premium, limit is unlimited (-1)
    
    day_ago = datetime.now(timezone.utc) - timedelta(days=1)
    count_stmt = select(func.count(Generation.id)).where(
        Generation.user_id == current_user.id,
        Generation.created_at >= day_ago
    )
    count_result = await db.execute(count_stmt)
    daily_count = count_result.scalar_one()
    
    # Also get total generations ever
    total_stmt = select(func.count(Generation.id)).where(
        Generation.user_id == current_user.id
    )
    total_result = await db.execute(total_stmt)
    total_count = total_result.scalar_one()
    
    return {
        "daily_count": daily_count,
        "daily_limit": limit,
        "total_count": total_count,
        "tier": tier
    }


@router.get("/google")
async def google_login():
    """Redirect user to Google OAuth consent screen."""
    params = urllib.parse.urlencode({
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback, create/find user, return JWT."""
    frontend_url = settings.FRONTEND_URL

    # 1. Exchange authorization code for tokens
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            return RedirectResponse(f"{frontend_url}/login?error=google_token_failed")

        tokens = token_resp.json()
        access_token_google = tokens.get("access_token")

        # 2. Fetch user info from Google
        userinfo_resp = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token_google}"},
        )
        if userinfo_resp.status_code != 200:
            return RedirectResponse(f"{frontend_url}/login?error=google_userinfo_failed")

        google_user = userinfo_resp.json()

    google_id = google_user.get("id")
    email = google_user.get("email")
    name = google_user.get("name", "")
    avatar_url = google_user.get("picture", "")

    if not email or not google_id:
        return RedirectResponse(f"{frontend_url}/login?error=google_missing_info")

    # 3. Find existing user by google_id or email
    result = await db.execute(select(User).where(User.google_id == google_id))
    user = result.scalar_one_or_none()

    if not user:
        # Try to find by email (account may exist from email/password signup)
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user:
            # Link Google to existing email account
            user.google_id = google_id
            user.avatar_url = avatar_url
        else:
            # Create brand new user
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                avatar_url=avatar_url,
                password_hash=None,
            )
            db.add(user)

    await db.commit()
    await db.refresh(user)

    # 4. Issue our own JWT and redirect to frontend
    jwt_token = create_access_token(str(user.id))
    return RedirectResponse(f"{frontend_url}/auth/callback?token={jwt_token}")
