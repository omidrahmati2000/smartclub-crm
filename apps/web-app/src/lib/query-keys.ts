export const queryKeys = {
  bookings: {
    all: ['bookings'] as const,
    byUser: (userId: string) => ['bookings', 'user', userId] as const,
    detail: (id: string) => ['bookings', id] as const,
  },
  venues: {
    all: ['venues'] as const,
    list: (params: Record<string, string>) => ['venues', 'list', params] as const,
    detail: (slug: string) => ['venues', slug] as const,
    assets: (venueId: string) => ['venues', venueId, 'assets'] as const,
    slots: (venueId: string, assetId: string, date: string) =>
      ['venues', venueId, 'assets', assetId, 'slots', date] as const,
  },
  tournaments: {
    all: ['tournaments'] as const,
    detail: (id: string) => ['tournaments', id] as const,
  },
  users: {
    me: ['users', 'me'] as const,
    profile: (id: string) => ['users', id] as const,
  },
};
