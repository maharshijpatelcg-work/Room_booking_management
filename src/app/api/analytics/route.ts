import { NextRequest } from "next/server";
import { handleGetAnalytics } from "@backend/controllers/analyticsController";

export async function GET(_req: NextRequest) {
  try {
    return await handleGetAnalytics();
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}
