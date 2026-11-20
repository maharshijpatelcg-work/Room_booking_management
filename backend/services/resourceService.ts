import Resource from "@backend/models/Resource";
import Booking from "@backend/models/Booking";
import connectDB from "@backend/config/db";
import { invalidateAnalyticsCache } from "@backend/services/analyticsService";
import type {
  CreateResourceInput,
  UpdateResourceInput,
} from "@backend/validators/resourceValidator";

export async function getAllResources(filters: {
  search?: string;
  category?: string;
  location?: string;
  available?: boolean;
}) {
  await connectDB();
  const query: Record<string, unknown> = { isActive: true };

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
      { location: { $regex: filters.search, $options: "i" } },
    ];
  }
  if (filters.category) query.category = filters.category;
  if (filters.location)
    query.location = { $regex: filters.location, $options: "i" };
  if (filters.available !== undefined) {
    query.available = filters.available ? { $gt: 0 } : 0;
  }

  return Resource.find(query).sort({ createdAt: -1 }).lean();
}

export async function getResourceById(id: string) {
  await connectDB();
  return Resource.findById(id).lean();
}

export async function createResource(data: CreateResourceInput) {
  await connectDB();
  const resource = new Resource({
    ...data,
    available: data.available ?? data.totalQuantity,
  });
  const saved = await resource.save();
  invalidateAnalyticsCache();
  return saved;
}

export async function updateResource(id: string, data: UpdateResourceInput) {
  await connectDB();
  const updated = await Resource.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  invalidateAnalyticsCache();
  return updated;
}

export async function deleteResource(id: string) {
  await connectDB();
  const activeBookings = await Booking.countDocuments({
    resource: id,
    status: { $in: ["Pending", "Approved"] },
  });
  if (activeBookings > 0) {
    throw new Error("Cannot delete resource with active bookings");
  }
  const deleted = await Resource.findByIdAndUpdate(id, { isActive: false }, { new: true });
  invalidateAnalyticsCache();
  return deleted;
}

