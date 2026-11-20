"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { analyticsAPI } from "@/lib/api";
import { apiCache } from "@/lib/cache";
import type { AnalyticsData } from "@/types";

const CACHE_KEY = "GET:/analytics";

export function useAnalytics() {
  // Synchronously initialize from cache if available
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(() => {
    const cached = apiCache.get<{ success: boolean; data?: AnalyticsData }>(CACHE_KEY);
    return cached?.success && cached?.data ? cached.data : null;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    return !apiCache.isFresh(CACHE_KEY, 20000);
  });

  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchAnalytics = useCallback(async (bypassCache = false) => {
    // Only show full loader if we have NO existing data
    if (!analytics || bypassCache) {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await analyticsAPI.get(bypassCache);
      if (!mountedRef.current) return;

      if (res.success && res.data) {
        setAnalytics(res.data as AnalyticsData);
      } else {
        setError(res.error || "Failed to load analytics");
      }
    } catch {
      if (mountedRef.current) {
        setError("Network error");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [analytics]);

  useEffect(() => {
    // If cache is stale or missing, fetch
    if (!apiCache.isFresh(CACHE_KEY, 20000)) {
      fetchAnalytics(false);
    }
  }, [fetchAnalytics]);

  return {
    analytics,
    loading: loading && !analytics, // Never block UI if cached data is displayed
    isRevalidating: loading && !!analytics,
    error,
    refetch: () => fetchAnalytics(true),
  };
}
