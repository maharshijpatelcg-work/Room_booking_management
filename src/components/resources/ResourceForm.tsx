"use client";

import { useState, useEffect } from "react";
import type { IResource, ResourceCategory } from "@/types";
import Button from "@/components/common/Button";

const CATEGORIES: ResourceCategory[] = [
  "Laptops",
  "Cameras",
  "Projectors",
  "Laboratory Equipment",
  "Meeting Rooms",
  "Sports Equipment",
  "Audio Equipment",
  "Other",
];

interface ResourceFormProps {
  initial?: IResource | null;
  onSubmit: (data: Partial<IResource>) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ResourceForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: ResourceFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Laptops",
    location: "",
    totalQuantity: 1,
    available: 1,
    images: "",
    instructions: "",
    maintenanceNotes: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        description: initial.description || "",
        category: initial.category || "Laptops",
        location: initial.location || "",
        totalQuantity: initial.totalQuantity || 1,
        available: initial.available ?? initial.totalQuantity ?? 1,
        images: (initial.images || []).join(", "),
        instructions: initial.instructions || "",
        maintenanceNotes: initial.maintenanceNotes || "",
        isActive: initial.isActive ?? true,
      });
    }
  }, [initial]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (form.totalQuantity < 1) e.totalQuantity = "Must be at least 1";
    if (form.available < 0) e.available = "Cannot be negative";
    if (form.available > form.totalQuantity)
      e.available = "Cannot exceed total quantity";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const images = form.images
      ? form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const ok = await onSubmit({
      ...form,
      category: form.category as ResourceCategory,
      images,
      totalQuantity: Number(form.totalQuantity),
      available: Number(form.available),
    });
    if (ok) {
      setForm({
        name: "",
        description: "",
        category: "Laptops",
        location: "",
        totalQuantity: 1,
        available: 1,
        images: "",
        instructions: "",
        maintenanceNotes: "",
        isActive: true,
      });
    }
  };

  const field = (
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
        placeholder={placeholder}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
          }))
        }
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
      {field("Asset Name *", "name", "text", "e.g. Dell XPS 15 Workstation")}

      <div>
        <label className="block text-xs font-semibold text-charcoal mb-1">
          Description *
        </label>
        <textarea
          rows={3}
          value={form.description}
          placeholder="Detailed specification, hardware features, and notes..."
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          className={`w-full border rounded-lg px-3 py-2 text-sm text-charcoal bg-offWhite/40 focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo resize-none transition-all ${
            errors.description ? "border-red-400 bg-red-50/20" : "border-gray-200"
          }`}
        />
        {errors.description && (
          <p className="text-xs text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-charcoal mb-1">
            Category *
          </label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="w-full border border-gray-200 bg-offWhite/40 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {field("Physical Location *", "location", "text", "e.g. Science Complex Rm 204")}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field("Total Inventory Count *", "totalQuantity", "number")}
        {field("Available for Booking *", "available", "number")}
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal mb-1">
          Image URLs (comma-separated CDN links)
        </label>
        <input
          type="text"
          value={form.images}
          onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full border border-gray-200 bg-offWhite/40 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal mb-1">
          Standard Operating & Safety Instructions
        </label>
        <textarea
          rows={2}
          value={form.instructions}
          placeholder="Handling instructions, safety requirements..."
          onChange={(e) =>
            setForm((f) => ({ ...f, instructions: e.target.value }))
          }
          className="w-full border border-gray-200 bg-offWhite/40 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-charcoal mb-1">
          Internal Maintenance Notes
        </label>
        <textarea
          rows={2}
          value={form.maintenanceNotes}
          placeholder="Last service date, calibration status..."
          onChange={(e) =>
            setForm((f) => ({ ...f, maintenanceNotes: e.target.value }))
          }
          className="w-full border border-gray-200 bg-offWhite/40 rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-mutedIndigo/30 focus:border-mutedIndigo resize-none"
        />
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) =>
            setForm((f) => ({ ...f, isActive: e.target.checked }))
          }
          className="w-4 h-4 rounded border-gray-300 text-mutedIndigo focus:ring-mutedIndigo"
        />
        <label htmlFor="isActive" className="text-xs font-medium text-charcoal cursor-pointer">
          Active Status (Resource visible and reservable in system)
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} variant="primary">
          {initial ? "Save Changes" : "Create Asset"}
        </Button>
      </div>
    </form>
  );
}
