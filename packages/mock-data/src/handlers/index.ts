import { authHandlers } from './auth';
import { venueHandlers } from './venues';
import { bookingHandlers } from './bookings';
import { venueDashboardHandlers } from './venue-dashboard';

export const handlers = [
  ...authHandlers,
  ...venueHandlers,
  ...bookingHandlers,
  ...venueDashboardHandlers,
];
