import {
  StaffMember,
  StaffStatus,
  StaffActivity,
  StaffInvitation,
  InvitationStatus,
  RolePermissions,
  PermissionKey,
} from '@smartclub/types';
import { VenueRole } from '@smartclub/types';
import { Permission } from '@smartclub/types';

// Helper to get permissions for a role
function getPermissionsForRole(role: VenueRole): PermissionKey[] {
  const rolePermissions: Record<VenueRole, PermissionKey[]> = {
    [VenueRole.OWNER]: [
      Permission.VENUE_VIEW,
      Permission.VENUE_EDIT,
      Permission.VENUE_DELETE,
      Permission.VENUE_SETTINGS,
      Permission.ASSET_VIEW,
      Permission.ASSET_CREATE,
      Permission.ASSET_EDIT,
      Permission.ASSET_DELETE,
      Permission.BOOKING_VIEW,
      Permission.BOOKING_CREATE,
      Permission.BOOKING_EDIT,
      Permission.BOOKING_CANCEL,
      Permission.CALENDAR_VIEW,
      Permission.CALENDAR_MANAGE,
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_MANAGE,
      Permission.STAFF_VIEW,
      Permission.STAFF_MANAGE,
      Permission.FINANCE_VIEW,
      Permission.FINANCE_MANAGE,
      Permission.REPORTS_VIEW,
      Permission.PRICING_VIEW,
      Permission.PRICING_MANAGE,
    ],
    [VenueRole.MANAGER]: [
      Permission.VENUE_VIEW,
      Permission.VENUE_EDIT,
      Permission.ASSET_VIEW,
      Permission.ASSET_CREATE,
      Permission.ASSET_EDIT,
      Permission.BOOKING_VIEW,
      Permission.BOOKING_CREATE,
      Permission.BOOKING_EDIT,
      Permission.BOOKING_CANCEL,
      Permission.CALENDAR_VIEW,
      Permission.CALENDAR_MANAGE,
      Permission.CUSTOMER_VIEW,
      Permission.CUSTOMER_MANAGE,
      Permission.STAFF_VIEW,
      Permission.FINANCE_VIEW,
      Permission.REPORTS_VIEW,
      Permission.PRICING_VIEW,
    ],
    [VenueRole.RECEPTIONIST]: [
      Permission.VENUE_VIEW,
      Permission.ASSET_VIEW,
      Permission.BOOKING_VIEW,
      Permission.BOOKING_CREATE,
      Permission.BOOKING_EDIT,
      Permission.CALENDAR_VIEW,
      Permission.CUSTOMER_VIEW,
    ],
    [VenueRole.CASHIER]: [
      Permission.VENUE_VIEW,
      Permission.BOOKING_VIEW,
      Permission.CUSTOMER_VIEW,
      Permission.FINANCE_VIEW,
    ],
  };

  return rolePermissions[role] || [];
}

