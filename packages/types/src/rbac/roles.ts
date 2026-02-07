import { VenueRole } from '../enums/venue-role';
import { AdminRole } from '../enums/admin-role';
import { Permission, type PermissionKey } from './permissions';

export const venueRolePermissions: Record<VenueRole, PermissionKey[]> = {
  [VenueRole.OWNER]: Object.values(Permission).filter((p) => !p.startsWith('platform:')),
  [VenueRole.MANAGER]: [
    Permission.VENUE_VIEW,
    Permission.VENUE_EDIT,
    Permission.BOOKING_VIEW,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_EDIT,
    Permission.BOOKING_CANCEL,
    Permission.CALENDAR_VIEW,
    Permission.CALENDAR_MANAGE,
    Permission.ASSET_VIEW,
    Permission.ASSET_CREATE,
    Permission.ASSET_EDIT,
    Permission.CUSTOMER_VIEW,
    Permission.CUSTOMER_MANAGE,
    Permission.STAFF_VIEW,
    Permission.COACH_VIEW,
    Permission.COACH_MANAGE,
    Permission.PRICING_VIEW,
    Permission.PRICING_MANAGE,
    Permission.REPORTS_VIEW,
    Permission.TOURNAMENT_VIEW,
    Permission.TOURNAMENT_CREATE,
    Permission.TOURNAMENT_MANAGE,
  ],
  [VenueRole.RECEPTIONIST]: [
    Permission.VENUE_VIEW,
    Permission.BOOKING_VIEW,
    Permission.BOOKING_CREATE,
    Permission.BOOKING_EDIT,
    Permission.CALENDAR_VIEW,
    Permission.CALENDAR_MANAGE,
    Permission.ASSET_VIEW,
    Permission.CUSTOMER_VIEW,
    Permission.COACH_VIEW,
    Permission.TOURNAMENT_VIEW,
  ],
  [VenueRole.CASHIER]: [
    Permission.VENUE_VIEW,
    Permission.BOOKING_VIEW,
    Permission.BOOKING_CREATE,
    Permission.CALENDAR_VIEW,
    Permission.CUSTOMER_VIEW,
    Permission.COACH_VIEW,
    Permission.FINANCE_VIEW,
    Permission.TOURNAMENT_VIEW,
  ],
};

export const adminRolePermissions: Record<AdminRole, PermissionKey[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(Permission),
  [AdminRole.MODERATOR]: [
    Permission.PLATFORM_VENUES,
    Permission.PLATFORM_USERS,
    Permission.PLATFORM_MODERATION,
  ],
  [AdminRole.SUPPORT]: [
    Permission.PLATFORM_VENUES,
    Permission.PLATFORM_USERS,
  ],
  [AdminRole.FINANCE]: [
    Permission.PLATFORM_VENUES,
    Permission.PLATFORM_FINANCE,
  ],
};
