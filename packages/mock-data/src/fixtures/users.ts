import { UserType, VenueRole, AdminRole } from '@smartclub/types';
import type { Customer, Coach, VenueStaff, PlatformAdmin } from '@smartclub/types';

export const mockCustomer: Customer = {
  id: 'user-customer-1',
  email: 'customer@test.com',
  phone: '09121234567',
  firstName: 'علی',
  lastName: 'احمدی',
  avatarUrl: undefined,
  userType: UserType.CUSTOMER,
  locale: 'fa',
  preferredSports: [],
  skillLevels: {} as Record<string, number>,
  bio: 'عاشق پدل و تنیس',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockCoach: Coach = {
  id: 'user-coach-1',
  email: 'coach@test.com',
  phone: '09129876543',
  firstName: 'محمد',
  lastName: 'رضایی',
  avatarUrl: undefined,
  userType: UserType.COACH,
  locale: 'fa',
  specialties: [],
  certifications: ['مدرک مربیگری فدراسیون تنیس'],
  bio: 'مربی حرفه‌ای پدل و تنیس با ۱۰ سال تجربه',
  hourlyRate: 500000,
  currency: 'IRT',
  affiliatedVenueIds: ['venue-1', 'venue-2'],
  rating: 4.8,
  reviewCount: 45,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueOwner: VenueStaff = {
  id: 'user-venue-owner-1',
  email: 'venue-owner@test.com',
  phone: '09123456789',
  firstName: 'رضا',
  lastName: 'محمدی',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'fa',
  venueId: 'venue-1',
  role: VenueRole.OWNER,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueManager: VenueStaff = {
  id: 'user-venue-manager-1',
  email: 'venue-manager@test.com',
  phone: '09124567890',
  firstName: 'سارا',
  lastName: 'کریمی',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'fa',
  venueId: 'venue-1',
  role: VenueRole.MANAGER,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueReceptionist: VenueStaff = {
  id: 'user-venue-receptionist-1',
  email: 'receptionist@test.com',
  phone: '09125678901',
  firstName: 'مینا',
  lastName: 'احمدزاده',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'fa',
  venueId: 'venue-1',
  role: VenueRole.RECEPTIONIST,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockVenueCashier: VenueStaff = {
  id: 'user-venue-cashier-1',
  email: 'cashier@test.com',
  phone: '09126789012',
  firstName: 'حسین',
  lastName: 'نوری',
  avatarUrl: undefined,
  userType: UserType.VENUE_STAFF,
  locale: 'fa',
  venueId: 'venue-1',
  role: VenueRole.CASHIER,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
};

export const mockAdmin: PlatformAdmin = {
  id: 'user-admin-1',
  email: 'admin@test.com',
  phone: '09120000000',
  firstName: 'ادمین',
  lastName: 'سیستم',
  avatarUrl: undefined,
  userType: UserType.PLATFORM_ADMIN,
  locale: 'fa',
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
