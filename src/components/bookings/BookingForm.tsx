"use client";

import { useState, useEffect } from "react";
import type { IResource } from "@/types";
import Button from "@/components/common/Button";
import { resourcesAPI, availabilityAPI } from "@/lib/api";
import type { AvailabilityResult } from "@/types";
import { AlertTriangle, CheckCircle2, Calendar, User, Mail, FileText, Clock, Layers } from "lucide-react";

interface BookingFormProps {
  preselectedResourceId?: string;
  onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
  onCancel: () => void;
  loading?: boolean;
}

const today = new Date().toISOString().split("T")[0];

export default function BookingForm({
  preselectedResourceId,
  onSubmit,
  onCancel,
  loading,
}: BookingFormProps) {
  const [resources, setResources] = useState<IResource[]>([]);
  const [form, setForm] = useState({
    resource: preselectedResourceId || "",
    requesterName: "",
    requesterEmail: "",
    department: "",
    purpose: "",
    startDate: today,
    endDate: today,
    startTime: "09:00",
    endTime: "17:00",
    quantity: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null
  );
  const [checkingAvail, setCheckingAvail] = useState(false);

  useEffect(() => {
    resourcesAPI.getAll().then((res) => {
      if (res.success) setResources((res.data as IResource[]) || []);
    });
  }, []);

  useEffect(() => {
    if (form.resource && form.startDate && form.endDate) {
      checkAvail();
    }
  }, [
    form.resource,
    form.startDate,
    form.endDate,
    form.startTime,
    form.endTime,
  ]); // eslint-disable-line

  const checkAvail = async () => {
    if (!form.resource || !form.startDate || !form.endDate) return;
    setCheckingAvail(true);
    const res = await availabilityAPI.check({
      resourceId: form.resource,
      startDate: form.startDate,
      endDate: form.endDate,
      startTime: form.startTime,
      endTime: form.endTime,
    });
    if (res.success) setAvailability(res.data as AvailabilityResult);
    setCheckingAvail(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.resource) e.resource = "Resource selection is required";
    if (!form.requesterName.trim()) e.requesterName = "Full name is required";
    if (!form.requesterEmail.trim()) e.requesterEmail = "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.requesterEmail))
      e.requesterEmail = "Valid institutional email required";
    if (!form.purpose.trim()) e.purpose = "Reservation purpose is required";
    if (!form.startDate) e.startDate = "Start date required";
    if (!form.endDate) e.endDate = "End date required";
    if (form.endDate < form.startDate) e.endDate = "End date must be on or after start date";
    if (form.quantity < 1) e.quantity = "Quantity must be at least 1";
    if (
      availability &&
      form.quantity > availability.availableQuantity
    ) {
      e.quantity = `Only ${availability.availableQuantity} unit(s) available for selected slot`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ ...form, quantity: Number(form.quantity) });
  };

  const inp = (
    label: string,
    key: keyof typeof form,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-xs font-semibold text-charcoal mb-1">
        {label}
      </label>
      <input
        type={type}
        value={form[key] as string | number}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [key]:
              type === "number" ? Number(e.target.value) : e.target.value,
          }))
        }
        placeholder={placeholder}
        min={type === "number" ? 1 : undefined}
        className={`w-full border rounded-lg px-3 py-2 text-sm text-charcoal bg-offWhite/40 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo transition-all ${
          errors[key] ? "border-red-400 bg-red-50/20" : "border-gray-200"
        }`}
      />
      {errors[key] && (
        <p className="text-xs text-red-600 mt-1">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resource selector */}
      <div>
        <label className="block text-xs font-semibold text-charcoal mb-1">
          Select Resource Asset *
        </label>
        <select
          value={form.resource}
          onChange={(e) =>
            setForm((f) => ({ ...f, resource: e.target.value }))
          }
          className={`w-full border rounded-lg px-3 py-2 text-sm text-charcoal bg-offWhite/40 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo cursor-pointer transition-all ${
            errors.resource ? "border-red-400 bg-red-50/20" : "border-gray-200"
          }`}
        >
          <option value="">Choose an equipment or facility asset...</option>
          {resources.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name} ({r.category}) — {r.available}/{r.totalQuantity} in stock
            </option>
          ))}
        </select>
        {errors.resource && (
          <p className="text-xs text-red-600 mt-1">{errors.resource}</p>
        )}
      </div>

      {/* Dynamic Availability Indicator */}
      {form.resource && (
        <div
          className={`rounded-lg p-3 text-xs flex items-center justify-between border ${
            checkingAvail
              ? "bg-offWhite text-gray-500 border-gray-200"
              : availability?.isAvailable
              ? "bg-softSage/20 text-charcoal border-softSage/60"
              : "bg-warmSand/30 text-charcoal border-warmSand"
          }`}
        >
          <div className="flex items-center gap-2">
            {checkingAvail ? (
              <span className="animate-pulse">Checking time slot availability...</span>
            ) : availability ? (
              <>
                {availability.isAvailable ? (
                  <CheckCircle2 size={16} className="text-mutedTeal shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-warmSand-800 shrink-0" />
                )}
                <span>
                  {availability.isAvailable
                    ? `${availability.availableQuantity} of ${availability.totalQuantity} units available for chosen interval`
                    : `Slot conflict: ${availability.conflictCount} active overlapping reservation(s)`}
                </span>
              </>
            ) : null}
          </div>
          {availability && (
            <span className="font-mono font-bold text-[11px] bg-white/80 px-2 py-0.5 rounded border border-gray-200">
              {availability.availableQuantity} Free
            </span>
          )}
        </div>
      )}

      {/* Requester Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inp("Requester Full Name *", "requesterName", "text", "Dr. Jane Doe")}
        {inp("Institutional Email *", "requesterEmail", "email", "jane.doe@university.edu")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inp("Department / Division", "department", "text", "Computer Science & Engineering")}
        {inp("Quantity Required *", "quantity", "number")}
      </div>

      {/* Reservation Purpose */}
      <div>
        <label className="block text-xs font-semibold text-charcoal mb-1">
          Purpose & Project Details *
        </label>
        <textarea
          rows={2}
          value={form.purpose}
          onChange={(e) =>
            setForm((f) => ({ ...f, purpose: e.target.value }))
          }
          placeholder="State the academic course, research project, or event purpose..."
          className={`w-full border rounded-lg px-3 py-2 text-sm text-charcoal bg-offWhite/40 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo resize-none transition-all ${
            errors.purpose ? "border-red-400 bg-red-50/20" : "border-gray-200"
          }`}
        />
        {errors.purpose && (
          <p className="text-xs text-red-600 mt-1">{errors.purpose}</p>
        )}
      </div>

      {/* Date & Time Selectors */}
      <div className="grid grid-cols-2 gap-3">
        {inp("Start Date *", "startDate", "date")}
        {inp("End Date *", "endDate", "date")}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {inp("Start Time *", "startTime", "time")}
        {inp("End Time *", "endTime", "time")}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          variant="primary"
          disabled={availability ? !availability.isAvailable : false}
        >
          Submit Booking Request
        </Button>
      </div>
    </form>
  );
}
