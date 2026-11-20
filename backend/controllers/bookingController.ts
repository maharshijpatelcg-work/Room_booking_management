import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
} from "@backend/services/bookingService";
import {
  CreateBookingSchema,
  UpdateBookingStatusSchema,
} from "@backend/validators/bookingValidator";
import mongoose from "mongoose";

export async function handleGetBookings(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters = {
    status: searchParams.get("status") || undefined,
    resource: searchParams.get("resource") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    search: searchParams.get("search") || undefined,
  };
  const bookings = await getAllBookings(filters);
  return NextResponse.json(successResponse(bookings), { status: 200 });
}

export async function handleCreateBooking(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateBookingSchema.safeParse({
    ...body,
    quantity: Number(body.quantity),
  });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      errors[e.path.join(".")] = e.message;
    });
    return NextResponse.json(errorResponse("Validation failed", errors), {
      status: 400,
    });
  }
  try {
    const booking = await createBooking(parsed.data);
    return NextResponse.json(
      successResponse(
        booking,
        `Booking created. Reference: ${booking.bookingReference}`
      ),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(
        error instanceof Error ? error.message : "Booking creation failed"
      ),
      { status: 400 }
    );
  }
}

export async function handleGetBookingById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(errorResponse("Invalid booking ID"), {
      status: 400,
    });
  }
  const booking = await getBookingById(id);
  if (!booking)
    return NextResponse.json(errorResponse("Booking not found"), {
      status: 404,
    });
  return NextResponse.json(successResponse(booking), { status: 200 });
}

export async function handleUpdateBookingStatus(
  id: string,
  req: NextRequest
) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(errorResponse("Invalid booking ID"), {
      status: 400,
    });
  }
  const body = await req.json();
  const parsed = UpdateBookingStatusSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      errors[e.path.join(".")] = e.message;
    });
    return NextResponse.json(errorResponse("Validation failed", errors), {
      status: 400,
    });
  }
  try {
    const booking = await updateBookingStatus(id, parsed.data);
    return NextResponse.json(
      successResponse(booking, "Booking status updated"),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(
        error instanceof Error ? error.message : "Status update failed"
      ),
      { status: 400 }
    );
  }
}

