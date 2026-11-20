import React from "react";

/**
 * Reusable pulse shimmer block
 */
export function SkeletonBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse bg-[#E8E6DF] rounded-lg ${className}`}
      style={style}
    />
  );
}

/**
 * Dashboard Skeleton: 6 stat cards + chart area + recent records
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-48 rounded-full" />
          <SkeletonBlock className="h-8 w-80 rounded-xl" />
          <SkeletonBlock className="h-4 w-96 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="h-9 w-24 rounded-full" />
          <SkeletonBlock className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* 6 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E4E2DA] p-4 flex flex-col justify-between h-[104px]"
          >
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-7 w-7 rounded-xl" />
            </div>
            <div className="space-y-1">
              <SkeletonBlock className="h-6 w-12" />
              <SkeletonBlock className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4E2DA] p-6 h-[340px] flex flex-col justify-between">
          <div className="space-y-1">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-64" />
          </div>
          <SkeletonBlock className="h-[210px] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E2DA] p-6 h-[340px] flex flex-col justify-between">
          <div className="space-y-1">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-56" />
          </div>
          <div className="flex items-center justify-center h-[210px]">
            <SkeletonBlock className="h-36 w-36 rounded-full" />
          </div>
        </div>
      </div>

      {/* Secondary Tables Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4E2DA] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#E4E2DA]/50">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-9 w-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <SkeletonBlock className="h-3.5 w-32" />
                    <SkeletonBlock className="h-2.5 w-24" />
                  </div>
                </div>
                <SkeletonBlock className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E2DA] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-44" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#E4E2DA]/50">
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-3.5 w-36" />
                  <SkeletonBlock className="h-2.5 w-20" />
                </div>
                <SkeletonBlock className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inventory Page Skeleton: search + category filters + grid of resource cards
 */
export function InventorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-8 w-60 rounded-xl" />
          <SkeletonBlock className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="h-9 w-28 rounded-full" />
          <SkeletonBlock className="h-9 w-36 rounded-full" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E2DA] p-3 flex flex-wrap items-center gap-3">
        <SkeletonBlock className="h-10 flex-1 min-w-[200px] rounded-full" />
        <SkeletonBlock className="h-10 w-44 rounded-full" />
        <SkeletonBlock className="h-10 w-36 rounded-full" />
        <SkeletonBlock className="h-10 w-24 rounded-full" />
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E4E2DA] overflow-hidden flex flex-col justify-between h-[360px]"
          >
            <SkeletonBlock className="h-44 w-full rounded-none" />
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <SkeletonBlock className="h-3 w-20 rounded-full" />
                <SkeletonBlock className="h-4 w-48" />
                <SkeletonBlock className="h-3 w-full" />
              </div>
              <div className="space-y-2 pt-2 border-t border-[#E4E2DA]">
                <div className="flex justify-between">
                  <SkeletonBlock className="h-3 w-16" />
                  <SkeletonBlock className="h-3 w-12" />
                </div>
                <SkeletonBlock className="h-2 w-full rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Bookings Page Skeleton: filter bar + table rows
 */
export function BookingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-8 w-64 rounded-xl" />
          <SkeletonBlock className="h-4 w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="h-9 w-28 rounded-full" />
          <SkeletonBlock className="h-9 w-36 rounded-full" />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#E4E2DA] overflow-hidden">
        <div className="p-4 border-b border-[#E4E2DA] flex items-center justify-between gap-3">
          <SkeletonBlock className="h-9 w-64 rounded-full" />
          <SkeletonBlock className="h-9 w-32 rounded-full" />
        </div>
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#E4E2DA]/60">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-4 w-44" />
                  <SkeletonBlock className="h-3 w-28" />
                </div>
              </div>
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Calendar Page Skeleton: calendar grid matrix
 */
export function CalendarSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-8 w-60 rounded-xl" />
          <SkeletonBlock className="h-4 w-72 rounded-md" />
        </div>
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="h-9 w-24 rounded-full" />
          <SkeletonBlock className="h-9 w-32 rounded-full" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E2DA] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E2DA]">
          <SkeletonBlock className="h-8 w-48 rounded-xl" />
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-8 w-16 rounded-lg" />
            <SkeletonBlock className="h-8 w-16 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(35)].map((_, i) => (
            <SkeletonBlock key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Returns Page Skeleton: tab bar + cards
 */
export function ReturnsSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-8 w-64 rounded-xl" />
          <SkeletonBlock className="h-4 w-80 rounded-md" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E4E2DA] pb-3">
        <SkeletonBlock className="h-9 w-40 rounded-full" />
        <SkeletonBlock className="h-9 w-40 rounded-full" />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E4E2DA] p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-48" />
                <SkeletonBlock className="h-3 w-32" />
              </div>
            </div>
            <SkeletonBlock className="h-8 w-28 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Audit Trail Page Skeleton: KPI cards + timeline rows
 */
export function AuditTrailSkeleton() {
  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-8 w-44 rounded-xl" />
          <SkeletonBlock className="h-4 w-72 rounded-md" />
        </div>
        <SkeletonBlock className="h-9 w-36 rounded-full" />
      </div>

      {/* 4 KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E4E2DA] p-4 space-y-2 h-[84px]">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-[#E4E2DA] p-3 flex flex-wrap items-center gap-3">
        <SkeletonBlock className="h-10 flex-1 min-w-[200px] rounded-full" />
        <SkeletonBlock className="h-10 w-36 rounded-full" />
        <SkeletonBlock className="h-10 w-36 rounded-full" />
      </div>

      {/* Timeline record cards */}
      <div className="space-y-3.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E4E2DA] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-4 w-44" />
              <SkeletonBlock className="h-6 w-24 rounded-full" />
            </div>
            <SkeletonBlock className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
