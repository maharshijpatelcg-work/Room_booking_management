import Booking from "@backend/models/Booking";

export async function generateBookingReference(): Promise<string> {
  const prefix = "EQ";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const reference = `${prefix}-${timestamp}-${random}`;

  // Ensure uniqueness
  const existing = await Booking.findOne({ bookingReference: reference });
  if (existing) {
    return generateBookingReference();
  }
  return reference;
}
