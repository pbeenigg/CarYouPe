import time
from typing import Any, Optional, Dict

class LocalCache:
    """
    A simple in-memory cache to replace Redis for now.
    Supports basic get/set/delete operations with TTL.
    """
    _instance = None
    _store: Dict[str, Any] = {}
    _expiry: Dict[str, float] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LocalCache, cls).__new__(cls)
        return cls._instance

    def get(self, key: str) -> Optional[Any]:
        """Get a value from the cache."""
        if key not in self._store:
            return None
        
        # Check expiry
        if key in self._expiry:
            if time.time() > self._expiry[key]:
                self.delete(key)
                return None
                
        return self._store[key]

    def set(self, key: str, value: Any, ttl: int = None) -> None:
        """Set a value in the cache with optional TTL (in seconds)."""
        self._store[key] = value
        if ttl:
            self._expiry[key] = time.time() + ttl
        elif key in self._expiry:
            del self._expiry[key]

    def delete(self, key: str) -> None:
        """Delete a value from the cache."""
        if key in self._store:
            del self._store[key]
        if key in self._expiry:
            del self._expiry[key]
            
    def flush(self) -> None:
        """Clear the entire cache."""
        self._store.clear()
        self._expiry.clear()

# Global instance
cache = LocalCache()
