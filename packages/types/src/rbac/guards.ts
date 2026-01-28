import type { User, VenueStaff, PlatformAdmin } from '../models/user';
import { UserType } from '../enums/user-type';
import type { PermissionKey } from './permissions';
import { venueRolePermissions, adminRolePermissions } from './roles';

export function isVenueStaff(user: User): user is VenueStaff {
  return user.userType === UserType.VENUE_STAFF;
}

export function isPlatformAdmin(user: User): user is PlatformAdmin {
  return user.userType === UserType.PLATFORM_ADMIN;
}

export function hasPermission(user: User, permission: PermissionKey): boolean {
  if (isVenueStaff(user)) {
    return venueRolePermissions[user.role]?.includes(permission) ?? false;
  }
  if (isPlatformAdmin(user)) {
    return adminRolePermissions[user.role]?.includes(permission) ?? false;
  }
  return false;
}
