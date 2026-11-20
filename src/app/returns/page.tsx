"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ReturnForm from "@/components/returns/ReturnForm";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { ReturnsSkeleton } from "@/components/common/Skeletons";
import { returnsAPI, bookingsAPI, exportToCSV } from "@/lib/api";
import type { IReturn, IBooking, IResource } from "@/types";
import { formatDate, isOverdue } from "@/utils/dateUtils";
import { getConditionColor } from "@/utils/formatters";
import {
  RotateCcw,
  Plus,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

export default function ReturnsPage() {
  const [returnsList, setReturnsList] = useState<IReturn[]>([]);
  const [issuedBookings, setIssuedBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "active">("active");
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");

  const loadData = async (forceFresh = false) => {
    if (!returnsList.length && !issuedBookings.length) {
      setLoading(true);
    }
    const [returnsRes, bookingsRes] = await Promise.all([
      returnsAPI.getAll(undefined, forceFresh),
      bookingsAPI.getAll({ status: "Approved" }, forceFresh),
    ]);

    if (returnsRes.success) setReturnsList((returnsRes.data as IReturn[]) || []);
    if (bookingsRes.success) {
      const active = ((bookingsRes.data as IBooking[]) || []).filter(
        (b) => (b.issuedQuantity || 0) > (b.returnedQuantity || 0)
      );
      setIssuedBookings(active);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = () => {
    if (activeTab === "history") {
      const rows = returnsList.map((r) => {
        const res = r.resource as IResource;
        const b = r.booking as IBooking;
        return {
          "Booking Reference":
            typeof b === "object" && b ? b.bookingReference : "",
          Resource: typeof res === "object" && res ? res.name : "",
          "Returned Quantity": r.returnedQuantity,
          "Return Date": formatDate(r.returnDate),
          Condition: r.condition,
          Notes: r.notes || "",
        };
      });
      exportToCSV(
        rows as unknown as Record<string, unknown>[],
        "return_inspection_history.csv"
      );
    } else {
      const rows = issuedBookings.map((b) => {
        const res = b.resource as IResource;
        return {
          Reference: b.bookingReference,
          Resource: typeof res === "object" && res ? res.name : "",
          Requester: b.requesterName,
          "Issued Qty": b.issuedQuantity,
          "Returned Qty": b.returnedQuantity,
          "Outstanding Qty":
            (b.issuedQuantity || 0) - (b.returnedQuantity || 0),
          "Expected Return": formatDate(b.expectedReturnDate || b.endDate),
          Status: isOverdue(b.expectedReturnDate || b.endDate)
            ? "OVERDUE"
            : "ON TIME",
        };
      });
      exportToCSV(
        rows as unknown as Record<string, unknown>[],
        "currently_issued_assets.csv"
      );
    }
  };

  // Filter returns
  const filteredReturns = returnsList.filter((r) => {
    const res = r.resource as IResource;
    const b = r.booking as IBooking;
    const rName = typeof res === "object" && res ? res.name : "";
    const bRef = typeof b === "object" && b ? b.bookingReference : "";

    const matchesSearch =
      !search ||
      rName.toLowerCase().includes(search.toLowerCase()) ||
      bRef.toLowerCase().includes(search.toLowerCase());

    const matchesCondition =
      conditionFilter === "All" || r.condition === conditionFilter;

    return matchesSearch && matchesCondition;
  });

  // Filter active issued items
  const filteredActive = issuedBookings.filter((b) => {
    const res = b.resource as IResource;
    const rName = typeof res === "object" && res ? res.name : "";
    return (
      !search ||
      rName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingReference.toLowerCase().includes(search.toLowerCase()) ||
      b.requesterName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DashboardLayout title="Returns">
      <div className="space-y-6 max-w-[1200px] mx-auto">
        {/* Header matching screenshot */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1B1A2E] tracking-tight">
              Returns & Inspection
            </h1>
            <p className="text-sm text-[#55536B] mt-1">
              Track outstanding check-outs, verify hardware condition, and log physical returns.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
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
              onClick={() => setShowModal(true)}
            >
              Log Asset Return
            </Button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E4E2DA] gap-2">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "active"
                ? "border-[#0F766E] text-[#0F766E]"
                : "border-transparent text-[#55536B] hover:text-[#1B1A2E]"
            }`}
          >
            <span>Currently Issued Assets</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] ${
                issuedBookings.length > 0
                  ? "bg-[#FFEDD5] text-[#9A3412] font-bold border border-orange-200"
                  : "bg-[#F4F3EF] text-[#55536B]"
              }`}
            >
              {issuedBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "history"
                ? "border-[#0F766E] text-[#0F766E]"
                : "border-transparent text-[#55536B] hover:text-[#1B1A2E]"
            }`}
          >
            <span>Return Inspection History</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#F4F3EF] text-[#1B1A2E] font-semibold">
              {returnsList.length}
            </span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-[#E4E2DA] p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55536B]"
            />
            <input
              type="text"
              placeholder="Search by equipment name, requester, or reference code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-[#1B1A2E] bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
            />
          </div>

          {activeTab === "history" && (
            <div className="flex items-center gap-1.5 bg-[#F4F3EF]/60 border border-[#E4E2DA] rounded-full px-3 py-1">
              <Filter size={13} className="text-[#55536B]" />
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="text-xs font-medium text-[#1B1A2E] bg-transparent py-0.5 focus:outline-none cursor-pointer"
              >
                <option value="All">All Conditions</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Damaged">Damaged</option>
                <option value="Needs Maintenance">Needs Maintenance</option>
              </select>
            </div>
          )}
        </div>

        {/* Content Table */}
        {loading && returnsList.length === 0 && issuedBookings.length === 0 ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E4E2DA] p-5 flex items-center justify-between animate-pulse">
                <div className="h-4 w-48 bg-[#E8E6DF] rounded" />
                <div className="h-8 w-24 bg-[#E8E6DF] rounded-full" />
              </div>
            ))}
          </div>
        ) : activeTab === "active" ? (
          /* Active Issued Tab */
          filteredActive.length === 0 ? (
            <EmptyState
              title="No Issued Equipment Outstanding"
              description="All authorized equipment loans have been accounted for, inspected, and restocked."
              icon={<PackageCheck size={28} className="text-[#0F766E]" />}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E2DA] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#E4E2DA] bg-[#F4F3EF]/70 text-[#55536B] uppercase text-[10px] tracking-wider font-semibold">
                      <th className="text-left px-4 py-3.5">Reference</th>
                      <th className="text-left px-4 py-3.5">Resource Asset</th>
                      <th className="text-left px-4 py-3.5">Custodian</th>
                      <th className="text-center px-4 py-3.5">Issued / Ret</th>
                      <th className="text-center px-4 py-3.5">Outstanding</th>
                      <th className="text-left px-4 py-3.5">Due Return Date</th>
                      <th className="text-center px-4 py-3.5">Status</th>
                      <th className="text-right px-4 py-3.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E2DA]/50 bg-white">
                    {filteredActive.map((b) => {
                      const res = b.resource as IResource;
                      const rName =
                        typeof res === "object" && res
                          ? res.name
                          : "Unknown Asset";
                      const overdue = isOverdue(
                        b.expectedReturnDate || b.endDate
                      );
                      const outstanding =
                        (b.issuedQuantity || 0) - (b.returnedQuantity || 0);

                      return (
                        <tr
                          key={b._id}
                          className="hover:bg-[#F4F3EF]/40 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono font-semibold text-[#0F766E] whitespace-nowrap">
                            {b.bookingReference}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#1B1A2E]">
                            {rName}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-[#1B1A2E]">
                              {b.requesterName}
                            </p>
                            <p className="text-[11px] text-[#55536B]">
                              {b.department || b.requesterEmail}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-center text-xs">
                            <span className="font-bold text-[#1B1A2E]">
                              {b.issuedQuantity || 0}
                            </span>{" "}
                            /{" "}
                            <span className="font-bold text-[#0F766E]">
                              {b.returnedQuantity || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-[#1B1A2E] text-sm">
                            {outstanding}
                          </td>
                          <td className="px-4 py-3 text-[#55536B]">
                            {formatDate(b.expectedReturnDate || b.endDate)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {overdue ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9A3412] bg-[#FFEDD5] border border-orange-200 px-2.5 py-0.5 rounded-full">
                                <AlertTriangle size={11} /> Overdue
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B5F58] bg-[#E3F2EF] border border-[#0F766E]/20 px-2.5 py-0.5 rounded-full">
                                <CheckCircle2 size={11} /> On Schedule
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<RotateCcw size={12} />}
                              onClick={() => setShowModal(true)}
                              className="text-xs"
                            >
                              Check In
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* History Tab */
          filteredReturns.length === 0 ? (
            <EmptyState
              title="No Return History Logs Recorded"
              description="Returned assets and physical condition inspections will appear in this ledger."
              icon={<RotateCcw size={28} className="text-[#0F766E]" />}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E2DA] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#E4E2DA] bg-[#F4F3EF]/70 text-[#55536B] uppercase text-[10px] tracking-wider font-semibold">
                      <th className="text-left px-4 py-3.5">Booking Ref</th>
                      <th className="text-left px-4 py-3.5">Resource Asset</th>
                      <th className="text-center px-4 py-3.5">Units Checked In</th>
                      <th className="text-left px-4 py-3.5">Return Date</th>
                      <th className="text-left px-4 py-3.5">Hardware Condition</th>
                      <th className="text-left px-4 py-3.5">Inspection Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E2DA]/50 bg-white">
                    {filteredReturns.map((r) => {
                      const res = r.resource as IResource;
                      const b = r.booking as IBooking;
                      const rName =
                        typeof res === "object" && res
                          ? res.name
                          : "Unknown Resource";
                      const bRef =
                        typeof b === "object" && b ? b.bookingReference : "—";

                      return (
                        <tr
                          key={r._id}
                          className="hover:bg-[#F4F3EF]/40 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono font-semibold text-[#0F766E] whitespace-nowrap">
                            {bRef}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#1B1A2E]">
                            {rName}
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-[#1B1A2E]">
                            {r.returnedQuantity}
                          </td>
                          <td className="px-4 py-3 text-[#55536B]">
                            {formatDate(r.returnDate)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${getConditionColor(
                                r.condition
                              )}`}
                            >
                              {r.condition}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#55536B] max-w-xs truncate">
                            {r.notes || "No defect recorded"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      {/* Record Return Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Check In Equipment Return"
        size="md"
      >
        <ReturnForm
          onSuccess={() => {
            setShowModal(false);
            loadData();
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </DashboardLayout>
  );
}
