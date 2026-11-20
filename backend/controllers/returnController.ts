import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import { getAllReturns, createReturn } from "@backend/services/returnService";
import { z } from "zod";

const CreateReturnSchema = z.object({
  booking: z.string().min(1, "Booking ID is required"),
  returnedQuantity: z.number().int().positive("Quantity must be positive"),
  returnDate: z.string().min(1, "Return date is required"),
  condition: z.enum(["Excellent", "Good", "Damaged", "Needs Maintenance"]),
  notes: z.string().optional(),
});

export async function handleGetReturns(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters = {
    resource: searchParams.get("resource") || undefined,
    booking: searchParams.get("booking") || undefined,
  };
  const returns = await getAllReturns(filters);
  return NextResponse.json(successResponse(returns), { status: 200 });
}

export async function handleCreateReturn(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateReturnSchema.safeParse({
    ...body,
    returnedQuantity: Number(body.returnedQuantity),
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
    const returnRecord = await createReturn(parsed.data);
    return NextResponse.json(
      successResponse(returnRecord, "Return recorded successfully"),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      errorResponse(
        error instanceof Error ? error.message : "Return recording failed"
      ),
      { status: 400 }
    );
  }
}

