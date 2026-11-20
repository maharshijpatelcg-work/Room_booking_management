"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmptyState from "@/components/common/EmptyState";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import { AuditTrailSkeleton } from "@/components/common/Skeletons";
import { bookingsAPI, resourcesAPI, exportToCSV } from "@/lib/api";
import type { IBooking, IResource } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import {
  Download,
  Search,
  ChevronDown,
  Calendar as CalendarIcon,
  AlertTriangle,
  History,
} from "lucide-react";

export default function HistoryPage() {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [resourceFilter, setResourceFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(handler);
  }, [search]);

  const loadData = async (forceFresh = false) => {
    if (!bookings.length && !resources.length) {
      setLoading(true);
    }
    const [bRes, rRes] = await Promise.all([
      bookingsAPI.getAll(undefined, forceFresh),
      resourcesAPI.getAll(undefined, forceFresh),
    ]);

    if (bRes.success) setBookings((bRes.data as IBooking[]) || []);
    if (rRes.success) setResources((rRes.data as IResource[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const res = b.resource as IResource;
    const rName = typeof res === "object" && res ? res.name : "";
    const bRef = b.bookingReference || "";
    const reqName = b.requesterName || "";

    const matchesSearch =
      !debouncedSearch ||
      rName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      bRef.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      reqName.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesResource =
      resourceFilter === "All" ||
      (typeof res === "object" && res
        ? res._id === resourceFilter
        : b.resource === resourceFilter);

    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(b.startDate) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(b.endDate) <= new Date(endDate);
    }

    return matchesSearch && matchesStatus && matchesResource && matchesDate;
  });

  // Calculate summary metrics for the 4 top cards
  const totalRecords = bookings.length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const totalIssued = bookings.reduce((acc, b) => acc + (b.issuedQuantity || 0), 0);
  const totalReturned = bookings.reduce((acc, b) => acc + (b.returnedQuantity || 0), 0);
  const needsAttentionCount = bookings.filter(
    (b) =>
      b.status === "Pending" ||
      (b.status === "Approved" && (b.issuedQuantity || 0) > (b.returnedQuantity || 0))
  ).length;

  const handleExport = () => {
    const rows = filteredBookings.map((b) => {
      const res = b.resource as IResource;
      return {
        Reference: b.bookingReference,
        Resource: typeof res === "object" && res ? res.name : "Asset not linked",
        Requester: b.requesterName,
        Email: b.requesterEmail,
        Department: b.department || "General",
        "Start Date": formatDate(b.startDate),
        "End Date": formatDate(b.endDate),
        "Start Time": b.startTime,
        "End Time": b.endTime,
        Quantity: b.quantity,
        Issued: b.issuedQuantity || 0,
        Returned: b.returnedQuantity || 0,
        Status: b.status,
        "Actual Return": b.actualReturnDate
          ? formatDate(b.actualReturnDate)
          : "—",
        Purpose: b.purpose,
      };
    });
    exportToCSV(rows as unknown as Record<string, unknown>[], "audit_trail_ledger.csv");
  };

  return (
    <DashboardLayout title="Audit Trail">
      <div className="space-y-6 max-w-[1200px] mx-auto">
        {/* Header matching screenshot */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B1A2E] tracking-tight">
              Audit trail
            </h1>
            <p className="text-sm text-[#55536B] mt-1">
              Every booking, allocation and return, in one timeline.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1B1A2E] text-white text-xs font-semibold hover:bg-[#27363A] transition-all shadow-sm"
          >
            Export ledger (CSV)
          </button>
        </div>

        {/* 4 Summary Cards matching screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E4E2DA] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-[#55536B]">Total records</p>
            <p className="text-3xl font-bold text-[#1B1A2E] mt-2">{totalRecords}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4E2DA] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-[#55536B]">Completed</p>
            <p className="text-3xl font-bold text-[#0F766E] mt-2">{completedCount}</p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4E2DA] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-[#55536B]">Units issued / returned</p>
            <p className="text-3xl font-bold text-[#1B1A2E] mt-2">
              {totalIssued} / {totalReturned}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4E2DA] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-xs font-medium text-[#55536B]">Needs attention</p>
            <p className="text-3xl font-bold text-[#9A3412] mt-2">{needsAttentionCount}</p>
          </div>
        </div>

        {/* Search & Filter Bar matching screenshot */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[260px]">
            <input
              type="text"
              placeholder="Search by reference, asset or requester"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-[#E4E2DA] rounded-full px-5 py-2.5 text-xs text-[#1B1A2E] placeholder:text-[#55536B] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] shadow-xs transition-all"
            />
          </div>

          {/* Status select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E4E2DA] rounded-full pl-4 pr-9 py-2.5 text-xs text-[#1B1A2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer shadow-xs"
            >
              <option value="All">All statuses</option>
              <option value="Completed">Completed</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55536B] pointer-events-none" />
          </div>

          {/* Resource select */}
          <div className="relative">
            <select
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E4E2DA] rounded-full pl-4 pr-9 py-2.5 text-xs text-[#1B1A2E] font-medium focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer shadow-xs max-w-[180px] truncate"
            >
              <option value="All">All resources</option>
              {resources.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55536B] pointer-events-none" />
          </div>

          {/* Date from */}
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="dd-mm-yyyy"
              className="bg-white border border-[#E4E2DA] rounded-full px-4 py-2.5 text-xs text-[#1B1A2E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer shadow-xs"
            />
          </div>

          {/* Date to */}
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="dd-mm-yyyy"
              className="bg-white border border-[#E4E2DA] rounded-full px-4 py-2.5 text-xs text-[#1B1A2E] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer shadow-xs"
            />
          </div>
        </div>

        {/* Audit Cards List */}
        {loading && bookings.length === 0 ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E4E2DA] p-6 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-48 bg-[#E8E6DF] rounded" />
                  <div className="h-6 w-24 bg-[#E8E6DF] rounded-full" />
                </div>
                <div className="h-2 w-full bg-[#E8E6DF] rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title="No matching audit records"
            description="Adjust your search criteria or clear filters to view historical booking and return activities."
            icon={<History size={28} className="text-[#0F766E]" />}
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => {
              const res = b.resource as IResource;
              const hasResource = typeof res === "object" && res && res.name;
              const assetName = hasResource ? res.name : "Asset not linked";

              // Get initials for avatar
              const names = (b.requesterName || "Y K").trim().split(" ");
              const initials =
                names.length >= 2
                  ? `${names[0][0]}${names[1][0]}`.toUpperCase()
                  : (b.requesterName?.[0] || "Y").toUpperCase();

              // Timeline step states
              const isBooked = true;
              const isIssued = (b.issuedQuantity || 0) > 0 || b.status === "Approved" || b.status === "Completed";
              const isReturned =
                b.status === "Completed" ||
                ((b.returnedQuantity || 0) > 0 && (b.returnedQuantity || 0) >= (b.issuedQuantity || 1));

              return (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl border border-[#E4E2DA] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5 transition-all hover:border-[#0F766E]/40"
                >
                  {/* Card top 3 columns: Resource details, Custodian, Scheduled */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Column 1: Reference and Asset Name */}
                    <div>
                      <p className="text-[11px] font-mono tracking-wider text-[#55536B] uppercase font-semibold">
                        {b.bookingReference}
                      </p>
                      <h3 className="text-base font-bold text-[#1B1A2E] mt-1">
                        {assetName}
                      </h3>
                      <div className="mt-2">
                        {!hasResource ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FFEDD5] text-[#9A3412]">
                            Missing resource record
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E3F2EF] text-[#0B5F58]">
                            {res.category || "Equipment"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Column 2: Custodian info */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#55536B] uppercase tracking-wider mb-2">
                        CUSTODIAN
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E3F2EF] text-[#0B5F58] border border-[#0F766E]/20 flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1B1A2E] leading-tight">
                            {b.requesterName}
                          </p>
                          <p className="text-[11px] text-[#55536B] mt-0.5 font-mono">
                            {b.requesterEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Scheduled window */}
                    <div>
                      <p className="text-[10px] font-semibold text-[#55536B] uppercase tracking-wider mb-1">
                        SCHEDULED
                      </p>
                      <p className="text-xs font-semibold text-[#1B1A2E]">
                        {formatDate(b.startDate)} – {formatDate(b.endDate)}
                      </p>
                      <p className="text-[11px] text-[#55536B] font-mono mt-0.5">
                        {b.startTime} - {b.endTime}
                      </p>
                    </div>
                  </div>

                  {/* Quantity row */}
                  <div className="pt-2 border-t border-[#E4E2DA]/60 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold text-[#55536B] uppercase tracking-wider mb-1">
                        QUANTITY
                      </p>
                      <p className="text-xs text-[#1B1A2E] font-medium">
                        Requested <strong className="font-bold">{b.quantity}</strong> · Issued{" "}
                        <strong className="font-bold">{b.issuedQuantity || 0}</strong> · Returned{" "}
                        <strong className="font-bold">{b.returnedQuantity || 0}</strong>
                      </p>
                    </div>

                    <div>
                      <BookingStatusBadge status={b.status} size="sm" />
                    </div>
                  </div>

                  {/* Horizontal Timeline Bar matching reference image */}
                  <div className="pt-3 border-t border-[#E4E2DA]/60">
                    <div className="flex items-center w-full text-xs font-medium">
                      {/* Step 1: Booked */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
                        <span className="text-xs font-semibold text-[#1B1A2E]">Booked</span>
                      </div>

                      {/* Connecting Line 1 */}
                      <div
                        className={`flex-1 h-[2px] mx-3 transition-colors ${
                          isIssued ? "bg-[#0F766E]" : "bg-[#E4E2DA]"
                        }`}
                      />

                      {/* Step 2: Issued */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isIssued ? "bg-[#0F766E]" : "bg-[#E4E2DA]"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            isIssued ? "font-semibold text-[#1B1A2E]" : "text-[#55536B]"
                          }`}
                        >
                          Issued
                        </span>
                      </div>

                      {/* Connecting Line 2 */}
                      <div
                        className={`flex-1 h-[2px] mx-3 transition-colors ${
                          isReturned ? "bg-[#0F766E]" : "bg-[#E4E2DA]"
                        }`}
                      />

                      {/* Step 3: Returned */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            isReturned ? "bg-[#0F766E]" : "bg-[#E4E2DA]"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            isReturned ? "font-semibold text-[#1B1A2E]" : "text-[#55536B]"
                          }`}
                        >
                          Returned
                          {b.actualReturnDate && (
                            <span className="text-[#55536B] font-normal ml-1">
                              · {formatDate(b.actualReturnDate)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
