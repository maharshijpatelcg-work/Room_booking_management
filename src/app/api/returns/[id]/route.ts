import { NextRequest, NextResponse } from "next/server";
import Return from "@backend/models/Return";
import connectDB from "@backend/config/db";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import mongoose from "mongoose";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(errorResponse("Invalid ID"), { status: 400 });
    const record = await Return.findById(id).populate("booking").populate("resource");
    if (!record) return NextResponse.json(errorResponse("Not found"), { status: 404 });
    return NextResponse.json(successResponse(record), { status: 200 });
  } catch (error) {
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(errorResponse("Invalid ID"), { status: 400 });
    const body = await req.json();
    const record = await Return.findByIdAndUpdate(id, body, { new: true });
    if (!record) return NextResponse.json(errorResponse("Not found"), { status: 404 });
    return NextResponse.json(successResponse(record, "Return updated"), { status: 200 });
  } catch (error) {
    return NextResponse.json(errorResponse(error instanceof Error ? error.message : "Server error"), { status: 500 });
  }
}
