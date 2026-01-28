import { VenueRole } from '../enums/venue-role';
import { Permission } from '../rbac/permissions';

export interface StaffMember {
  id: string;
  userId: string; // Reference to base User
  venueId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: VenueRole;
  status: StaffStatus;

  // Employment info
  hireDate: string;
  notes?: string;

  // Permissions (derived from role)
  permissions: Permission[];

  // Dates
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID who added this staff member
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  INVITED = 'INVITED', // Invitation sent but not accepted yet
  SUSPENDED = 'SUSPENDED',
}

export interface StaffActivity {
  id: string;
  staffId: string;
  action: string; // e.g., "Created booking", "Updated asset", "Cancelled booking"
  entityType: string; // e.g., "booking", "asset", "customer"
  entityId: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface StaffInvitation {
  id: string;
  venueId: string;
  email: string;
  role: VenueRole;
  invitedBy: string; // User ID
  invitedByName: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

// DTO for staff list filters
export interface StaffFilters {
  search?: string; // Search by name or email
  role?: VenueRole;
  status?: StaffStatus;
  sortBy?: 'name' | 'role' | 'hireDate';
  sortOrder?: 'asc' | 'desc';
}

// DTO for creating/updating staff
export interface CreateStaffDTO {
  email: string;
  name: string;
  phone: string;
  role: VenueRole;
  notes?: string;
}

export interface UpdateStaffDTO {
  name?: string;
  phone?: string;
  role?: VenueRole;
  status?: StaffStatus;
  notes?: string;
}

// DTO for role permissions display
export interface RolePermissions {
  role: VenueRole;
  displayName: string;
  description: string;
  permissions: {
    category: string;
    items: {
      permission: Permission;
      label: string;
      enabled: boolean;
    }[];
  }[];
}
