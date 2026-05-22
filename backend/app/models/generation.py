import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Generation(Base):
    __tablename__ = "generations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    original_content: Mapped[str] = mapped_column(Text, nullable=False)
    content_source: Mapped[str] = mapped_column(String(50), default="text_paste")
    tone: Mapped[str] = mapped_column(String(50), default="casual")

    tiktok_script: Mapped[str | None] = mapped_column(Text, nullable=True)
    linkedin_post: Mapped[str | None] = mapped_column(Text, nullable=True)
    twitter_thread: Mapped[str | None] = mapped_column(Text, nullable=True)
    instagram_caption: Mapped[str | None] = mapped_column(Text, nullable=True)
    newsletter_draft: Mapped[str | None] = mapped_column(Text, nullable=True)
    youtube_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    email_subject: Mapped[str | None] = mapped_column(Text, nullable=True)
    reddit_post: Mapped[str | None] = mapped_column(Text, nullable=True)

    generation_time_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="generations")
