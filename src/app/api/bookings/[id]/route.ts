import { NextRequest } from "next/server";
import {
  handleGetBookingById,
  handleUpdateBookingStatus,
} from "@backend/controllers/bookingController";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await handleGetBookingById(id);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return await handleUpdateBookingStatus(id, req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}
