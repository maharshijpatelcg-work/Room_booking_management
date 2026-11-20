import Resource from "@backend/models/Resource";
import Booking from "@backend/models/Booking";
import connectDB from "@backend/config/db";
import type { AnalyticsData, IResource } from "@backend/types";

// In-memory server-side cache for high-frequency dashboard navigation
let cachedAnalytics: { data: AnalyticsData; timestamp: number } | null = null;
const CACHE_TTL_MS = 15000; // 15 seconds cache

export function invalidateAnalyticsCache() {
  cachedAnalytics = null;
}

export async function getAnalytics(forceFresh = false): Promise<AnalyticsData> {
  const now = Date.now();
  if (!forceFresh && cachedAnalytics && now - cachedAnalytics.timestamp < CACHE_TTL_MS) {
    return cachedAnalytics.data;
  }

  await connectDB();

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalResources,
    availableResources,
    bookingsByStatusAgg,
    frequentlyBookedAgg,
    recentBookings,
    overdueBookings,
    issuedBookings,
    recentlyAddedResources,
    upcomingBookings,
    pendingList,
    monthlyAgg,
    categoryAgg,
  ] = await Promise.all([
    // 1. Total active resources
    Resource.countDocuments({ isActive: true }),

    // 2. Available resources count
    Resource.countDocuments({ isActive: true, available: { $gt: 0 } }),

    // 3. Status grouping (derives totalBookings & pendingRequests in one pass)
    Booking.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // 4. Frequently booked resources (top 6)
    Booking.aggregate([
      { $match: { status: { $in: ["Pending", "Approved", "Completed"] } } },
      { $group: { _id: "$resource", bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "resources",
          localField: "_id",
          foreignField: "_id",
          as: "resource",
        },
      },
      { $unwind: "$resource" },
    ]),

    // 5. Recent bookings (lean + projected fields)
    Booking.find()
      .select("bookingReference requesterName requesterEmail purpose startDate endDate status quantity createdAt resource")
      .populate({ path: "resource", select: "name category location images" })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),

    // 6. Overdue bookings count
    Booking.countDocuments({
      status: "Approved",
      expectedReturnDate: { $lt: new Date(), $exists: true },
    }),

    // 7. Currently issued count
    Booking.countDocuments({
      status: "Approved",
      $expr: { $gt: ["$issuedQuantity", "$returnedQuantity"] },
    }),

    // 8. Recently added resources (lean + projected)
    Resource.find({ isActive: true })
      .select("name category location totalQuantity available images createdAt")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),

    // 9. Upcoming bookings (lean + projected)
    Booking.find({
      status: "Approved",
      startDate: { $gte: todayStart },
    })
      .select("bookingReference requesterName startDate endDate startTime endTime status quantity resource")
      .populate({ path: "resource", select: "name category location" })
      .sort({ startDate: 1 })
      .limit(5)
      .lean(),

    // 10. Pending approval queue (lean + projected)
    Booking.find({ status: "Pending" })
      .select("bookingReference requesterName purpose quantity startDate endDate resource createdAt")
      .populate({ path: "resource", select: "name category location images" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // 11. Monthly booking trends
    Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // 12. Resources by category
    Resource.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  // Derive totalBookings & bookingsByStatus map from single aggregation
  const bookingsByStatus: Record<string, number> = {};
  let totalBookings = 0;
  bookingsByStatusAgg.forEach((s: { _id: string; count: number }) => {
    bookingsByStatus[s._id] = s.count;
    totalBookings += s.count;
  });

  const pendingRequests = bookingsByStatus["Pending"] || 0;
  const bookedResources = Math.max(0, totalResources - availableResources);

  const monthlyList = monthlyAgg.map((m: { _id: string; count: number }) => ({
    month: m._id,
    count: m.count,
  }));

  const categoryDistribution = categoryAgg.map(
    (c: { _id: string; count: number }) => ({
      category: c._id,
      count: c.count,
    })
  );

  const mostBooked = frequentlyBookedAgg.map(
    (f: { resource: unknown; bookingCount: number }) => {
      const res = f.resource as { _id?: unknown; name?: string; category?: string };
      return {
        resourceId: res?._id ? String(res._id) : undefined,
        name: res?.name || "Equipment",
        category: res?.category || "General",
        bookingCount: f.bookingCount,
      };
    }
  );

  const result: AnalyticsData = {
    totalResources,
    availableResources,
    bookedResources,
    pendingRequests,
    currentlyIssued: issuedBookings,
    overdueReturns: overdueBookings,
    totalBookings,
    bookingsByStatus,
    statusCounts: bookingsByStatus,
    categoryStats: categoryAgg.map(
      (c: { _id: string; count: number }) => ({
        category: c._id,
        count: c.count,
        bookings: bookingsByStatus[c._id] || 0,
      })
    ),
    categoryDistribution,
    frequentlyBooked: frequentlyBookedAgg.map(
      (f: { resource: unknown; bookingCount: number }) => ({
        resource: f.resource,
        bookingCount: f.bookingCount,
      })
    ),
    mostBookedResources: mostBooked,
    recentBookings: recentBookings as unknown as AnalyticsData["recentBookings"],
    recentlyAddedResources: recentlyAddedResources as unknown as IResource[],
    upcomingBookings: upcomingBookings as unknown as AnalyticsData["upcomingBookings"],
    pendingList: pendingList as unknown as AnalyticsData["pendingList"],
    monthlyBookings: monthlyList,
    monthlyTrends: monthlyList,
  };

  cachedAnalytics = { data: result, timestamp: Date.now() };
  return result;
}
