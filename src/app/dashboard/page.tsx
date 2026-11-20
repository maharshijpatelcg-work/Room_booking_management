"use client";

import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentBookings from "@/components/dashboard/RecentBookings";
import Loader from "@/components/common/Loader";
import Button from "@/components/common/Button";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import { DashboardSkeleton, SkeletonBlock } from "@/components/common/Skeletons";
import { useAnalytics } from "@/hooks/useAnalytics";

const BookingChart = dynamic(
  () => import("@/components/dashboard/BookingChart"),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E4E2DA] p-6 h-[340px] flex flex-col justify-between">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-[230px] w-full rounded-xl" />
        </div>
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E4E2DA] p-6 h-[340px] flex flex-col justify-between">
          <SkeletonBlock className="h-4 w-40" />
          <div className="flex items-center justify-center h-[230px]">
            <SkeletonBlock className="h-36 w-36 rounded-full" />
          </div>
        </div>
      </div>
    ),
  }
);
import {
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  BookOpen,
  Boxes,
  Plus,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/dateUtils";
import { getCategoryBadge } from "@/utils/formatters";
import type { IBooking, IResource } from "@/types";

export default function DashboardPage() {
  const { analytics, loading, error, refetch } = useAnalytics();

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 max-w-[1200px] mx-auto">
        {/* Page Header (Minimal, elegant, no dark gradient) */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#0F766E] uppercase tracking-wider">
              <span>Campus Resource Management</span>
              <span>•</span>
              <span className="text-[#55536B]">{todayFormatted}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#1B1A2E] tracking-tight mt-1">
              Equipment & Resource Overview
            </h1>
            <p className="text-sm text-[#55536B] mt-1 max-w-xl">
              Monitor real-time inventory allocation, review reservation requests, and track returns across campus facilities.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/bookings/calendar">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Calendar size={14} className="text-[#0F766E]" />}
              >
                Calendar
              </Button>
            </Link>
            <Link href="/bookings/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={14} />}
              >
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {loading && !analytics && <DashboardSkeleton />}

        {error && !analytics && (
          <div className="bg-[#FFEDD5] border border-orange-200 rounded-2xl p-4 text-xs text-[#9A3412] flex items-center justify-between">
            <span>{error}. Check database credentials and network connectivity.</span>
            <Button size="sm" variant="outline" onClick={refetch}>
              Retry Sync
            </Button>
          </div>
        )}

        {analytics && (
          <>
            {/* 6 Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <StatsCard
                title="Total Resources"
                value={analytics.totalResources}
                icon={<Package size={17} />}
                variant="teal"
                subtitle="Catalogued assets"
              />
              <StatsCard
                title="Available Resources"
                value={analytics.availableResources}
                icon={<CheckCircle size={17} />}
                variant="teal"
                subtitle="Ready for checkout"
              />
              <StatsCard
                title="Total Bookings"
                value={analytics.totalBookings}
                icon={<BookOpen size={17} />}
                variant="muted"
                subtitle="Cumulative requests"
              />
              <StatsCard
                title="Pending Requests"
                value={analytics.pendingRequests}
                icon={<Clock size={17} />}
                variant={analytics.pendingRequests > 0 ? "warn" : "muted"}
                subtitle="Awaiting approval"
              />
              <StatsCard
                title="Currently Issued"
                value={analytics.currentlyIssued}
                icon={<Boxes size={17} />}
                variant="teal"
                subtitle="In active custody"
              />
              <StatsCard
                title="Overdue Returns"
                value={analytics.overdueReturns}
                icon={<AlertTriangle size={17} />}
                variant={analytics.overdueReturns > 0 ? "warn" : "muted"}
                subtitle="Past scheduled date"
              />
            </div>

            {/* Analytics Charts */}
            <BookingChart
              monthlyData={analytics.monthlyTrends || analytics.monthlyBookings || []}
              categoryData={analytics.categoryDistribution || []}
              statusData={analytics.statusCounts || analytics.bookingsByStatus || {}}
              totalResources={analytics.totalResources}
              availableResources={analytics.availableResources}
            />

            {/* Below Charts Section: Recent Bookings & Side Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Recent Bookings (7 cols) */}
              <div className="lg:col-span-7">
                <RecentBookings bookings={analytics.recentBookings || []} />
              </div>

              {/* Right Column: Most Booked & Recently Added (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Most Booked Resources */}
                <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
                    <h3 className="text-sm font-bold text-[#1B1A2E]">
                      Most Booked Resources
                    </h3>
                    <Link
                      href="/resources"
                      className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Inventory</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>

                  {(!analytics.mostBookedResources || analytics.mostBookedResources.length === 0) ? (
                    <p className="text-xs text-[#55536B] py-4 text-center italic">
                      No utilization data logged yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {(analytics.mostBookedResources || []).slice(0, 4).map((item, idx) => (
                        <div
                          key={item.resourceId || idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#F4F3EF]/60 hover:bg-[#F4F3EF] transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-[#1B1A2E] truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-[#55536B]">{item.category}</p>
                          </div>
                          <span className="text-xs font-bold text-[#0F766E] bg-white px-2.5 py-1 rounded-lg border border-[#E4E2DA] shrink-0">
                            {item.bookingCount} bookings
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recently Added Resources */}
                <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
                    <h3 className="text-sm font-bold text-[#1B1A2E]">
                      Recently Catalogued Assets
                    </h3>
                    <Link
                      href="/resources"
                      className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>View All</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>

                  {(!analytics.recentlyAddedResources || analytics.recentlyAddedResources.length === 0) ? (
                    <p className="text-xs text-[#55536B] py-4 text-center italic">
                      No recent inventory additions
                    </p>
                  ) : (
                    <div className="divide-y divide-[#E4E2DA]/40">
                      {(analytics.recentlyAddedResources || []).slice(0, 3).map((res) => {
                        const badge = getCategoryBadge(res.category);
                        return (
                          <div key={res._id} className="py-2.5 flex items-center justify-between">
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-bold text-[#1B1A2E] truncate">
                                {res.name}
                              </p>
                              <span
                                className={`inline-block mt-0.5 text-[9px] px-1.5 py-0.2 rounded font-semibold ${badge.bg} ${badge.text}`}
                              >
                                {res.category}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-[#1B1A2E]">
                                {res.available}/{res.totalQuantity}
                              </span>
                              <span className="text-[10px] text-[#55536B] block">in stock</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Bookings & Pending Requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upcoming Bookings */}
              <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
                  <h3 className="text-sm font-bold text-[#1B1A2E]">
                    Upcoming Scheduled Reservations
                  </h3>
                  <Link
                    href="/bookings/calendar"
                    className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Calendar</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {(!analytics.upcomingBookings || analytics.upcomingBookings.length === 0) ? (
                  <p className="text-xs text-[#55536B] py-6 text-center italic">
                    No upcoming reservations scheduled for the next 7 days
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {(analytics.upcomingBookings || []).slice(0, 4).map((b) => {
                      const res = b.resource as IResource;
                      const rName = typeof res === "object" && res ? res.name : "Resource";

                      return (
                        <div
                          key={b._id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#F4F3EF]/60 hover:bg-[#F4F3EF] transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-mono text-xs font-bold text-[#0F766E]">
                              {b.bookingReference}
                            </p>
                            <p className="text-xs font-semibold text-[#1B1A2E] truncate">
                              {rName}
                            </p>
                            <p className="text-[10px] text-[#55536B]">{b.requesterName}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-[#1B1A2E] block">
                              {formatDate(b.startDate)}
                            </span>
                            <span className="text-[10px] text-[#55536B] font-mono">
                              {b.startTime}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pending Approvals Queue */}
              <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
                  <h3 className="text-sm font-bold text-[#1B1A2E]">
                    Pending Approval Queue
                  </h3>
                  <Link
                    href="/bookings"
                    className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Manage</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {(!analytics.pendingList || analytics.pendingList.length === 0) ? (
                  <p className="text-xs text-[#55536B] py-6 text-center italic">
                    No requests currently pending manager review
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {(analytics.pendingList || []).slice(0, 4).map((b) => {
                      const res = b.resource as IResource;
                      const rName = typeof res === "object" && res ? res.name : "Resource";

                      return (
                        <div
                          key={b._id}
                          className="flex items-center justify-between p-3 rounded-xl bg-[#FFEDD5]/40 border border-orange-200/60 transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-mono text-xs font-bold text-[#9A3412]">
                              {b.bookingReference}
                            </p>
                            <p className="text-xs font-semibold text-[#1B1A2E] truncate">
                              {rName} ({b.quantity} unit{b.quantity > 1 ? "s" : ""})
                            </p>
                            <p className="text-[10px] text-[#55536B]">
                              {b.requesterName} • {formatDate(b.startDate)}
                            </p>
                          </div>
                          <Link href="/bookings">
                            <Button size="sm" variant="secondary">
                              Review
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
