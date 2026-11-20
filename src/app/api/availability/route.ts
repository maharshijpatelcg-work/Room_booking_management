import { NextRequest, NextResponse } from "next/server";
import { checkAvailability } from "@backend/services/availabilityService";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import connectDB from "@backend/config/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const resourceId = searchParams.get("resourceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const startTime = searchParams.get("startTime") || "00:00";
    const endTime = searchParams.get("endTime") || "23:59";

    if (!resourceId || !startDate || !endDate) {
      return NextResponse.json(
        errorResponse("resourceId, startDate, and endDate are required"),
        { status: 400 }
      );
    }

    const result = await checkAvailability(resourceId, startDate, endDate, startTime, endTime);
    return NextResponse.json(successResponse(result), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : "Server error"),
      { status: 500 }
    );
  }
}
