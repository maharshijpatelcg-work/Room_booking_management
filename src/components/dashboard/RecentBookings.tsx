import Link from "next/link";
import type { IBooking, IResource } from "@/types";
import BookingStatusBadge from "@/components/bookings/BookingStatusBadge";
import { formatDate } from "@/utils/dateUtils";
import { ArrowRight } from "lucide-react";

interface RecentBookingsProps {
  bookings: IBooking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-sm font-bold text-[#1B1A2E] mb-4">
          Recent Booking Activity
        </h3>
        <p className="text-xs text-[#55536B] py-10 text-center italic">
          No recent booking operations logged
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E4E2DA] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E2DA]/50">
        <div>
          <h3 className="text-sm font-bold text-[#1B1A2E]">
            Recent Booking Activity
          </h3>
          <p className="text-xs text-[#55536B] mt-0.5">
            Latest requests and reservations across campus
          </p>
        </div>
        <Link
          href="/bookings"
          className="text-xs text-[#0F766E] hover:text-[#0B5F58] font-semibold flex items-center gap-1 hover:underline"
        >
          <span>All Bookings</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#E4E2DA]/60 text-[#55536B] uppercase text-[10px] tracking-wider bg-[#F4F3EF]/60">
              <th className="text-left px-3 py-2 font-semibold">Reference</th>
              <th className="text-left px-3 py-2 font-semibold">Resource</th>
              <th className="text-left px-3 py-2 font-semibold">Requester</th>
              <th className="text-left px-3 py-2 font-semibold">Period</th>
              <th className="text-center px-3 py-2 font-semibold">Qty</th>
              <th className="text-right px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E2DA]/40">
            {bookings.slice(0, 6).map((b) => {
              const resource = b.resource as IResource;
              const resourceName =
                typeof resource === "object" && resource
                  ? resource.name
                  : "Resource";

              return (
                <tr key={b._id} className="hover:bg-[#F4F3EF]/50 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-[#0F766E] font-bold">
                    {b.bookingReference}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-[#1B1A2E] max-w-[160px] truncate">
                    {resourceName}
                  </td>
                  <td className="px-3 py-2.5 text-[#55536B]">
                    <p className="font-medium text-[#1B1A2E] truncate max-w-[120px]">
                      {b.requesterName}
                    </p>
                    <p className="text-[10px] text-[#55536B] truncate max-w-[120px]">
                      {b.requesterEmail}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 text-[#55536B] whitespace-nowrap">
                    {formatDate(b.startDate)}
                  </td>
                  <td className="px-3 py-2.5 text-center font-bold text-[#1B1A2E]">
                    {b.quantity}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <BookingStatusBadge status={b.status} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
