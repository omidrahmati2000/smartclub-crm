import {
  CustomerProfile,
  CustomerStatus,
  CustomerTag,
  CustomerNote,
} from '@smartclub/types';

// Predefined tags
export const customerTags: CustomerTag[] = [
  {
    id: 'tag-1',
    label: 'VIP',
    color: '#f59e0b',
    createdAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'tag-2',
    label: 'Regular',
    color: '#10b981',
    createdAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'tag-3',
    label: 'New',
    color: '#3b82f6',
    createdAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'tag-4',
    label: 'Problematic',
    color: '#ef4444',
    createdAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'tag-5',
    label: 'Tournament Player',
    color: '#8b5cf6',
    createdAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
];

export const mockCustomers: CustomerProfile[] = [
  {
    id: 'customer-1',
    userId: 'user-customer-1',
    name: 'Ahmed Al Sharif',
    email: 'ahmed.sharif@example.com',
    phone: '+971501112233',
    avatar: 'https://i.pravatar.cc/150?img=11',
    venueId: 'venue-1',
    customerTags: [customerTags[1], customerTags[4]], // Regular, Tournament Player
    status: CustomerStatus.REGULAR,
    stats: {
      totalBookings: 45,
      completedBookings: 42,
      cancelledBookings: 2,
      noShowCount: 1,
      totalSpent: 12500,
      currency: 'AED',
      averageBookingValue: 280,
      favoriteAssets: ['asset-1', 'asset-2'],
      preferredTimeSlots: ['evening'],
    },
    notes: [
      {
        id: 'note-1',
        customerId: 'customer-1',
        content: 'Loyal customer, always on time',
        createdBy: 'user-manager-1',
        createdByName: 'Venue Manager',
        createdAt: new Date('2024-12-15').toISOString(),
      },
    ],
    firstVisit: new Date('2024-06-01').toISOString(),
    lastVisit: new Date('2025-01-25').toISOString(),
    createdAt: new Date('2024-06-01').toISOString(),
    updatedAt: new Date('2025-01-25').toISOString(),
  },
  {
    id: 'customer-2',
    userId: 'user-customer-2',
    name: 'Sara Abdullah',
    email: 'sara.abdullah@example.com',
    phone: '+971507654321',
    avatar: 'https://i.pravatar.cc/150?img=5',
    venueId: 'venue-1',
    customerTags: [customerTags[0]], // VIP
    status: CustomerStatus.VIP,
    stats: {
      totalBookings: 78,
      completedBookings: 75,
      cancelledBookings: 3,
      noShowCount: 0,
      totalSpent: 28000,
      currency: 'AED',
      averageBookingValue: 360,
      favoriteAssets: ['asset-1'],
      preferredTimeSlots: ['morning', 'evening'],
    },
    notes: [
      {
        id: 'note-2',
        customerId: 'customer-2',
        content: 'VIP - Priority booking privileges',
        createdBy: 'user-owner-1',
        createdByName: 'Owner',
        createdAt: new Date('2024-10-01').toISOString(),
      },
      {
        id: 'note-3',
        customerId: 'customer-2',
        content: 'Prefers Court 1',
        createdBy: 'user-receptionist-1',
        createdByName: 'Receptionist',
        createdAt: new Date('2024-11-12').toISOString(),
      },
    ],
    firstVisit: new Date('2024-03-10').toISOString(),
    lastVisit: new Date('2025-01-27').toISOString(),
    createdAt: new Date('2024-03-10').toISOString(),
    updatedAt: new Date('2025-01-27').toISOString(),
  },
  {
    id: 'customer-3',
    userId: 'user-customer-3',
    name: 'Rashid Kareem',
    email: 'rashid.kareem@example.com',
    phone: '+971551234567',
    venueId: 'venue-1',
    customerTags: [customerTags[2]], // New
    status: CustomerStatus.NEW,
    stats: {
      totalBookings: 3,
      completedBookings: 2,
      cancelledBookings: 1,
      noShowCount: 0,
      totalSpent: 750,
      currency: 'AED',
      averageBookingValue: 250,
      favoriteAssets: ['asset-2'],
      preferredTimeSlots: ['afternoon'],
    },
    notes: [],
    firstVisit: new Date('2025-01-20').toISOString(),
    lastVisit: new Date('2025-01-26').toISOString(),
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-26').toISOString(),
  },
  {
    id: 'customer-4',
    userId: 'user-customer-4',
    name: 'Mariam Hassan',
    email: 'mariam.hassan@example.com',
    phone: '+971561234567',
    avatar: 'https://i.pravatar.cc/150?img=9',
    venueId: 'venue-1',
    customerTags: [customerTags[3]], // Problematic
    status: CustomerStatus.BLACKLISTED,
    stats: {
      totalBookings: 12,
      completedBookings: 6,
      cancelledBookings: 4,
      noShowCount: 2,
      totalSpent: 1800,
      currency: 'AED',
      averageBookingValue: 150,
      favoriteAssets: [],
      preferredTimeSlots: [],
    },
    notes: [
      {
        id: 'note-4',
        customerId: 'customer-4',
        content: 'Two no-shows, blacklisted',
        createdBy: 'user-manager-1',
        createdByName: 'Venue Manager',
        createdAt: new Date('2024-12-20').toISOString(),
      },
    ],
    firstVisit: new Date('2024-08-15').toISOString(),
    lastVisit: new Date('2024-12-18').toISOString(),
    createdAt: new Date('2024-08-15').toISOString(),
    updatedAt: new Date('2024-12-20').toISOString(),
  },
  {
    id: 'customer-5',
    userId: 'user-customer-5',
    name: 'Hussein Al Rashid',
    email: 'hussein.rashid@example.com',
    phone: '+971521234567',
    avatar: 'https://i.pravatar.cc/150?img=12',
    venueId: 'venue-1',
    customerTags: [customerTags[1]], // Regular
    status: CustomerStatus.REGULAR,
    stats: {
      totalBookings: 32,
      completedBookings: 30,
      cancelledBookings: 2,
      noShowCount: 0,
      totalSpent: 8500,
      currency: 'AED',
      averageBookingValue: 265,
      favoriteAssets: ['asset-1', 'asset-3'],
      preferredTimeSlots: ['morning'],
    },
    notes: [],
    firstVisit: new Date('2024-07-05').toISOString(),
    lastVisit: new Date('2025-01-24').toISOString(),
    createdAt: new Date('2024-07-05').toISOString(),
    updatedAt: new Date('2025-01-24').toISOString(),
  },
  {
    id: 'customer-6',
    userId: 'user-customer-6',
    name: 'Fatima Al Nouri',
    email: 'fatima.nouri@example.com',
    phone: '+971541234567',
    avatar: 'https://i.pravatar.cc/150?img=10',
    venueId: 'venue-1',
    customerTags: [customerTags[1], customerTags[4]], // Regular, Tournament
    status: CustomerStatus.REGULAR,
    stats: {
      totalBookings: 56,
      completedBookings: 54,
      cancelledBookings: 2,
      noShowCount: 0,
      totalSpent: 15400,
      currency: 'AED',
      averageBookingValue: 275,
      favoriteAssets: ['asset-2'],
      preferredTimeSlots: ['evening'],
    },
    notes: [
      {
        id: 'note-5',
        customerId: 'customer-6',
        content: 'Active tournament participant',
        createdBy: 'user-manager-1',
        createdByName: 'Venue Manager',
        createdAt: new Date('2024-11-01').toISOString(),
      },
    ],
    firstVisit: new Date('2024-05-12').toISOString(),
    lastVisit: new Date('2025-01-27').toISOString(),
    createdAt: new Date('2024-05-12').toISOString(),
    updatedAt: new Date('2025-01-27').toISOString(),
  },
  {
    id: 'customer-7',
    userId: 'user-customer-7',
    name: 'Omar Sadiq',
    email: 'omar.sadiq@example.com',
    phone: '+971581234567',
    venueId: 'venue-1',
    customerTags: [],
    status: CustomerStatus.INACTIVE,
    stats: {
      totalBookings: 8,
      completedBookings: 8,
      cancelledBookings: 0,
      noShowCount: 0,
      totalSpent: 2000,
      currency: 'AED',
      averageBookingValue: 250,
      favoriteAssets: ['asset-3'],
      preferredTimeSlots: ['afternoon'],
    },
    notes: [],
    firstVisit: new Date('2024-04-20').toISOString(),
    lastVisit: new Date('2024-09-15').toISOString(),
    createdAt: new Date('2024-04-20').toISOString(),
    updatedAt: new Date('2024-09-15').toISOString(),
  },
];

// Helper functions
export function getCustomersByVenue(venueId: string): CustomerProfile[] {
  return mockCustomers.filter((c) => c.venueId === venueId);
}

export function getCustomerById(customerId: string): CustomerProfile | undefined {
  return mockCustomers.find((c) => c.id === customerId);
}

export function addCustomerTag(
  customerId: string,
  tag: CustomerTag
): CustomerProfile | undefined {
  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer) return undefined;

  // Check if tag already exists
  if (!customer.customerTags.find((t) => t.id === tag.id)) {
    customer.customerTags.push(tag);
    customer.updatedAt = new Date().toISOString();
  }

  return customer;
}

export function removeCustomerTag(customerId: string, tagId: string): CustomerProfile | undefined {
  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer) return undefined;

  customer.customerTags = customer.customerTags.filter((t) => t.id !== tagId);
  customer.updatedAt = new Date().toISOString();

  return customer;
}

export function addCustomerNote(
  customerId: string,
  note: Omit<CustomerNote, 'id' | 'customerId' | 'createdAt'>
): CustomerProfile | undefined {
  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer) return undefined;

  const newNote: CustomerNote = {
    id: `note-${Date.now()}`,
    customerId,
    ...note,
    createdAt: new Date().toISOString(),
  };

  customer.notes.push(newNote);
  customer.updatedAt = new Date().toISOString();

  return customer;
}

export function updateCustomerStatus(
  customerId: string,
  status: CustomerStatus
): CustomerProfile | undefined {
  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer) return undefined;

  customer.status = status;
  customer.updatedAt = new Date().toISOString();

  return customer;
}
