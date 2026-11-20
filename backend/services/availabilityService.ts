import Booking from "@backend/models/Booking";
import Resource from "@backend/models/Resource";
import { combineDateAndTime, doIntervalsOverlap } from "@backend/utils/dateHelpers";
import type { AvailabilityResult } from "@backend/types/index";
import connectDB from "@backend/config/db";

export async function checkAvailability(
  resourceId: string,
  startDate: Date | string,
  endDate: Date | string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): Promise<AvailabilityResult> {
  await connectDB();
  const resource = await Resource.findById(resourceId)
    .select("totalQuantity name category")
    .lean();
  if (!resource) {
    throw new Error("Resource not found");
  }

  const requestedStart = combineDateAndTime(startDate, startTime);
  const requestedEnd = combineDateAndTime(endDate, endTime);

  const query: Record<string, unknown> = {
    resource: resourceId,
    status: { $in: ["Pending", "Approved"] },
  };
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBookings = await Booking.find(query)
    .select("startDate endDate startTime endTime quantity _id")
    .lean();

  let reservedQuantity = 0;
  const conflictingBookingIds: string[] = [];

  for (const booking of overlappingBookings) {
    const bookingStart = combineDateAndTime(
      booking.startDate,
      booking.startTime
    );
    const bookingEnd = combineDateAndTime(booking.endDate, booking.endTime);

    if (
      doIntervalsOverlap(
        requestedStart,
        requestedEnd,
        bookingStart,
        bookingEnd
      )
    ) {
      reservedQuantity += booking.quantity;
      conflictingBookingIds.push(booking._id.toString());
    }
  }

  const availableQuantity = resource.totalQuantity - reservedQuantity;

  return {
    resourceId,
    totalQuantity: resource.totalQuantity,
    reservedQuantity,
    availableQuantity: Math.max(0, availableQuantity),
    isAvailable: availableQuantity > 0,
    conflictingBookings: conflictingBookingIds,
  };
}

