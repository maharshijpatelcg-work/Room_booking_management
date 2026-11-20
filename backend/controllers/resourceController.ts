import { NextRequest, NextResponse } from "next/server";
import { successResponse, errorResponse } from "@backend/utils/apiResponse";
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "@backend/services/resourceService";
import {
  CreateResourceSchema,
  UpdateResourceSchema,
} from "@backend/validators/resourceValidator";
import mongoose from "mongoose";

export async function handleGetResources(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filters = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    location: searchParams.get("location") || undefined,
    available: searchParams.has("available")
      ? searchParams.get("available") === "true"
      : undefined,
  };
  const resources = await getAllResources(filters);
  return NextResponse.json(successResponse(resources), { status: 200 });
}

export async function handleCreateResource(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateResourceSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      errors[e.path.join(".")] = e.message;
    });
    return NextResponse.json(errorResponse("Validation failed", errors), {
      status: 400,
    });
  }
  const resource = await createResource(parsed.data);
  return NextResponse.json(
    successResponse(resource, "Resource created successfully"),
    { status: 201 }
  );
}

export async function handleGetResourceById(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(errorResponse("Invalid resource ID"), {
      status: 400,
    });
  }
  const resource = await getResourceById(id);
  if (!resource)
    return NextResponse.json(errorResponse("Resource not found"), {
      status: 404,
    });
  return NextResponse.json(successResponse(resource), { status: 200 });
}

export async function handleUpdateResource(id: string, req: NextRequest) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(errorResponse("Invalid resource ID"), {
      status: 400,
    });
  }
  const body = await req.json();
  const parsed = UpdateResourceSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.errors.forEach((e) => {
      errors[e.path.join(".")] = e.message;
    });
    return NextResponse.json(errorResponse("Validation failed", errors), {
      status: 400,
    });
  }
  const resource = await updateResource(id, parsed.data);
  if (!resource)
    return NextResponse.json(errorResponse("Resource not found"), {
      status: 404,
    });
  return NextResponse.json(
    successResponse(resource, "Resource updated successfully"),
    { status: 200 }
  );
}

export async function handleDeleteResource(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(errorResponse("Invalid resource ID"), {
      status: 400,
    });
  }
  await deleteResource(id);
  return NextResponse.json(
    successResponse(null, "Resource deleted successfully"),
    { status: 200 }
  );
}

