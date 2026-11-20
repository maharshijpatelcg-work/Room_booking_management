"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import Modal from "@/components/common/Modal";
import ResourceForm from "@/components/resources/ResourceForm";
import { resourcesAPI, bookingsAPI } from "@/lib/api";
import type { IResource, IBooking } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { getCategoryBadge } from "@/utils/formatters";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import {
  MapPin,
  Package,
  ArrowLeft,
  Edit,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Wrench,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [resource, setResource] = useState<IResource | null>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [rRes, bRes] = await Promise.all([
        resourcesAPI.getById(id),
        bookingsAPI.getAll({ resource: id }),
      ]);
      if (rRes.success) setResource(rRes.data as IResource);
      if (bRes.success) setBookings((bRes.data as IBooking[]) || []);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleUpdate = async (data: Partial<IResource>) => {
    setSaving(true);
    const res = await resourcesAPI.update(id, data);
    setSaving(false);
    if (res.success) {
      setResource(res.data as IResource);
      toast.success("Resource specifications updated successfully");
      setEditing(false);
      return true;
    }
    toast.error(res.error || "Update failed");
    return false;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#E8E6DF] rounded-xl" />
          <div className="space-y-1.5">
            <div className="h-6 w-60 bg-[#E8E6DF] rounded" />
            <div className="h-3 w-36 bg-[#E8E6DF] rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl border border-[#E4E2DA] h-72 p-6" />
          <div className="bg-white rounded-2xl border border-[#E4E2DA] h-72 p-6" />
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <DashboardLayout title="Not Found">
        <div className="bg-white rounded-2xl border border-[#E4E2DA] p-8 text-center max-w-md mx-auto my-12">
          <p className="text-[#1B1A2E] font-medium">Specified resource not found in inventory.</p>
          <Link href="/resources">
            <Button variant="outline" size="sm" className="mt-4">
              Return to Inventory
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const availPct =
    resource.totalQuantity > 0
      ? Math.round((resource.available / resource.totalQuantity) * 100)
      : 0;

  const categoryStyle = getCategoryBadge(resource.category);

  return (
    <DashboardLayout title={resource.name}>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-[#55536B] hover:text-[#1B1A2E] transition-colors bg-white px-3.5 py-2 rounded-full border border-[#E4E2DA] shadow-xs"
          >
            <ArrowLeft size={14} />
            Back to Inventory
          </button>
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit size={13} className="text-[#55536B]" />}
              onClick={() => setEditing(true)}
            >
              Edit Asset
            </Button>
            <Link href={`/bookings/new?resource=${id}`}>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<BookOpen size={14} />}
                disabled={resource.available <= 0}
              >
                {resource.available > 0 ? "Book This Resource" : "Currently Unavailable"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Grid: Details + History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Asset Card & Specs */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="relative h-56 bg-[#F4F3EF] overflow-hidden">
                {resource.images?.[0] ? (
                  <img
                    src={resource.images[0]}
                    alt={resource.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#55536B]">
                    <Package size={48} />
                    <span className="text-xs mt-2">No photo cataloged</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} shadow-xs`}
                  >
                    {resource.category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-[#1B1A2E] leading-snug">
                    {resource.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#55536B] mt-1.5">
                    <MapPin size={13} className="text-[#0F766E]" />
                    <span>{resource.location}</span>
                  </div>
                </div>

                <p className="text-xs text-[#55536B] leading-relaxed">
                  {resource.description}
                </p>

                <div className="pt-3 border-t border-[#E4E2DA]/60 grid grid-cols-2 gap-3 text-center">
                  <div className="bg-[#F4F3EF]/60 rounded-xl p-3 border border-[#E4E2DA]">
                    <span className="text-[10px] uppercase font-semibold text-[#55536B] block">
                      Total Assets
                    </span>
                    <span className="text-xl font-bold text-[#1B1A2E]">
                      {resource.totalQuantity}
                    </span>
                  </div>
                  <div className="bg-[#F4F3EF]/60 rounded-xl p-3 border border-[#E4E2DA]">
                    <span className="text-[10px] uppercase font-semibold text-[#55536B] block">
                      In Stock
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        resource.available > 0 ? "text-[#0F766E]" : "text-red-600"
                      }`}
                    >
                      {resource.available}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Gauge Card */}
            <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B1A2E] flex items-center gap-1.5">
                <Layers size={14} className="text-[#0F766E]" />
                Live Stock Status
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#55536B] font-medium">Availability Ratio</span>
                  <span className="font-bold text-[#1B1A2E]">{availPct}% available</span>
                </div>
                <div className="h-2 w-full bg-[#F4F3EF] rounded-full overflow-hidden border border-[#E4E2DA]/60">
                  <div
                    className={`h-full transition-all duration-300 ${
                      availPct > 50
                        ? "bg-[#0F766E]"
                        : availPct > 20
                        ? "bg-orange-500"
                        : "bg-red-400"
                    }`}
                    style={{ width: `${availPct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                {resource.available > 0 ? (
                  <>
                    <CheckCircle2 size={15} className="text-[#0F766E] shrink-0" />
                    <span className="text-[#1B1A2E] font-medium">
                      Available for immediate check-out & booking
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={15} className="text-red-500 shrink-0" />
                    <span className="text-red-600 font-medium">
                      All units currently reserved or checked out
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Operating Instructions */}
            {resource.instructions && (
              <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B1A2E] mb-2 flex items-center gap-1.5">
                  <FileText size={14} className="text-[#0F766E]" />
                  Usage Guidelines
                </h3>
                <p className="text-xs text-[#55536B] leading-relaxed whitespace-pre-line">
                  {resource.instructions}
                </p>
              </div>
            )}

            {/* Maintenance Notes */}
            {resource.maintenanceNotes && (
              <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B1A2E] mb-2 flex items-center gap-1.5">
                  <Wrench size={14} className="text-[#55536B]" />
                  Maintenance & Service Records
                </h3>
                <p className="text-xs text-[#55536B] leading-relaxed whitespace-pre-line">
                  {resource.maintenanceNotes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Historical & Upcoming Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E4E2DA]/60 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1B1A2E] flex items-center gap-2">
                    <Calendar size={15} className="text-[#0F766E]" />
                    Booking Ledger ({bookings.length})
                  </h3>
                  <p className="text-[11px] text-[#55536B] mt-0.5">
                    Chronological reservation and checkout records for this asset
                  </p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Clock size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-medium text-[#55536B]">
                    No active or historical bookings found for this asset.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#F4F3EF]/70 text-[#55536B] border-b border-[#E4E2DA] font-semibold uppercase text-[10px] tracking-wider">
                        <th className="px-4 py-3 text-left">Ref #</th>
                        <th className="px-4 py-3 text-left">Requester</th>
                        <th className="px-4 py-3 text-left">Reservation Window</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E2DA]/40">
                      {bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-[#F4F3EF]/40 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-[#0F766E]">
                            {b.bookingReference}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-[#1B1A2E] block">
                              {b.requesterName}
                            </span>
                            <span className="text-[11px] text-[#55536B]">
                              {b.department || b.requesterEmail}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#55536B]">
                            <div>{formatDate(b.startDate)}</div>
                            <div className="text-[10px] text-[#55536B]/80">to {formatDate(b.endDate)}</div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-[#1B1A2E]">
                            {b.quantity}
                          </td>
                          <td className="px-4 py-3">
                            <BookingStatusBadge status={b.status} size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Resource Modal */}
      <Modal
        isOpen={editing}
        onClose={() => setEditing(false)}
        title="Edit Resource Asset"
        size="lg"
      >
        <ResourceForm
          initial={resource}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={saving}
        />
      </Modal>
    </DashboardLayout>
  );
}
