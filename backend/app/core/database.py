from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG, connect_args=connect_args)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db():
    from app.models.user import User  # noqa: F401
    from app.models.generation import Generation  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

        def migrate_sqlite_schema(connection):
            if connection.dialect.name != "sqlite":
                return
            cursor = connection.connection.cursor()
            cursor.execute("PRAGMA table_info(users)")
            columns = [row[1] for row in cursor.fetchall()]

            new_cols = [
                ("stripe_customer_id", "VARCHAR(255) NULL"),
                ("stripe_subscription_id", "VARCHAR(255) NULL"),
                ("subscription_tier", "VARCHAR(50) DEFAULT 'free'"),
                ("subscription_status", "VARCHAR(50) NULL"),
                ("subscription_end", "DATETIME NULL"),
                ("google_id", "VARCHAR(255) NULL"),
                ("avatar_url", "VARCHAR(512) NULL"),
            ]

            for col_name, col_type in new_cols:
                if col_name not in columns:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")

            cursor.execute("CREATE INDEX IF NOT EXISTS ix_users_stripe_customer_id ON users (stripe_customer_id)")

        await conn.run_sync(migrate_sqlite_schema)


async def get_db():
    async with async_session() as session:
        yield session