export const mockStaffMembers: StaffMember[] = [
  {
    id: 'staff-1',
    userId: 'user-owner-1',
    venueId: 'venue-1',
    name: 'محمد رضایی',
    email: 'venue-owner@test.com',
    phone: '09121234567',
    avatar: 'https://i.pravatar.cc/150?img=13',
    role: VenueRole.OWNER,
    status: StaffStatus.ACTIVE,
    hireDate: new Date('2024-01-01').toISOString(),
    notes: 'مالک و بنیان‌گذار مجموعه',
    permissions: getPermissionsForRole(VenueRole.OWNER),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'staff-2',
    userId: 'user-manager-1',
    venueId: 'venue-1',
    name: 'سارا احمدی',
    email: 'venue-manager@test.com',
    phone: '09127654321',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: VenueRole.MANAGER,
    status: StaffStatus.ACTIVE,
    hireDate: new Date('2024-02-15').toISOString(),
    notes: 'مدیر عملیاتی با تجربه 5 ساله',
    permissions: getPermissionsForRole(VenueRole.MANAGER),
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'staff-3',
    userId: 'user-receptionist-1',
    venueId: 'venue-1',
    name: 'علی محمودی',
    email: 'receptionist@test.com',
    phone: '09131234567',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: VenueRole.RECEPTIONIST,
    status: StaffStatus.ACTIVE,
    hireDate: new Date('2024-03-01').toISOString(),
    permissions: getPermissionsForRole(VenueRole.RECEPTIONIST),
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'staff-4',
    userId: 'user-cashier-1',
    venueId: 'venue-1',
    name: 'فاطمه کریمی',
    email: 'cashier@test.com',
    phone: '09141234567',
    avatar: 'https://i.pravatar.cc/150?img=10',
    role: VenueRole.CASHIER,
    status: StaffStatus.ACTIVE,
    hireDate: new Date('2024-04-10').toISOString(),
    permissions: getPermissionsForRole(VenueRole.CASHIER),
    createdAt: new Date('2024-04-10').toISOString(),
    updatedAt: new Date('2024-04-10').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'staff-5',
    userId: 'user-receptionist-2',
    venueId: 'venue-1',
    name: 'حسین نوری',
    email: 'receptionist2@test.com',
    phone: '09151234567',
    role: VenueRole.RECEPTIONIST,
    status: StaffStatus.INACTIVE,
    hireDate: new Date('2024-05-20').toISOString(),
    notes: 'غیرفعال به دلیل مرخصی استعلاجی',
    permissions: getPermissionsForRole(VenueRole.RECEPTIONIST),
    createdAt: new Date('2024-05-20').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
    createdBy: 'user-owner-1',
  },
];

export const mockStaffActivities: StaffActivity[] = [
  {
    id: 'activity-1',
    staffId: 'staff-2',
    action: 'ایجاد رزرو حضوری',
    entityType: 'booking',
    entityId: 'booking-1',
    details: 'رزرو برای مشتری علی محمدی',
    timestamp: new Date('2025-01-28T10:30:00').toISOString(),
  },
  {
    id: 'activity-2',
    staffId: 'staff-3',
    action: 'حاضر کردن مشتری',
    entityType: 'booking',
    entityId: 'booking-2',
    timestamp: new Date('2025-01-28T11:00:00').toISOString(),
  },
  {
    id: 'activity-3',
    staffId: 'staff-2',
    action: 'ویرایش امکانات',
    entityType: 'asset',
    entityId: 'asset-1',
    details: 'تغییر قیمت زمین شماره 1',
    timestamp: new Date('2025-01-28T09:15:00').toISOString(),
  },
  {
    id: 'activity-4',
    staffId: 'staff-4',
    action: 'لغو رزرو',
    entityType: 'booking',
    entityId: 'booking-3',
    details: 'لغو به درخواست مشتری',
    timestamp: new Date('2025-01-27T16:45:00').toISOString(),
  },
  {
    id: 'activity-5',
    staffId: 'staff-3',
    action: 'افزودن یادداشت مشتری',
    entityType: 'customer',
    entityId: 'customer-1',
    timestamp: new Date('2025-01-27T14:20:00').toISOString(),
  },
];

export const mockStaffInvitations: StaffInvitation[] = [
  {
    id: 'invitation-1',
    venueId: 'venue-1',
    email: 'newstaff@example.com',
    role: VenueRole.RECEPTIONIST,
    invitedBy: 'user-owner-1',
    invitedByName: 'محمد رضایی',
    status: InvitationStatus.PENDING,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date('2025-01-25').toISOString(),
  },
];

