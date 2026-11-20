import { NextRequest } from "next/server";
import {
  handleGetReturns,
  handleCreateReturn,
} from "@backend/controllers/returnController";

export async function GET(req: NextRequest) {
  try {
    return await handleGetReturns(req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handleCreateReturn(req);
  } catch (error) {
    const { errorResponse } = await import("@backend/utils/apiResponse");
    const { NextResponse } = await import("next/server");
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}
