import { authHandlers } from './auth';
import { venueHandlers } from './venues';
import { bookingHandlers } from './bookings';

export const handlers = [
  ...authHandlers,
  ...venueHandlers,
  ...bookingHandlers,
];
