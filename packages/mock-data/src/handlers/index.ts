import { authHandlers } from './auth';
import { venueHandlers } from './venues';
import { bookingHandlers } from './bookings';
import { venueDashboardHandlers } from './venue-dashboard';
import { assetHandlers } from './assets';
import { venueSettingsHandlers } from './venue-settings';
import { customerHandlers } from './customers';
import { staffHandlers } from './staff';
import { financialReportsHandlers } from './financial-reports';

export const handlers = [
  ...authHandlers,
  ...venueHandlers,
  ...bookingHandlers,
  ...venueDashboardHandlers,
  ...assetHandlers,
  ...venueSettingsHandlers,
  ...customerHandlers,
  ...staffHandlers,
  ...financialReportsHandlers,
];
