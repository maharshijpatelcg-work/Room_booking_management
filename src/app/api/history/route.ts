import { NextRequest, NextResponse } from "next/server";
import UsageHistory from "@backend/models/UsageHistory";
import Booking from "@backend/models/Booking";
import connectDB from "@backend/config/db";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const resource = searchParams.get("resource");

    // Fetch usage history records
    const query: Record<string, unknown> = {};
    if (resource) query.resource = resource;

    const history = await UsageHistory.find(query)
      .populate("resource")
      .populate({
        path: "booking",
        populate: { path: "resource" },
      })
      .populate("returnRecord")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(successResponse(history), { status: 200 });
  } catch (error) {
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : "Server error"),
      { status: 500 }
    );
  }
}
