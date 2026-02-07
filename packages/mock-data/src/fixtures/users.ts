import { UserType, VenueRole, AdminRole } from '@smartclub/types';
import type { Customer, Coach, VenueStaff, PlatformAdmin } from '@smartclub/types';

export const mockCustomer: Customer = {
  id: 'user-customer-1',
  email: 'customer@test.com',
  phone: '+971501234567',
  firstName: 'Ali',
  lastName: 'Al Rashid',
  avatarUrl: undefined,
  userType: UserType.CUSTOMER,
  locale: 'en',
  preferredSports: [],
  skillLevels: {} as Record<string, number>,
  bio: 'Passionate about padel and tennis',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockCoach: Coach = {
  id: 'user-coach-1',
  email: 'coach@test.com',
  phone: '+971509876543',
  firstName: 'Mohammed',
  lastName: 'Al Farsi',
  avatarUrl: undefined,
  userType: UserType.COACH,
  locale: 'en',
  specialties: [],
  certifications: ['Tennis Federation Coaching Certificate', 'Padel Professional Instructor'],
  bio: 'Professional padel and tennis coach with 10 years of experience',
  hourlyRate: 250,
  currency: 'AED',
  affiliatedVenueIds: ['venue-1', 'venue-2'],
  rating: 4.8,
  reviewCount: 45,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueOwner: VenueStaff = {
  id: 'user-venue-owner-1',
  email: 'venue-owner@test.com',
  phone: '+971503456789',
  firstName: 'Rashid',
  lastName: 'Al Maktoum',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'en',
  venueId: 'venue-1',
  role: VenueRole.OWNER,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueManager: VenueStaff = {
  id: 'user-venue-manager-1',
  email: 'venue-manager@test.com',
  phone: '+971504567890',
  firstName: 'Sara',
  lastName: 'Al Sharif',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'en',
  venueId: 'venue-1',
  role: VenueRole.MANAGER,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueReceptionist: VenueStaff = {
  id: 'user-venue-receptionist-1',
  email: 'receptionist@test.com',
  phone: '+971505678901',
  firstName: 'Mina',
  lastName: 'Al Hassan',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'en',
  venueId: 'venue-1',
  role: VenueRole.RECEPTIONIST,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueCashier: VenueStaff = {
  id: 'user-venue-cashier-1',
  email: 'cashier@test.com',
  phone: '+971506789012',
  firstName: 'Hussein',
  lastName: 'Al Nouri',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'en',
  venueId: 'venue-1',
  role: VenueRole.CASHIER,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockAdmin: PlatformAdmin = {
  id: 'user-admin-1',
  email: 'admin@test.com',
  phone: '+971500000000',
  firstName: 'Admin',
  lastName: 'System',
  avatarUrl: undefined,
  userType: UserType.PLATFORM_ADMIN,
  locale: 'en',
  role: AdminRole.SUPER_ADMIN,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const allMockUsers = [
  mockCustomer,
  mockCoach,
  mockVenueOwner,
  mockVenueManager,
  mockVenueReceptionist,
  mockVenueCashier,
  mockAdmin,
];
