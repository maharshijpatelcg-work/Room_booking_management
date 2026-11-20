import { NextRequest } from "next/server";
import {
  handleGetBookings,
  handleCreateBooking,
} from "@backend/controllers/bookingController";

export async function GET(req: NextRequest) {
  try {
    return await handleGetBookings(req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handleCreateBooking(req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}
