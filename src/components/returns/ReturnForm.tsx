"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import { bookingsAPI, returnsAPI } from "@/lib/api";
import type { IBooking, IResource } from "@/types";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, RotateCcw } from "lucide-react";

const CONDITIONS = ["Excellent", "Good", "Damaged", "Needs Maintenance"];

interface ReturnFormProps {
  preselectedBookingId?: string;
  maxAllowed?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReturnForm({
  preselectedBookingId,
  maxAllowed,
  onSuccess,
  onCancel,
}: ReturnFormProps) {
  const [activeBookings, setActiveBookings] = useState<IBooking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    preselectedBookingId || ""
  );
  const [returnedQuantity, setReturnedQuantity] = useState<number>(1);
  const [returnDate, setReturnDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [condition, setCondition] = useState<string>("Good");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    bookingsAPI.getAll({ status: "Approved" }).then((res) => {
      if (res.success) {
        const approved = ((res.data as IBooking[]) || []).filter(
          (b) => (b.issuedQuantity || 0) > (b.returnedQuantity || 0)
        );
        setActiveBookings(approved);
      }
    });
  }, []);

  const selectedBooking = activeBookings.find(
    (b) => b._id === selectedBookingId
  );
  const maxReturnable =
    maxAllowed !== undefined
      ? maxAllowed
      : selectedBooking
      ? (selectedBooking.issuedQuantity || 0) -
        (selectedBooking.returnedQuantity || 0)
      : 1;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedBookingId) e.booking = "Booking record is required";
    if (returnedQuantity < 1) e.returnedQuantity = "Must return at least 1 unit";
    if (returnedQuantity > maxReturnable)
      e.returnedQuantity = `Cannot exceed outstanding issued quantity (${maxReturnable})`;
    if (!returnDate) e.returnDate = "Return date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await returnsAPI.create({
        booking: selectedBookingId,
        returnedQuantity: Number(returnedQuantity),
        returnDate,
        condition,
        notes,
      });

      setLoading(false);
      if (res.success) {
        toast.success(res.message || "Equipment return logged & verified successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to record return");
      }
    } catch {
      setLoading(false);
      toast.error("Network error while recording return");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {/* Booking Selector */}
      {!preselectedBookingId ? (
        <div>
          <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
            Active Issued Booking *
          </label>
          <select
            value={selectedBookingId}
            onChange={(e) => {
              setSelectedBookingId(e.target.value);
              const b = activeBookings.find(
                (item) => item._id === e.target.value
              );
              if (b) {
                const rem =
                  (b.issuedQuantity || 0) - (b.returnedQuantity || 0);
                setReturnedQuantity(rem > 0 ? rem : 1);
              }
            }}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-charcoal bg-offWhite/50 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo cursor-pointer ${
              errors.booking ? "border-red-400 bg-red-50/20" : "border-gray-200"
            }`}
          >
            <option value="">Select an active issued booking...</option>
            {activeBookings.map((b) => {
              const res = b.resource as IResource;
              const rName =
                typeof res === "object" && res ? res.name : "Item";
              const rem =
                (b.issuedQuantity || 0) - (b.returnedQuantity || 0);
              return (
                <option key={b._id} value={b._id}>
                  {b.bookingReference} — {b.requesterName} ({rName}, {rem} outstanding)
                </option>
              );
            })}
          </select>
          {errors.booking && (
            <p className="text-xs text-red-600 mt-1">{errors.booking}</p>
          )}
        </div>
      ) : null}

      {/* Return Summary Card */}
      <div className="bg-softSage/15 border border-softSage/50 rounded-lg p-3 text-xs text-charcoal flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold text-mutedTeal">
            Outstanding Check-Out Units
          </p>
          <p className="font-semibold text-charcoal mt-0.5">
            Awaiting inspection & return: <strong>{maxReturnable} unit(s)</strong>
          </p>
        </div>
        <RotateCcw size={18} className="text-mutedTeal" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
            Returned Quantity *
          </label>
          <input
            type="number"
            min={1}
            max={maxReturnable}
            value={returnedQuantity}
            onChange={(e) => setReturnedQuantity(Number(e.target.value))}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-charcoal bg-offWhite/50 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo ${
              errors.returnedQuantity ? "border-red-400 bg-red-50/20" : "border-gray-200"
            }`}
          />
          {errors.returnedQuantity && (
            <p className="text-xs text-red-600 mt-1">{errors.returnedQuantity}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
            Return Check-In Date *
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-xs text-charcoal bg-offWhite/50 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo ${
              errors.returnDate ? "border-red-400 bg-red-50/20" : "border-gray-200"
            }`}
          />
          {errors.returnDate && (
            <p className="text-xs text-red-600 mt-1">{errors.returnDate}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
          Post-Use Physical Condition *
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full border border-gray-200 bg-offWhite/50 rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo cursor-pointer"
        >
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold text-charcoal mb-1">
          Physical Inspection & Custody Notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Note any cosmetic wear, cable status, missing attachments or required maintenance..."
          className="w-full border border-gray-200 bg-offWhite/50 rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={loading}
          size="sm"
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading} variant="primary" size="sm">
          Confirm Check-In
        </Button>
      </div>
    </form>
  );
}
