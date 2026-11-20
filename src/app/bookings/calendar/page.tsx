"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import BookingCalendar from "@/components/bookings/BookingCalendar";
import Button from "@/components/common/Button";
import { CalendarSkeleton } from "@/components/common/Skeletons";
import { useBookings } from "@/hooks/useBookings";
import { useResources } from "@/hooks/useResources";
import { Plus, ListFilter, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CalendarPage() {
  const { bookings, loading: bookingsLoading } = useBookings();
  const { resources, loading: resourcesLoading } = useResources();

  const loading = bookingsLoading || resourcesLoading;

  return (
    <DashboardLayout title="Calendar">
      <div className="space-y-6 max-w-[1200px] mx-auto">
        {/* Header matching reference */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link
              href="/bookings"
              className="p-2 text-[#55536B] hover:text-[#1B1A2E] hover:bg-white rounded-xl border border-[#E4E2DA] transition-colors shadow-xs mt-1"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-[#1B1A2E] tracking-tight">
                Availability Calendar
              </h1>
              <p className="text-sm text-[#55536B] mt-1">
                Visual day, week, and month booking timeline across equipment inventory.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/bookings">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ListFilter size={13} className="text-[#55536B]" />}
              >
                List View
              </Button>
            </Link>
            <Link href="/bookings/new">
              <Button variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                New Booking
              </Button>
            </Link>
          </div>
        </div>

        {loading && bookings.length === 0 ? (
          <CalendarSkeleton />
        ) : (
          <BookingCalendar bookings={bookings} resources={resources} />
        )}
      </div>
    </DashboardLayout>
  );
}
