import Booking from "@backend/models/Booking";
import UsageHistory from "@backend/models/UsageHistory";
import connectDB from "@backend/config/db";
import { generateBookingReference } from "@backend/utils/generateBookingReference";
import { checkAvailability } from "@backend/services/availabilityService";
import { invalidateAnalyticsCache } from "@backend/services/analyticsService";
import type {
  CreateBookingInput,
  UpdateBookingStatusInput,
} from "@backend/validators/bookingValidator";

export async function getAllBookings(filters: {
  status?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  await connectDB();
  const query: Record<string, unknown> = {};

  if (filters.status) query.status = filters.status;
  if (filters.resource) query.resource = filters.resource;
  if (filters.startDate || filters.endDate) {
    const dateQuery: Record<string, unknown> = {};
    if (filters.startDate) dateQuery.$gte = new Date(filters.startDate);
    if (filters.endDate) dateQuery.$lte = new Date(filters.endDate);
    query.startDate = dateQuery;
  }
  if (filters.search) {
    query.$or = [
      { requesterName: { $regex: filters.search, $options: "i" } },
      { requesterEmail: { $regex: filters.search, $options: "i" } },
      { bookingReference: { $regex: filters.search, $options: "i" } },
      { purpose: { $regex: filters.search, $options: "i" } },
    ];
  }

  return Booking.find(query)
    .populate("resource")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getBookingById(id: string) {
  await connectDB();
  return Booking.findById(id).populate("resource").lean();
}

export async function createBooking(data: CreateBookingInput) {
  await connectDB();

  const availability = await checkAvailability(
    data.resource,
    data.startDate,
    data.endDate,
    data.startTime,
    data.endTime
  );

  if (
    !availability.isAvailable ||
    availability.availableQuantity < data.quantity
  ) {
    throw new Error(
      `Insufficient availability. Only ${availability.availableQuantity} unit(s) available for the selected period.`
    );
  }

  const bookingReference = await generateBookingReference();

  const booking = new Booking({
    ...data,
    bookingReference,
    startDate: new Date(data.startDate as string),
    endDate: new Date(data.endDate as string),
    status: "Pending",
    issuedQuantity: 0,
    returnedQuantity: 0,
  });

  const saved = await booking.save();
  invalidateAnalyticsCache();

  await UsageHistory.create({
    resource: data.resource,
    booking: saved._id,
    action: "booking_created",
    details: `Booking ${bookingReference} created for ${data.quantity} unit(s)`,
  });

  return saved;
}

export async function updateBookingStatus(
  id: string,
  data: UpdateBookingStatusInput
) {
  await connectDB();

  const booking = await Booking.findById(id).populate("resource");
  if (!booking) throw new Error("Booking not found");

  if (data.status === "Approved" && booking.status === "Pending") {
    const resObj = booking.resource as unknown as { _id?: { toString(): string } };
    const resourceId = resObj?._id
      ? resObj._id.toString()
      : String(booking.resource);

    const availability = await checkAvailability(
      resourceId,
      booking.startDate,
      booking.endDate,
      booking.startTime,
      booking.endTime,
      id
    );
    if (availability.availableQuantity < booking.quantity) {
      throw new Error(
        `Cannot approve: only ${availability.availableQuantity} unit(s) available`
      );
    }
    if (data.issuedQuantity !== undefined) {
      booking.issuedQuantity = data.issuedQuantity;
    } else {
      booking.issuedQuantity = booking.quantity;
    }
    if (data.expectedReturnDate) {
      booking.expectedReturnDate = new Date(
        data.expectedReturnDate as string
      );
    }
  }

  const prevStatus = booking.status;
  booking.status = data.status;
  if (data.managerNotes !== undefined) booking.managerNotes = data.managerNotes;

  const updated = await booking.save();
  invalidateAnalyticsCache();

  const resObj2 = booking.resource as unknown as { _id?: { toString(): string } };
  const resourceId = resObj2?._id
    ? resObj2._id.toString()
    : String(booking.resource);

  await UsageHistory.create({
    resource: resourceId,
    booking: id,
    action: `status_changed`,
    details: `Status changed from ${prevStatus} to ${data.status}${
      data.managerNotes ? ". Notes: " + data.managerNotes : ""
    }`,
  });

  return Booking.findById(updated._id).populate("resource");
}

