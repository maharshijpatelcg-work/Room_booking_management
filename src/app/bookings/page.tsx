"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BookingTable from "@/components/bookings/BookingTable";
import BookingForm from "@/components/bookings/BookingForm";
import ReturnForm from "@/components/returns/ReturnForm";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { BookingsSkeleton } from "@/components/common/Skeletons";
import { useBookings } from "@/hooks/useBookings";
import { useResources } from "@/hooks/useResources";
import { exportToCSV } from "@/lib/api";
import type { IBooking } from "@/types";
import {
  Plus,
  Download,
  Search,
  Filter,
  X,
  Calendar,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const STATUSES = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
  "Completed",
];

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [resourceId, setResourceId] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [returnBooking, setReturnBooking] = useState<IBooking | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  const filterParams = useMemo(() => {
    const f: Record<string, string> = {};
    if (debouncedSearch) f.search = debouncedSearch;
    if (status !== "All") f.status = status;
    if (resourceId !== "All") f.resource = resourceId;
    if (startDate) f.startDate = startDate;
    if (endDate) f.endDate = endDate;
    return f;
  }, [debouncedSearch, status, resourceId, startDate, endDate]);

  const { bookings, loading, createBooking, updateStatus, refetch } =
    useBookings(filterParams);
  const { resources } = useResources();

  const handleCreate = async (data: Record<string, unknown>) => {
    setCreating(true);
    const result = await createBooking(data as Partial<IBooking>);
    setCreating(false);
    if (result) {
      setShowCreateModal(false);
    }
    return result;
  };

  const handleExport = () => {
    const rows = bookings.map((b) => {
      const res = b.resource as { name?: string };
      return {
        Reference: b.bookingReference,
        Resource: typeof res === "object" && res ? res.name : "Unknown",
        Requester: b.requesterName,
        Email: b.requesterEmail,
        Department: b.department || "General",
        Purpose: b.purpose,
        "Start Date": b.startDate
          ? new Date(b.startDate).toLocaleDateString()
          : "",
        "End Date": b.endDate ? new Date(b.endDate).toLocaleDateString() : "",
        "Start Time": b.startTime,
        "End Time": b.endTime,
        Quantity: b.quantity,
        Status: b.status,
        Issued: b.issuedQuantity || 0,
        Returned: b.returnedQuantity || 0,
      };
    });
    exportToCSV(
      rows as unknown as Record<string, unknown>[],
      "bookings_schedule.csv"
    );
  };

  const handleReturnRecorded = () => {
    setReturnBooking(null);
    refetch();
  };

  const hasFilters =
    search ||
    status !== "All" ||
    resourceId !== "All" ||
    startDate ||
    endDate;

  return (
    <DashboardLayout title="Bookings">
      <div className="space-y-6 max-w-[1200px] mx-auto">
        {/* Header Banner */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B1A2E] tracking-tight">
              Booking Management
            </h1>
            <p className="text-sm text-[#55536B] mt-1">
              Review requests, authorize equipment check-outs, and manage active loans.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link href="/bookings/calendar">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Calendar size={13} className="text-[#55536B]" />}
              >
                Calendar View
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={13} className="text-[#55536B]" />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setShowCreateModal(true)}
            >
              New Booking Request
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-[#E4E2DA] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55536B]"
              />
              <input
                type="text"
                placeholder="Search by requester name, reference code, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs text-[#1B1A2E] bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full px-3 py-1">
              <Filter size={13} className="text-[#55536B]" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="text-xs font-medium text-[#1B1A2E] bg-transparent py-1 focus:outline-none cursor-pointer"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st === "All" ? "All Statuses" : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Filter */}
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="text-xs font-medium text-[#1B1A2E] bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer"
            >
              <option value="All">All Resources</option>
              {resources.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-2.5 border-t border-[#E4E2DA]/60 text-xs">
            <span className="text-[11px] font-semibold text-[#55536B] uppercase tracking-wider">
              Date Filter:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs text-[#1B1A2E] border border-[#E4E2DA] bg-[#F4F3EF]/40 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />
            <span className="text-xs text-[#55536B]">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs text-[#1B1A2E] border border-[#E4E2DA] bg-[#F4F3EF]/40 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatus("All");
                  setResourceId("All");
                  setStartDate("");
                  setEndDate("");
                }}
                leftIcon={<X size={12} className="text-[#55536B]" />}
                className="ml-auto text-xs text-[#55536B] hover:text-[#1B1A2E]"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>

        {/* Content Table */}
        {loading && bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E2DA] p-6 space-y-4">
            <div className="h-6 w-48 bg-[#E8E6DF] rounded animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[#E4E2DA]/60 animate-pulse">
                <div className="h-4 w-40 bg-[#E8E6DF] rounded" />
                <div className="h-4 w-28 bg-[#E8E6DF] rounded" />
                <div className="h-6 w-20 bg-[#E8E6DF] rounded-full" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            title="No Bookings Recorded"
            description="No active reservations match your criteria. Create a booking request to start using inventory."
            icon={<BookOpen size={28} className="text-[#0F766E]" />}
            action={{
              label: "New Booking Request",
              onClick: () => setShowCreateModal(true),
            }}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <BookingTable
              bookings={bookings}
              onUpdateStatus={updateStatus}
              onOpenReturn={(b) => setReturnBooking(b)}
            />
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Submit New Reservation Request"
        size="lg"
      >
        <BookingForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={creating}
        />
      </Modal>

      {/* Record Return Modal */}
      <Modal
        isOpen={!!returnBooking}
        onClose={() => setReturnBooking(null)}
        title={`Check In & Inspect Asset (${returnBooking?.bookingReference})`}
        size="md"
      >
        {returnBooking && (
          <ReturnForm
            preselectedBookingId={returnBooking._id}
            maxAllowed={
              (returnBooking.issuedQuantity || 0) -
              (returnBooking.returnedQuantity || 0)
            }
            onSuccess={handleReturnRecorded}
            onCancel={() => setReturnBooking(null)}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
