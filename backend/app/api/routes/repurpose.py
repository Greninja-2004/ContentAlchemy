import time

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.generation import Generation
from app.schemas.repurpose import RepurposeRequest, RepurposeResponse
from app.services.repurpose_service import RepurposeService
from app.services.content_extractor import extract_youtube_transcript, extract_blog_content
from app.services.cache import make_cache_key, get_cached, set_cached

router = APIRouter(prefix="/api", tags=["repurpose"])

VALID_FORMATS = {"tiktok", "linkedin", "twitter", "instagram", "newsletter", "youtube", "email", "reddit"}


@router.post("/repurpose", response_model=RepurposeResponse)
async def repurpose_content(
    body: RepurposeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    invalid = set(body.formats) - VALID_FORMATS
    if invalid:
        raise HTTPException(status_code=400, detail=f"Invalid formats: {invalid}")

    # Enforce daily generation limit based on subscription tier
    tier = (current_user.subscription_tier or "free").lower()
    if tier not in ["max", "premium"]:
        limit = 2 if tier == "free" else 15
        from datetime import datetime, timedelta, timezone
        from sqlalchemy import select, func
        
        day_ago = datetime.now(timezone.utc) - timedelta(days=1)
        count_stmt = select(func.count(Generation.id)).where(
            Generation.user_id == current_user.id,
            Generation.created_at >= day_ago
        )
        count_result = await db.execute(count_stmt)
        daily_count = count_result.scalar_one()
        
        if daily_count >= limit:
            raise HTTPException(
                status_code=403,
                detail=f"Daily generation limit reached for your {tier.capitalize()} plan ({limit} generations per day). Please upgrade to a higher tier."
            )

    start_time = time.time()
    content = body.content

    if body.source_type == "youtube_url":
        try:
            content = await extract_youtube_transcript(body.content)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract YouTube transcript: {e}")
    elif body.source_type == "blog_link":
        try:
            content = await extract_blog_content(body.content)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract blog content: {e}")

    cache_key = make_cache_key(content, body.tone, body.formats)
    cached = await get_cached(cache_key)
    if cached:
        elapsed = int((time.time() - start_time) * 1000)
        generation = Generation(
            user_id=current_user.id,
            original_content=content[:5000],
            content_source=body.source_type,
            tone=body.tone,
            generation_time_ms=elapsed,
            tiktok_script=cached.get("tiktok"),
            linkedin_post=cached.get("linkedin"),
            twitter_thread=cached.get("twitter"),
            instagram_caption=cached.get("instagram"),
            newsletter_draft=cached.get("newsletter"),
            youtube_description=cached.get("youtube"),
            email_subject=cached.get("email"),
            reddit_post=cached.get("reddit"),
        )
        db.add(generation)
        await db.commit()
        return RepurposeResponse(success=True, generation_id=str(generation.id), results=cached, time_ms=elapsed)

    service = RepurposeService()
    results = await service.generate_all_formats(content, body.tone, body.formats)

    elapsed = int((time.time() - start_time) * 1000)

    generation = Generation(
        user_id=current_user.id,
        original_content=content[:5000],
        content_source=body.source_type,
        tone=body.tone,
        tiktok_script=results.get("tiktok"),
        linkedin_post=results.get("linkedin"),
        twitter_thread=results.get("twitter"),
        instagram_caption=results.get("instagram"),
        newsletter_draft=results.get("newsletter"),
        youtube_description=results.get("youtube"),
        email_subject=results.get("email"),
        reddit_post=results.get("reddit"),
        generation_time_ms=elapsed,
    )
    db.add(generation)
    await db.commit()
    await db.refresh(generation)

    await set_cached(cache_key, results)

    return RepurposeResponse(
        success=True,
        generation_id=str(generation.id),
        results=results,
        time_ms=elapsed,
    )
