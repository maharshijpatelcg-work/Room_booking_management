import { apiCache } from "./cache";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In browser, use relative path to prevent hostname or protocol mismatch
    return "";
  }
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}/api${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}

/**
 * Cached GET fetch with in-flight deduplication
 */
async function cachedGet<T>(
  endpoint: string,
  options?: { bypassCache?: boolean; ttl?: number }
): Promise<ApiResponse<T>> {
  const cacheKey = `GET:${endpoint}`;

  if (!options?.bypassCache && apiCache.isFresh(cacheKey, options?.ttl)) {
    const cached = apiCache.get<ApiResponse<T>>(cacheKey);
    if (cached) return cached;
  }

  return apiCache.dedupeFetch(cacheKey, () => fetchAPI<T>(endpoint));
}

// Invalidate helpers
export function invalidateCache(tag: "resources" | "bookings" | "returns" | "analytics" | "all") {
  if (tag === "all") {
    apiCache.clear();
  } else {
    apiCache.invalidatePrefix(`GET:/${tag}`);
  }
}

// Resources
export const resourcesAPI = {
  getAll: (params?: Record<string, string>, bypassCache = false) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return cachedGet(`/resources${qs}`, { bypassCache, ttl: 45000 });
  },
  getById: (id: string, bypassCache = false) =>
    cachedGet(`/resources/${id}`, { bypassCache, ttl: 45000 }),
  create: async (data: unknown) => {
    const res = await fetchAPI("/resources", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/resources");
      apiCache.invalidatePrefix("GET:/analytics");
    }
    return res;
  },
  update: async (id: string, data: unknown) => {
    const res = await fetchAPI(`/resources/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/resources");
      apiCache.invalidatePrefix("GET:/analytics");
    }
    return res;
  },
  delete: async (id: string) => {
    const res = await fetchAPI(`/resources/${id}`, { method: "DELETE" });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/resources");
      apiCache.invalidatePrefix("GET:/analytics");
    }
    return res;
  },
};

// Bookings
export const bookingsAPI = {
  getAll: (params?: Record<string, string>, bypassCache = false) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return cachedGet(`/bookings${qs}`, { bypassCache, ttl: 30000 });
  },
  getById: (id: string, bypassCache = false) =>
    cachedGet(`/bookings/${id}`, { bypassCache, ttl: 30000 }),
  create: async (data: unknown) => {
    const res = await fetchAPI("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/bookings");
      apiCache.invalidatePrefix("GET:/analytics");
      apiCache.invalidatePrefix("GET:/availability");
    }
    return res;
  },
  updateStatus: async (id: string, data: unknown) => {
    const res = await fetchAPI(`/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/bookings");
      apiCache.invalidatePrefix("GET:/analytics");
      apiCache.invalidatePrefix("GET:/returns");
      apiCache.invalidatePrefix("GET:/history");
    }
    return res;
  },
};

// Availability (strictly real-time, short 5s dedupe cache)
export const availabilityAPI = {
  check: (params: {
    resourceId: string;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
  }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return cachedGet(`/availability?${qs}`, { ttl: 5000 });
  },
};

// Returns
export const returnsAPI = {
  getAll: (params?: Record<string, string>, bypassCache = false) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return cachedGet(`/returns${qs}`, { bypassCache, ttl: 30000 });
  },
  create: async (data: unknown) => {
    const res = await fetchAPI("/returns", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/returns");
      apiCache.invalidatePrefix("GET:/bookings");
      apiCache.invalidatePrefix("GET:/resources");
      apiCache.invalidatePrefix("GET:/analytics");
      apiCache.invalidatePrefix("GET:/history");
    }
    return res;
  },
  update: async (id: string, data: unknown) => {
    const res = await fetchAPI(`/returns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (res.success) {
      apiCache.invalidatePrefix("GET:/returns");
      apiCache.invalidatePrefix("GET:/analytics");
    }
    return res;
  },
};

// Analytics (cached with SWR)
export const analyticsAPI = {
  get: (bypassCache = false) =>
    cachedGet("/analytics", { bypassCache, ttl: 20000 }),
};

// CSV Export helper
export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str = val === null || val === undefined ? "" : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
