from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.generation import Generation

router = APIRouter(prefix="/api", tags=["library"])


@router.get("/library")
async def get_library(
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    count_result = await db.execute(
        select(func.count()).select_from(Generation).where(Generation.user_id == current_user.id)
    )
    total = count_result.scalar()

    result = await db.execute(
        select(Generation)
        .where(Generation.user_id == current_user.id)
        .order_by(Generation.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    generations = result.scalars().all()

    items = []
    for g in generations:
        items.append({
            "id": str(g.id),
            "original_content": g.original_content[:200],
            "content_source": g.content_source,
            "tone": g.tone,
            "tiktok_script": g.tiktok_script,
            "linkedin_post": g.linkedin_post,
            "twitter_thread": g.twitter_thread,
            "instagram_caption": g.instagram_caption,
            "newsletter_draft": g.newsletter_draft,
            "youtube_description": g.youtube_description,
            "email_subject": g.email_subject,
            "reddit_post": g.reddit_post,
            "generation_time_ms": g.generation_time_ms,
            "created_at": g.created_at.isoformat(),
        })

    return {"total": total, "items": items}


@router.get("/library/{generation_id}")
async def get_generation(
    generation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Generation).where(Generation.id == generation_id, Generation.user_id == current_user.id)
    )
    generation = result.scalar_one_or_none()
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    return {
        "id": str(generation.id),
        "original_content": generation.original_content,
        "content_source": generation.content_source,
        "tone": generation.tone,
        "tiktok_script": generation.tiktok_script,
        "linkedin_post": generation.linkedin_post,
        "twitter_thread": generation.twitter_thread,
        "instagram_caption": generation.instagram_caption,
        "newsletter_draft": generation.newsletter_draft,
        "youtube_description": generation.youtube_description,
        "email_subject": generation.email_subject,
        "reddit_post": generation.reddit_post,
        "generation_time_ms": generation.generation_time_ms,
        "created_at": generation.created_at.isoformat(),
    }


@router.delete("/library/{generation_id}")
async def delete_generation(
    generation_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Generation).where(Generation.id == generation_id, Generation.user_id == current_user.id)
    )
    generation = result.scalar_one_or_none()
    if not generation:
        raise HTTPException(status_code=404, detail="Generation not found")

    await db.delete(generation)
    await db.commit()
    return {"success": True}