// Role permissions display data
export const rolePermissionsData: RolePermissions[] = [
  {
    role: VenueRole.OWNER,
    displayName: 'مالک',
    description: 'دسترسی کامل به همه بخش‌ها',
    permissions: [
      {
        category: 'مجموعه',
        items: [
          { permission: Permission.VENUE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.VENUE_EDIT, label: 'ویرایش', enabled: true },
          { permission: Permission.VENUE_DELETE, label: 'حذف', enabled: true },
          { permission: Permission.VENUE_SETTINGS, label: 'تنظیمات', enabled: true },
        ],
      },
      {
        category: 'امکانات',
        items: [
          { permission: Permission.ASSET_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.ASSET_CREATE, label: 'ایجاد/ویرایش', enabled: true },
        ],
      },
      {
        category: 'رزروها',
        items: [
          { permission: Permission.BOOKING_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.BOOKING_CREATE, label: 'ایجاد/ویرایش', enabled: true },
        ],
      },
      {
        category: 'مشتریان',
        items: [
          { permission: Permission.CUSTOMER_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.CUSTOMER_MANAGE, label: 'مدیریت', enabled: true },
        ],
      },
      {
        category: 'کارکنان',
        items: [
          { permission: Permission.STAFF_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.STAFF_MANAGE, label: 'مدیریت', enabled: true },
        ],
      },
      {
        category: 'مالی',
        items: [
          { permission: Permission.FINANCE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.FINANCE_MANAGE, label: 'مدیریت', enabled: true },
        ],
      },
      {
        category: 'گزارشات و قیمت‌گذاری',
        items: [
          { permission: Permission.REPORTS_VIEW, label: 'مشاهده گزارشات', enabled: true },
          { permission: Permission.PRICING_VIEW, label: 'مشاهده قیمت‌ها', enabled: true },
          { permission: Permission.PRICING_MANAGE, label: 'مدیریت قیمت‌ها', enabled: true },
        ],
      },
    ],
  },
  {
    role: VenueRole.MANAGER,
    displayName: 'مدیر',
    description: 'دسترسی به اکثر بخش‌ها به جز حذف مجموعه و مدیریت کارکنان',
    permissions: [
      {
        category: 'مجموعه',
        items: [
          { permission: Permission.VENUE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.VENUE_EDIT, label: 'ویرایش', enabled: true },
          { permission: Permission.VENUE_DELETE, label: 'حذف', enabled: false },
          { permission: Permission.VENUE_SETTINGS, label: 'تنظیمات', enabled: false },
        ],
      },
      {
        category: 'امکانات',
        items: [
          { permission: Permission.ASSET_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.ASSET_CREATE, label: 'ایجاد/ویرایش', enabled: true },
        ],
      },
      {
        category: 'رزروها',
        items: [
          { permission: Permission.BOOKING_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.BOOKING_CREATE, label: 'ایجاد/ویرایش', enabled: true },
        ],
      },
      {
        category: 'مشتریان',
        items: [
          { permission: Permission.CUSTOMER_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.CUSTOMER_MANAGE, label: 'مدیریت', enabled: true },
        ],
      },
      {
        category: 'کارکنان',
        items: [
          { permission: Permission.STAFF_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.STAFF_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'مالی',
        items: [
          { permission: Permission.FINANCE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.FINANCE_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'گزارشات و قیمت‌گذاری',
        items: [
          { permission: Permission.REPORTS_VIEW, label: 'مشاهده گزارشات', enabled: true },
          { permission: Permission.PRICING_VIEW, label: 'مشاهده قیمت‌ها', enabled: true },
          { permission: Permission.PRICING_MANAGE, label: 'مدیریت قیمت‌ها', enabled: false },
        ],
      },
    ],
  },
  {
    role: VenueRole.RECEPTIONIST,
    displayName: 'پذیرش',
    description: 'مشاهده و ایجاد رزرو، مشاهده مشتریان',
    permissions: [
      {
        category: 'مجموعه',
        items: [
          { permission: Permission.VENUE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.VENUE_EDIT, label: 'ویرایش', enabled: false },
          { permission: Permission.VENUE_DELETE, label: 'حذف', enabled: false },
          { permission: Permission.VENUE_SETTINGS, label: 'تنظیمات', enabled: false },
        ],
      },
      {
        category: 'امکانات',
        items: [
          { permission: Permission.ASSET_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.ASSET_CREATE, label: 'ایجاد/ویرایش', enabled: false },
        ],
      },
      {
        category: 'رزروها',
        items: [
          { permission: Permission.BOOKING_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.BOOKING_CREATE, label: 'ایجاد/ویرایش', enabled: true },
        ],
      },
      {
        category: 'مشتریان',
        items: [
          { permission: Permission.CUSTOMER_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.CUSTOMER_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'کارکنان',
        items: [
          { permission: Permission.STAFF_VIEW, label: 'مشاهده', enabled: false },
          { permission: Permission.STAFF_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'مالی',
        items: [
          { permission: Permission.FINANCE_VIEW, label: 'مشاهده', enabled: false },
          { permission: Permission.FINANCE_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'گزارشات و قیمت‌گذاری',
        items: [
          { permission: Permission.REPORTS_VIEW, label: 'مشاهده گزارشات', enabled: false },
          { permission: Permission.PRICING_VIEW, label: 'مشاهده قیمت‌ها', enabled: false },
          { permission: Permission.PRICING_MANAGE, label: 'مدیریت قیمت‌ها', enabled: false },
        ],
      },
    ],
  },
  {
    role: VenueRole.CASHIER,
    displayName: 'صندوقدار',
    description: 'مشاهده رزروها، مشتریان و مالی',
    permissions: [
      {
        category: 'مجموعه',
        items: [
          { permission: Permission.VENUE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.VENUE_EDIT, label: 'ویرایش', enabled: false },
          { permission: Permission.VENUE_DELETE, label: 'حذف', enabled: false },
          { permission: Permission.VENUE_SETTINGS, label: 'تنظیمات', enabled: false },
        ],
      },
      {
        category: 'امکانات',
        items: [
          { permission: Permission.ASSET_VIEW, label: 'مشاهده', enabled: false },
          { permission: Permission.ASSET_CREATE, label: 'ایجاد/ویرایش', enabled: false },
        ],
      },
      {
        category: 'رزروها',
        items: [
          { permission: Permission.BOOKING_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.BOOKING_CREATE, label: 'ایجاد/ویرایش', enabled: false },
        ],
      },
      {
        category: 'مشتریان',
        items: [
          { permission: Permission.CUSTOMER_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.CUSTOMER_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'کارکنان',
        items: [
          { permission: Permission.STAFF_VIEW, label: 'مشاهده', enabled: false },
          { permission: Permission.STAFF_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'مالی',
        items: [
          { permission: Permission.FINANCE_VIEW, label: 'مشاهده', enabled: true },
          { permission: Permission.FINANCE_MANAGE, label: 'مدیریت', enabled: false },
        ],
      },
      {
        category: 'گزارشات و قیمت‌گذاری',
        items: [
          { permission: Permission.REPORTS_VIEW, label: 'مشاهده گزارشات', enabled: false },
          { permission: Permission.PRICING_VIEW, label: 'مشاهده قیمت‌ها', enabled: false },
          { permission: Permission.PRICING_MANAGE, label: 'مدیریت قیمت‌ها', enabled: false },
        ],
      },
    ],
  },
];

// Helper functions
export function getStaffByVenue(venueId: string): StaffMember[] {
  return mockStaffMembers.filter((s) => s.venueId === venueId);
}

export function getStaffById(staffId: string): StaffMember | undefined {
  return mockStaffMembers.find((s) => s.id === staffId);
}

export function getStaffActivities(staffId: string, limit: number = 10): StaffActivity[] {
  return mockStaffActivities
    .filter((a) => a.staffId === staffId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function createStaffMember(data: any): StaffMember {
  const newStaff: StaffMember = {
    id: `staff-${Date.now()}`,
    userId: `user-${Date.now()}`,
    venueId: data.venueId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    status: StaffStatus.ACTIVE,
    hireDate: new Date().toISOString(),
    notes: data.notes,
    permissions: getPermissionsForRole(data.role),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy,
  };

  mockStaffMembers.push(newStaff);
  return newStaff;
}

export function updateStaffMember(staffId: string, updates: any): StaffMember | undefined {
  const index = mockStaffMembers.findIndex((s) => s.id === staffId);
  if (index === -1) return undefined;

  mockStaffMembers[index] = {
    ...mockStaffMembers[index],
    ...updates,
    permissions: updates.role
      ? getPermissionsForRole(updates.role)
      : mockStaffMembers[index].permissions,
    updatedAt: new Date().toISOString(),
  };

  return mockStaffMembers[index];
}

export function deleteStaffMember(staffId: string): boolean {
  const index = mockStaffMembers.findIndex((s) => s.id === staffId);
  if (index === -1) return false;

  mockStaffMembers.splice(index, 1);
  return true;
}

export function getRolePermissions(role: VenueRole): RolePermissions | undefined {
  return rolePermissionsData.find((rp) => rp.role === role);
}
