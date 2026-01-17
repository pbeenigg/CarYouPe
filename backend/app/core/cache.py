import redis
from app.core.config import settings

# In-memory fallback if Redis is not configured or fails
class LocalCache:
    def __init__(self):
        self._cache = {}

    def get(self, key: str):
        return self._cache.get(key)

    def set(self, key: str, value: str, ex: int = None):
        self._cache[key] = value
        # Note: Expiration is not implemented in simple dict cache

    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]
    
    def exists(self, key: str):
        return key in self._cache

try:
    # Use Redis if configured (check settings later)
    # For now, let's use LocalCache as per user environment
    # In production, replace with:
    # redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0)
    redis_client = LocalCache()
except Exception:
    redis_client = LocalCache()
