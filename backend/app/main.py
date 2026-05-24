from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import init_db
from app.api.routes import auth, repurpose, library, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=== STRIPE CONFIGURATION DIAGNOSTICS ===")
    print(f"STRIPE_SECRET_KEY loaded: {bool(settings.STRIPE_SECRET_KEY)}")
    print(f"STRIPE_PRO_PRICE_ID loaded: {bool(settings.STRIPE_PRO_PRICE_ID)} (Length: {len(settings.STRIPE_PRO_PRICE_ID) if settings.STRIPE_PRO_PRICE_ID else 0})")
    print(f"STRIPE_MAX_PRICE_ID loaded: {bool(settings.STRIPE_MAX_PRICE_ID)} (Length: {len(settings.STRIPE_MAX_PRICE_ID) if settings.STRIPE_MAX_PRICE_ID else 0})")
    print("========================================")
    await init_db()
    yield


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(repurpose.router)
app.include_router(library.router)
app.include_router(billing.router)


@app.get("/")
async def root():
    return {"app": settings.APP_NAME, "status": "running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
