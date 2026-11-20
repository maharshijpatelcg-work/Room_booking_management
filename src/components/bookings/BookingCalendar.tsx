"use client";

import { useState, useMemo } from "react";
import type { IBooking, IResource } from "@/types";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import { formatDate } from "@/utils/dateUtils";
import { getCategoryBadge } from "@/utils/formatters";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Search,
  Clock,
  User,
  Info,
  Layers,
} from "lucide-react";

interface BookingCalendarProps {
  bookings: IBooking[];
  resources: IResource[];
}

type ViewMode = "day" | "week" | "month";

export default function BookingCalendar({
  bookings,
  resources,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

  // Filtered resources
  const displayedResources = useMemo(() => {
    return resources.filter((res) => {
      const matchesFilter =
        resourceFilter === "all" || res._id === resourceFilter;
      const matchesSearch =
        !searchQuery ||
        res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [resources, resourceFilter, searchQuery]);

  // Navigate dates
  const handleNavigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Generate columns based on view mode
  const calendarColumns = useMemo(() => {
    const cols: {
      key: string;
      label: string;
      subLabel: string;
      date: Date;
    }[] = [];

    if (viewMode === "day") {
      for (let h = 8; h <= 20; h++) {
        const d = new Date(currentDate);
        d.setHours(h, 0, 0, 0);
        cols.push({
          key: `hour-${h}`,
          label: `${h % 12 || 12}:00 ${h >= 12 ? "PM" : "AM"}`,
          subLabel: "",
          date: d,
        });
      }
    } else if (viewMode === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        cols.push({
          key: `day-${i}`,
          label: d.toLocaleDateString("en-US", { weekday: "short" }),
          subLabel: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          date: d,
        });
      }
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        cols.push({
          key: `month-day-${day}`,
          label: `${day}`,
          subLabel: d.toLocaleDateString("en-US", { weekday: "narrow" }),
          date: d,
        });
      }
    }

    return cols;
  }, [currentDate, viewMode]);

  // Check if a booking applies to a specific date/hour
  const getResourceBookingsForCol = (resourceId: string, colDate: Date) => {
    return bookings.filter((b) => {
      const bResId =
        typeof b.resource === "object" && b.resource
          ? (b.resource as IResource)._id
          : b.resource;

      if (bResId !== resourceId) return false;

      const start = new Date(b.startDate);
      const end = new Date(b.endDate);

      if (viewMode === "day") {
        const isSameDay =
          colDate.getFullYear() === start.getFullYear() &&
          colDate.getMonth() === start.getMonth() &&
          colDate.getDate() === start.getDate();
        if (!isSameDay) return false;

        const startHour = parseInt(b.startTime.split(":")[0], 10);
        const endHour = parseInt(b.endTime.split(":")[0], 10);
        const colHour = colDate.getHours();
        return colHour >= startHour && colHour <= endHour;
      }

      const cDateStart = new Date(colDate);
      cDateStart.setHours(0, 0, 0, 0);
      const cDateEnd = new Date(colDate);
      cDateEnd.setHours(23, 59, 59, 999);

      return start <= cDateEnd && end >= cDateStart;
    });
  };

  // Color scheme matching institutional palette
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-mutedTeal text-white hover:bg-mutedTeal/90 shadow-2xs";
      case "Pending":
        return "bg-warmSand text-charcoal border border-amber-300 hover:bg-warmSand/80 font-bold shadow-2xs";
      case "Completed":
        return "bg-mutedIndigo text-white hover:bg-mutedIndigo/90 shadow-2xs";
      case "Rejected":
        return "bg-red-500 text-white hover:bg-red-600 shadow-2xs";
      default:
        return "bg-dustyLavender text-white hover:bg-dustyLavender/90";
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header Controls */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-offWhite border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => handleNavigate("prev")}
              className="p-1.5 hover:bg-white rounded-md text-mutedTeal hover:text-charcoal transition-colors"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleNavigate("today")}
              className="px-3 py-1 text-xs font-semibold hover:bg-white rounded-md text-charcoal transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => handleNavigate("next")}
              className="p-1.5 hover:bg-white rounded-md text-mutedTeal hover:text-charcoal transition-colors"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
            <CalendarIcon size={16} className="text-mutedIndigo" />
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
              ...(viewMode === "day" ? { day: "numeric" } : {}),
            })}
          </h3>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex bg-offWhite p-1 rounded-lg border border-gray-200 text-xs font-medium">
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "day"
                  ? "bg-mutedIndigo text-white font-semibold shadow-xs"
                  : "text-gray-600 hover:text-charcoal"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "week"
                  ? "bg-mutedIndigo text-white font-semibold shadow-xs"
                  : "text-gray-600 hover:text-charcoal"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "month"
                  ? "bg-mutedIndigo text-white font-semibold shadow-xs"
                  : "text-gray-600 hover:text-charcoal"
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="bg-white rounded-xl border border-gray-200/90 p-3 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-mutedTeal"
          />
          <input
            type="text"
            placeholder="Search resource in timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs text-charcoal bg-offWhite/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo"
          />
        </div>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="text-xs font-medium text-charcoal bg-offWhite/50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 cursor-pointer"
        >
          <option value="all">All Resources ({resources.length})</option>
          {resources.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Status Legend using exact palette colors */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-charcoal ml-auto border-l border-gray-200 pl-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-mutedTeal" />
            Approved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warmSand border border-amber-300" />
            Pending
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-mutedIndigo" />
            Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Rejected
          </span>
        </div>
      </div>

      {/* Resource Timeline Table */}
      <div className="bg-white rounded-xl border border-gray-200/90 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-charcoal text-white border-b border-charcoal/90">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider w-64 min-w-[220px] sticky left-0 bg-charcoal z-10 border-r border-charcoal/70">
                  Resource & Stock
                </th>
                {calendarColumns.map((col) => (
                  <th
                    key={col.key}
                    className="text-center px-2 py-2 text-xs font-medium border-r border-charcoal/40 min-w-[100px]"
                  >
                    <div className="font-semibold text-offWhite text-[11px]">
                      {col.label}
                    </div>
                    {col.subLabel && (
                      <div className="text-[10px] text-softSage font-normal">
                        {col.subLabel}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedResources.length === 0 ? (
                <tr>
                  <td
                    colSpan={calendarColumns.length + 1}
                    className="py-12 text-center text-xs text-gray-400"
                  >
                    No resources cataloged or matching the active criteria
                  </td>
                </tr>
              ) : (
                displayedResources.map((resource) => {
                  const badge = getCategoryBadge(resource.category);

                  return (
                    <tr
                      key={resource._id}
                      className="hover:bg-offWhite/30 transition-colors"
                    >
                      {/* Sticky Resource Column */}
                      <td className="px-4 py-3 text-xs sticky left-0 bg-white hover:bg-offWhite/40 z-10 border-r border-gray-200/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                        <p className="font-bold text-charcoal text-xs truncate max-w-[180px]">
                          {resource.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${badge.bg} ${badge.text}`}
                          >
                            {resource.category}
                          </span>
                          <span className="text-mutedTeal font-medium">
                            {resource.available}/{resource.totalQuantity} Avail
                          </span>
                        </div>
                      </td>

                      {/* Timeline Slots */}
                      {calendarColumns.map((col) => {
                        const colBookings = getResourceBookingsForCol(
                          resource._id!,
                          col.date
                        );

                        return (
                          <td
                            key={col.key}
                            className="px-1.5 py-2 text-xs border-r border-gray-100 align-top relative min-h-[60px]"
                          >
                            {colBookings.length > 0 ? (
                              <div className="space-y-1">
                                {colBookings.map((b) => (
                                  <button
                                    key={b._id}
                                    onClick={() => setSelectedBooking(b)}
                                    className={`w-full text-left p-1.5 rounded text-[10px] leading-tight transition-all truncate block ${getStatusBgColor(
                                      b.status
                                    )}`}
                                    title={`${b.bookingReference} - ${b.requesterName} (${b.quantity} units)`}
                                  >
                                    <div className="font-bold truncate">
                                      {b.requesterName}
                                    </div>
                                    <div className="text-[9px] opacity-90 truncate">
                                      {b.quantity} unit(s) • {b.status}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="h-full min-h-[40px] flex items-center justify-center">
                                <span className="text-[10px] text-gray-200 font-light select-none">
                                  —
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal on click */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Reservation Details"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                  Reference Code
                </span>
                <p className="text-base font-bold text-deepIndigo font-mono">
                  {selectedBooking.bookingReference}
                </p>
              </div>
              <BookingStatusBadge status={selectedBooking.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 bg-offWhite/50 p-3 rounded-lg border border-gray-100">
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold flex items-center gap-1">
                  <User size={12} /> Requester
                </span>
                <p className="text-charcoal font-semibold text-sm mt-0.5">
                  {selectedBooking.requesterName}
                </p>
                <p className="text-[11px] text-gray-400">
                  {selectedBooking.department || selectedBooking.requesterEmail}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                  Units Reserved
                </span>
                <p className="text-charcoal font-bold text-sm mt-0.5">
                  {selectedBooking.quantity} unit(s)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-[10px] text-mutedTeal uppercase font-semibold flex items-center gap-1">
                  <CalendarIcon size={12} /> Dates
                </span>
                <p className="text-charcoal font-medium mt-0.5">
                  {formatDate(selectedBooking.startDate)} to{" "}
                  {formatDate(selectedBooking.endDate)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-[10px] text-mutedTeal uppercase font-semibold flex items-center gap-1">
                  <Clock size={12} /> Time Slot
                </span>
                <p className="text-charcoal font-mono font-medium mt-0.5">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-mutedTeal uppercase font-semibold flex items-center gap-1">
                <Info size={12} /> Stated Purpose
              </span>
              <p className="text-charcoal bg-offWhite/60 p-2.5 rounded-lg text-xs border border-gray-200 mt-1 leading-relaxed">
                {selectedBooking.purpose}
              </p>
            </div>

            {selectedBooking.managerNotes && (
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                  Manager Notes
                </span>
                <p className="text-charcoal bg-softSage/10 p-2.5 rounded-lg text-xs border border-softSage/40 mt-1">
                  {selectedBooking.managerNotes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
