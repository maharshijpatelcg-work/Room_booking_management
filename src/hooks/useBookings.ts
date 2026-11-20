"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { bookingsAPI } from "@/lib/api";
import { apiCache } from "@/lib/cache";
import type { IBooking } from "@/types";
import { toast } from "sonner";

export function useBookings(filters?: Record<string, string>) {
  const filterKey = filters ? "?" + new URLSearchParams(filters).toString() : "";
  const cacheKey = `GET:/bookings${filterKey}`;

  // Synchronously initialize from cache if available
  const [bookings, setBookings] = useState<IBooking[]>(() => {
    const cached = apiCache.get<{ success: boolean; data?: IBooking[] }>(cacheKey);
    return cached?.success && cached?.data ? cached.data : [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    return !apiCache.isFresh(cacheKey, 30000);
  });

  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchBookings = useCallback(
    async (bypassCache = false) => {
      if (!bookings.length || bypassCache) {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await bookingsAPI.getAll(filters, bypassCache);
        if (!mountedRef.current) return;

        if (res.success) {
          setBookings((res.data as IBooking[]) || []);
        } else {
          setError(res.error || "Failed to load bookings");
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
    [JSON.stringify(filters), bookings.length] // eslint-disable-line
  );

  useEffect(() => {
    if (!apiCache.isFresh(cacheKey, 30000)) {
      fetchBookings(false);
    }
  }, [fetchBookings, cacheKey]);

  const createBooking = async (data: Partial<IBooking>) => {
    const res = await bookingsAPI.create(data);
    if (res.success) {
      toast.success(res.message || "Booking created successfully");
      fetchBookings(true);
      return res.data as IBooking;
    } else {
      toast.error(res.error || "Failed to create booking");
      return null;
    }
  };

  const updateStatus = async (
    id: string,
    data: {
      status: string;
      managerNotes?: string;
      issuedQuantity?: number;
      expectedReturnDate?: string;
    }
  ) => {
    const res = await bookingsAPI.updateStatus(id, data);
    if (res.success) {
      toast.success(res.message || "Status updated");
      fetchBookings(true);
      return true;
    } else {
      toast.error(res.error || "Failed to update status");
      return false;
    }
  };

  return {
    bookings,
    loading: loading && bookings.length === 0, // Never block with spinner if cached data is visible
    isRevalidating: loading && bookings.length > 0,
    error,
    createBooking,
    updateStatus,
    refetch: () => fetchBookings(true),
  };
}
