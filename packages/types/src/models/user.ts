import { UserType } from '../enums/user-type';
import { VenueRole } from '../enums/venue-role';
import { AdminRole } from '../enums/admin-role';
import { SportType } from '../enums/sport-type';

export interface BaseUser {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  userType: UserType;
  locale: 'fa' | 'en';
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends BaseUser {
  userType: UserType.CUSTOMER;
  preferredSports: SportType[];
  skillLevels: Record<SportType, number>; // 0-7 scale
  bio?: string;
}

export interface Coach extends BaseUser {
  userType: UserType.COACH;
  specialties: SportType[];
  certifications: string[];
  bio: string;
  hourlyRate: number;
  currency: string;
  affiliatedVenueIds: string[];
  rating: number;
  reviewCount: number;
}

export interface VenueStaff extends BaseUser {
  userType: UserType.VENUE_STAFF;
  venueId: string;
  role: VenueRole;
}

export interface PlatformAdmin extends BaseUser {
  userType: UserType.PLATFORM_ADMIN;
  role: AdminRole;
}

export type User = Customer | Coach | VenueStaff | PlatformAdmin;
