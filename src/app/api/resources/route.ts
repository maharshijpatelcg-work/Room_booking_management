import { NextRequest } from "next/server";
import {
  handleGetResources,
  handleCreateResource,
} from "@backend/controllers/resourceController";

export async function GET(req: NextRequest) {
  try {
    return await handleGetResources(req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    console.error("GET /api/resources error:", error);
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : "Internal server error"),
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handleCreateResource(req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    console.error("POST /api/resources error:", error);
    return NextResponse.json(
      errorResponse(error instanceof Error ? error.message : "Internal server error"),
      { status: 500 }
    );
  }
}
