import json
import hashlib
import time

from app.core.config import settings

_memory_cache: dict[str, tuple[str, float]] = {}

redis_client = None


async def get_redis():
    global redis_client
    if redis_client is not None:
        return redis_client
    if not settings.REDIS_URL:
        return None
    try:
        import redis.asyncio as redis
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        await redis_client.ping()
        return redis_client
    except Exception:
        return None


def make_cache_key(content: str, tone: str, formats: list[str]) -> str:
    raw = f"{content}:{tone}:{sorted(formats)}"
    content_hash = hashlib.sha256(raw.encode()).hexdigest()[:16]
    return f"repurpose:{content_hash}"


async def get_cached(key: str) -> dict | None:
    r = await get_redis()
    if r:
        data = await r.get(key)
        if data:
            return json.loads(data)
    else:
        entry = _memory_cache.get(key)
        if entry and time.time() < entry[1]:
            return json.loads(entry[0])
    return None


async def set_cached(key: str, value: dict, ttl: int = 86400) -> None:
    r = await get_redis()
    if r:
        await r.setex(key, ttl, json.dumps(value))
    else:
        _memory_cache[key] = (json.dumps(value), time.time() + ttl)
