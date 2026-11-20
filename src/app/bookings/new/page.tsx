"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BookingForm from "@/components/bookings/BookingForm";
import Loader from "@/components/common/Loader";
import { bookingsAPI } from "@/lib/api";
import { ArrowLeft, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function NewBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resourceId = searchParams.get("resource") || undefined;

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const res = await bookingsAPI.create(data);
      if (res.success) {
        toast.success(res.message || "Booking request submitted successfully!");
        router.push("/bookings");
        return true;
      } else {
        toast.error(res.error || "Failed to create booking");
        return false;
      }
    } catch {
      toast.error("Network error while creating booking");
      return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/bookings"
          className="p-2 text-mutedTeal hover:text-charcoal hover:bg-white rounded-lg border border-gray-200 transition-colors shadow-xs"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
            <BookOpenCheck size={20} className="text-mutedIndigo" />
            Submit Equipment Reservation Request
          </h2>
          <p className="text-xs text-mutedTeal mt-0.5">
            Submit a reservation request for institutional equipment, laboratory apparatus, or facilities.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/90 p-6 shadow-xs">
        <BookingForm
          preselectedResourceId={resourceId}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/bookings")}
        />
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <DashboardLayout title="New Booking Request">
      <Suspense fallback={<Loader fullPage text="Loading booking application..." />}>
        <NewBookingContent />
      </Suspense>
    </DashboardLayout>
  );
}
