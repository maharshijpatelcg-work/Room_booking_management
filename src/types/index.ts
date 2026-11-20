// Re-export backend types for frontend use
export type {
  IResource,
  IBooking,
  IReturn,
  IUsageHistory,
  AvailabilityResult,
  AnalyticsData,
  ResourceCategory,
  BookingStatus,
  ReturnCondition,
} from "@backend/types/index";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
}
