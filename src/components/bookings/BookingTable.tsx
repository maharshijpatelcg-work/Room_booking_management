"use client";

import { useState } from "react";
import type { IBooking, IResource } from "@/types";
import Button from "@/components/common/Button";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import Modal from "@/components/common/Modal";
import { formatDate } from "@/utils/dateUtils";
import {
  CheckCircle2,
  XCircle,
  Ban,
  Eye,
  FileText,
  ArrowRight,
  Calendar,
  Layers,
  Clock,
  User,
} from "lucide-react";

interface BookingTableProps {
  bookings: IBooking[];
  onUpdateStatus: (
    id: string,
    data: {
      status: string;
      managerNotes?: string;
      issuedQuantity?: number;
      expectedReturnDate?: string;
    }
  ) => Promise<boolean>;
  onOpenReturn?: (booking: IBooking) => void;
}

export default function BookingTable({
  bookings,
  onUpdateStatus,
  onOpenReturn,
}: BookingTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);
  const [actionModal, setActionModal] = useState<{
    booking: IBooking;
    type: "Approve" | "Reject" | "Cancel";
  } | null>(null);
  const [managerNotes, setManagerNotes] = useState("");
  const [issuedQuantity, setIssuedQuantity] = useState(1);
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenAction = (
    booking: IBooking,
    type: "Approve" | "Reject" | "Cancel"
  ) => {
    setActionModal({ booking, type });
    setManagerNotes(booking.managerNotes || "");
    setIssuedQuantity(booking.quantity);
    const returnD = booking.endDate
      ? new Date(booking.endDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setExpectedReturnDate(returnD);
  };

  const handleConfirmAction = async () => {
    if (!actionModal) return;
    setSubmitting(true);
    let targetStatus = "Pending";
    if (actionModal.type === "Approve") targetStatus = "Approved";
    if (actionModal.type === "Reject") targetStatus = "Rejected";
    if (actionModal.type === "Cancel") targetStatus = "Cancelled";

    const payload: {
      status: string;
      managerNotes?: string;
      issuedQuantity?: number;
      expectedReturnDate?: string;
    } = {
      status: targetStatus,
      managerNotes,
    };

    if (actionModal.type === "Approve") {
      payload.issuedQuantity = Number(issuedQuantity);
      payload.expectedReturnDate = expectedReturnDate;
    }

    const success = await onUpdateStatus(actionModal.booking._id!, payload);
    setSubmitting(false);
    if (success) {
      setActionModal(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200/80 bg-offWhite/80 text-mutedTeal uppercase text-[10px] tracking-wider font-semibold">
              <th className="text-left px-4 py-3.5">Reference</th>
              <th className="text-left px-4 py-3.5">Resource Asset</th>
              <th className="text-left px-4 py-3.5">Requester</th>
              <th className="text-left px-4 py-3.5">Schedule & Times</th>
              <th className="text-center px-4 py-3.5">Req Qty</th>
              <th className="text-center px-4 py-3.5">Issued / Ret</th>
              <th className="text-center px-4 py-3.5">Status</th>
              <th className="text-right px-4 py-3.5">Workflow Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {bookings.map((booking) => {
              const res = booking.resource as IResource;
              const resourceName =
                typeof res === "object" && res ? res.name : "Unknown Asset";

              return (
                <tr
                  key={booking._id}
                  className="hover:bg-offWhite/40 transition-colors"
                >
                  <td className="px-4 py-3 font-mono font-semibold text-deepIndigo whitespace-nowrap">
                    {booking.bookingReference}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-charcoal">{resourceName}</p>
                    {typeof res === "object" && res?.category && (
                      <span className="text-[10px] text-mutedTeal font-medium">
                        {res.category}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-charcoal">
                      {booking.requesterName}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {booking.department || booking.requesterEmail}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <div>
                      {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                    </div>
                    <div className="text-[10px] text-mutedTeal font-mono">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-charcoal">
                    {booking.quantity}
                  </td>
                  <td className="px-4 py-3 text-center text-xs">
                    <span className="font-bold text-mutedIndigo">
                      {booking.issuedQuantity || 0}
                    </span>{" "}
                    /{" "}
                    <span className="font-bold text-mutedTeal">
                      {booking.returnedQuantity || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <BookingStatusBadge status={booking.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                        leftIcon={<Eye size={12} className="text-mutedTeal" />}
                        className="text-mutedTeal hover:text-charcoal"
                      >
                        Details
                      </Button>

                      {booking.status === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-mutedTeal hover:bg-softSage/20 font-semibold"
                            onClick={() => handleOpenAction(booking, "Approve")}
                            leftIcon={<CheckCircle2 size={13} className="text-mutedTeal" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 font-semibold"
                            onClick={() => handleOpenAction(booking, "Reject")}
                            leftIcon={<XCircle size={13} />}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {booking.status === "Approved" && (
                        <>
                          {onOpenReturn &&
                            (booking.issuedQuantity || 0) >
                              (booking.returnedQuantity || 0) && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="font-semibold text-xs"
                                onClick={() => onOpenReturn(booking)}
                                rightIcon={<ArrowRight size={12} />}
                              >
                                Check In
                              </Button>
                            )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:bg-offWhite text-xs"
                            onClick={() => handleOpenAction(booking, "Cancel")}
                            leftIcon={<Ban size={12} />}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Booking Record #${selectedBooking?.bookingReference}`}
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] text-mutedTeal uppercase tracking-wider font-semibold">
                  Reservation Status
                </span>
                <div className="mt-1">
                  <BookingStatusBadge status={selectedBooking.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-mutedTeal uppercase tracking-wider font-semibold">
                  Quantity Allocated
                </span>
                <p className="text-base font-bold text-charcoal">
                  {selectedBooking.quantity} units
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-offWhite/50 p-3 rounded-lg border border-gray-100">
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                  Requester Name
                </span>
                <p className="font-semibold text-charcoal text-sm mt-0.5">
                  {selectedBooking.requesterName}
                </p>
                <p className="text-gray-400 text-[11px]">
                  {selectedBooking.department || "General Department"}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                  Contact Email
                </span>
                <p className="font-mono text-charcoal text-xs mt-0.5">
                  {selectedBooking.requesterEmail}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                Stated Purpose & Project Description
              </span>
              <p className="text-charcoal bg-offWhite/60 p-3 rounded-lg border border-gray-200 mt-1 leading-relaxed">
                {selectedBooking.purpose}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
                <span className="text-[10px] text-mutedTeal uppercase font-semibold block">
                  Reservation Period
                </span>
                <p className="font-medium text-charcoal mt-0.5">
                  {formatDate(selectedBooking.startDate)} to{" "}
                  {formatDate(selectedBooking.endDate)}
                </p>
                <p className="text-[11px] text-mutedIndigo font-mono mt-0.5">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
                <span className="text-[10px] text-mutedTeal uppercase font-semibold block">
                  Issuance & Return Metrics
                </span>
                <p className="font-medium text-charcoal mt-0.5">
                  Issued: {selectedBooking.issuedQuantity || 0} | Returned:{" "}
                  {selectedBooking.returnedQuantity || 0}
                </p>
                {selectedBooking.expectedReturnDate && (
                  <p className="text-[11px] text-mutedTeal mt-0.5">
                    Expected: {formatDate(selectedBooking.expectedReturnDate)}
                  </p>
                )}
              </div>
            </div>

            {selectedBooking.managerNotes && (
              <div>
                <span className="text-[10px] text-mutedTeal uppercase font-semibold">
                  Administrative / Manager Notes
                </span>
                <p className="text-charcoal bg-softSage/10 p-3 rounded-lg border border-softSage/40 mt-1">
                  {selectedBooking.managerNotes}
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBooking(null)}
              >
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve / Reject / Cancel Action Modal */}
      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={`${actionModal?.type} Booking Application`}
        size="sm"
      >
        {actionModal && (
          <div className="space-y-4 text-xs">
            <p className="text-gray-600 leading-relaxed">
              {actionModal.type === "Approve"
                ? `Authorizing reference ${actionModal.booking.bookingReference} for ${actionModal.booking.requesterName}. Confirm issued units and scheduled return date.`
                : actionModal.type === "Reject"
                ? `Declining reservation ${actionModal.booking.bookingReference}. Reserved asset quota will be returned to available inventory.`
                : `Cancelling active reservation ${actionModal.booking.bookingReference}.`}
            </p>

            {actionModal.type === "Approve" && (
              <div className="space-y-3 bg-offWhite/50 p-3 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
                    Units to Issue Immediately *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={actionModal.booking.quantity}
                    value={issuedQuantity}
                    onChange={(e) => setIssuedQuantity(Number(e.target.value))}
                    className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
                    Scheduled Due Return Date *
                  </label>
                  <input
                    type="date"
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
                Administrative Notes / Remarks
              </label>
              <textarea
                rows={3}
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                placeholder="Operational notes, condition notes, or rationale..."
                className="w-full border border-gray-200 bg-offWhite/40 rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActionModal(null)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant={actionModal.type === "Approve" ? "primary" : "danger"}
                size="sm"
                loading={submitting}
                onClick={handleConfirmAction}
              >
                Confirm {actionModal.type}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
