/**
 * High-performance in-memory client-side cache with Stale-While-Revalidate (SWR)
 * and in-flight request deduplication.
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class ClientCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private inFlight = new Map<string, Promise<unknown>>();
  private defaultTTL: number;

  constructor(defaultTTLMs = 60000) {
    this.defaultTTL = defaultTTLMs;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    return entry.data as T;
  }

  isFresh(key: string, ttl = this.defaultTTL): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp < ttl;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
    this.inFlight.clear();
  }

  /**
   * Fetch with automatic in-flight deduplication and cache storage
   */
  async dedupeFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        const data = await fetcher();
        this.set(key, data);
        return data;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}

export const apiCache = new ClientCache();
