import Return from "@backend/models/Return";
import Booking from "@backend/models/Booking";
import UsageHistory from "@backend/models/UsageHistory";
import connectDB from "@backend/config/db";
import { invalidateAnalyticsCache } from "@backend/services/analyticsService";

export async function getAllReturns(filters: {
  resource?: string;
  booking?: string;
}) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters.resource) query.resource = filters.resource;
  if (filters.booking) query.booking = filters.booking;
  return Return.find(query)
    .populate({ path: "booking", populate: { path: "resource" } })
    .populate("resource")
    .sort({ createdAt: -1 })
    .lean();
}

export async function createReturn(data: {
  booking: string;
  returnedQuantity: number;
  returnDate: string;
  condition: string;
  notes?: string;
}) {
  await connectDB();

  const booking = await Booking.findById(data.booking).populate("resource");
  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "Approved")
    throw new Error("Only approved bookings can be returned");

  const remaining = booking.issuedQuantity - booking.returnedQuantity;
  if (data.returnedQuantity > remaining) {
    throw new Error(
      `Cannot return more than issued. Remaining: ${remaining} unit(s)`
    );
  }

  const resObj = booking.resource as unknown as { _id?: { toString(): string } };
  const resourceId = resObj?._id
    ? resObj._id.toString()
    : String(booking.resource);

  const returnRecord = await Return.create({
    booking: data.booking,
    resource: resourceId,
    returnedQuantity: data.returnedQuantity,
    returnDate: new Date(data.returnDate),
    condition: data.condition,
    notes: data.notes,
  });

  booking.returnedQuantity += data.returnedQuantity;
  booking.actualReturnDate = new Date(data.returnDate);

  if (booking.returnedQuantity >= booking.issuedQuantity) {
    booking.status = "Completed";
  }

  await booking.save();

  await UsageHistory.create({
    resource: resourceId,
    booking: data.booking,
    returnRecord: returnRecord._id,
    action: "return_recorded",
    details: `${data.returnedQuantity} unit(s) returned in ${data.condition} condition`,
  });

  invalidateAnalyticsCache();

  return Return.findById(returnRecord._id)
    .populate({ path: "booking", populate: { path: "resource" } })
    .populate("resource")
    .lean();
}
