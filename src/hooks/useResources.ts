"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { resourcesAPI } from "@/lib/api";
import { apiCache } from "@/lib/cache";
import type { IResource } from "@/types";
import { toast } from "sonner";

export function useResources(filters?: Record<string, string>) {
  const filterKey = filters ? "?" + new URLSearchParams(filters).toString() : "";
  const cacheKey = `GET:/resources${filterKey}`;

  // Synchronously initialize from cache if available
  const [resources, setResources] = useState<IResource[]>(() => {
    const cached = apiCache.get<{ success: boolean; data?: IResource[] }>(cacheKey);
    return cached?.success && cached?.data ? cached.data : [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    return !apiCache.isFresh(cacheKey, 45000);
  });

  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchResources = useCallback(
    async (bypassCache = false) => {
      if (!resources.length || bypassCache) {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await resourcesAPI.getAll(filters, bypassCache);
        if (!mountedRef.current) return;

        if (res.success) {
          setResources((res.data as IResource[]) || []);
        } else {
          setError(res.error || "Failed to load resources");
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
    },
    [JSON.stringify(filters), resources.length] // eslint-disable-line
  );

  useEffect(() => {
    if (!apiCache.isFresh(cacheKey, 45000)) {
      fetchResources(false);
    }
  }, [fetchResources, cacheKey]);

  const createResource = async (data: Partial<IResource>) => {
    const res = await resourcesAPI.create(data);
    if (res.success) {
      toast.success(res.message || "Resource created");
      fetchResources(true);
      return true;
    } else {
      toast.error(res.error || "Failed to create resource");
      return false;
    }
  };

  const updateResource = async (id: string, data: Partial<IResource>) => {
    const res = await resourcesAPI.update(id, data);
    if (res.success) {
      toast.success(res.message || "Resource updated");
      fetchResources(true);
      return true;
    } else {
      toast.error(res.error || "Failed to update resource");
      return false;
    }
  };

  const deleteResource = async (id: string) => {
    const res = await resourcesAPI.delete(id);
    if (res.success) {
      toast.success(res.message || "Resource deleted");
      fetchResources(true);
      return true;
    } else {
      toast.error(res.error || "Failed to delete resource");
      return false;
    }
  };

  return {
    resources,
    loading: loading && resources.length === 0, // Never block with spinner if cached data is visible
    isRevalidating: loading && resources.length > 0,
    error,
    createResource,
    updateResource,
    deleteResource,
    refetch: () => fetchResources(true),
  };
}
