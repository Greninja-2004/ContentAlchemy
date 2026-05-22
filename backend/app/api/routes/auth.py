from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timezone, timedelta

from app.core.database import get_db
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
