import { NextResponse } from "next/server";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { getAnalytics } from "@backend/services/analyticsService";

export async function handleGetAnalytics() {
  const analytics = await getAnalytics();
  return NextResponse.json(successResponse(analytics), { status: 200 });
}

