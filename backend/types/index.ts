export type ResourceCategory =
  | "Cameras"
  | "Laptops"
  | "Projectors"
  | "Laboratory Equipment"
  | "Meeting Rooms"
  | "Sports Equipment"
  | "Audio Equipment"
  | "Other";

export type BookingStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled"
  | "Completed";

export type ReturnCondition =
  | "Excellent"
  | "Good"
  | "Damaged"
  | "Needs Maintenance";

export interface IResource {
  _id?: string;
  name: string;
  description: string;
  category: ResourceCategory;
  images: string[];
  location: string;
  totalQuantity: number;
  available: number;
  instructions?: string;
  maintenanceNotes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: string;
  bookingReference: string;
  resource: string | IResource;
  requesterName: string;
  requesterEmail: string;
  department?: string;
  purpose: string;
  startDate: Date | string;
  endDate: Date | string;
  startTime: string;
  endTime: string;
  quantity: number;
  status: BookingStatus;
  managerNotes?: string;
  issuedQuantity: number;
  returnedQuantity: number;
  expectedReturnDate?: Date | string;
  actualReturnDate?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReturn {
  _id?: string;
  booking: string | IBooking;
  resource: string | IResource;
  returnedQuantity: number;
  returnDate: Date | string;
  condition: ReturnCondition;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUsageHistory {
  _id?: string;
  resource: string | IResource;
  booking: string | IBooking;
  returnRecord?: string | IReturn;
  action: string;
  details?: string;
  createdAt?: Date;
}

export interface AvailabilityResult {
  resourceId: string;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  conflictingBookings: string[];
  conflictCount?: number;
}

export interface AnalyticsData {
  totalResources: number;
  availableResources: number;
  bookedResources: number;
  pendingRequests: number;
  currentlyIssued: number;
  overdueReturns: number;
  totalBookings: number;
  bookingsByStatus: Record<string, number>;
  statusCounts?: Record<string, number>;
  categoryStats: Array<{ category: string; count: number; bookings: number }>;
  categoryDistribution?: Array<{ category: string; count: number }>;
  frequentlyBooked: Array<{ resource: unknown; bookingCount: number }>;
  mostBookedResources?: Array<{
    resourceId?: string;
    name: string;
    category?: string;
    bookingCount: number;
  }>;
  recentBookings: IBooking[];
  recentlyAddedResources?: IResource[];
  upcomingBookings?: IBooking[];
  pendingList?: IBooking[];
  monthlyBookings: Array<{ month: string; count: number }>;
  monthlyTrends?: Array<{ month: string; count: number }>;
}
