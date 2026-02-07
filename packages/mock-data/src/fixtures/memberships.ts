export interface Membership {
  id: string;
  venueId: string;
  name: string;
  description: string;
  price: number;
  period: 'Monthly' | 'Quarterly' | 'Annual' | 'Lifetime';
  currency: string;
  color: string;
  features: string[];
  subscribers: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

let membershipsDatabase: Membership[] = [
  {
    id: 'membership-1',
    venueId: 'venue-1',
    name: 'Silver Member',
    description: 'Perfect for casual players',
    price: 3500000,
    period: 'Quarterly',
    currency: 'IRR',
    color: 'bg-slate-400',
    features: ['10% discount on bookings', 'Free water every visit', 'Priority standby'],
    subscribers: 124,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'membership-2',
    venueId: 'venue-1',
    name: 'Gold Elite',
    description: 'For serious enthusiasts',
    price: 12000000,
    period: 'Annual',
    currency: 'IRR',
    color: 'bg-amber-400',
    features: [
      '25% discount on bookings',
      'Free racket rental',
      'Locker access',
      'Valet included',
    ],
    subscribers: 45,
    status: 'active',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
  {
    id: 'membership-3',
    venueId: 'venue-1',
    name: 'Founder / VIP',
    description: 'Exclusive lifetime privilege',
    price: 50000000,
    period: 'Lifetime',
    currency: 'IRR',
    color: 'bg-indigo-600',
    features: [
      'Fixed court priority',
      'Private lounge access',
      'Full VIP concierge',
      'Family matching',
    ],
    subscribers: 12,
    status: 'active',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-07T10:00:00Z',
  },
];

export function getMembershipsByVenue(venueId: string): Membership[] {
  return membershipsDatabase.filter((m) => m.venueId === venueId);
}

export function getMembershipById(membershipId: string): Membership | undefined {
  return membershipsDatabase.find((m) => m.id === membershipId);
}

export function createMembership(venueId: string, data: Partial<Membership>): Membership {
  const newMembership: Membership = {
    id: `membership-${Date.now()}`,
    venueId,
    name: data.name || 'New Membership',
    description: data.description || '',
    price: data.price || 0,
    period: data.period || 'Monthly',
    currency: 'IRR',
    color: data.color || 'bg-gray-400',
    features: data.features || [],
    subscribers: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  membershipsDatabase.push(newMembership);
  return newMembership;
}

export function updateMembership(membershipId: string, data: Partial<Membership>): Membership | undefined {
  const index = membershipsDatabase.findIndex((m) => m.id === membershipId);
  if (index === -1) return undefined;

  const updatedMembership = {
    ...membershipsDatabase[index],
    ...data,
    id: membershipsDatabase[index].id,
    venueId: membershipsDatabase[index].venueId,
    subscribers: membershipsDatabase[index].subscribers,
    createdAt: membershipsDatabase[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  membershipsDatabase[index] = updatedMembership;
  return updatedMembership;
}

export function deleteMembership(membershipId: string): boolean {
  const index = membershipsDatabase.findIndex((m) => m.id === membershipId);
  if (index === -1) return false;

  membershipsDatabase.splice(index, 1);
  return true;
}
