export interface CustomerProfile {
  id: string;
  userId: string; // Reference to base User
  name: string;
  email: string;
  phone: string;
  avatar?: string;

  // Venue-specific data
  venueId: string;
  customerTags: CustomerTag[];
  status: CustomerStatus;

  // Statistics
  stats: CustomerStats;

  // Notes (private, staff-only)
  notes: CustomerNote[];

  // Dates
  firstVisit: string;
  lastVisit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowCount: number;
  totalSpent: number; // Total money spent at this venue
  currency: string;
  averageBookingValue: number;
  favoriteAssets: string[]; // Asset IDs they book most
  preferredTimeSlots: string[]; // e.g., ["morning", "evening"]
}

export interface CustomerTag {
  id: string;
  label: string;
  color: string; // hex color for badge
  createdAt: string;
  createdBy: string; // Staff user ID who added the tag
}

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  VIP = 'VIP',
  REGULAR = 'REGULAR',
  NEW = 'NEW',
  BLACKLISTED = 'BLACKLISTED',
  INACTIVE = 'INACTIVE',
}

export interface CustomerNote {
  id: string;
  customerId: string;
  content: string;
  createdBy: string; // Staff user ID
  createdByName: string; // Staff name for display
  createdAt: string;
  updatedAt?: string;
}

// DTO for customer list filters
export interface CustomerFilters {
  search?: string; // Search by name, email, phone
  status?: CustomerStatus;
  tags?: string[]; // Filter by tag IDs
  minSpent?: number;
  maxSpent?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'name' | 'totalSpent' | 'totalBookings' | 'lastVisit';
  sortOrder?: 'asc' | 'desc';
}

// DTO for customer list response
export interface CustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: CustomerStatus;
  tags: CustomerTag[];
  totalBookings: number;
  totalSpent: number;
  currency: string;
  lastVisit: string;
}
