import { authHandlers } from './auth';
import { venueHandlers } from './venues';
import { bookingHandlers } from './bookings';
import { venueDashboardHandlers } from './venue-dashboard';
import { assetHandlers } from './assets';
import { venueSettingsHandlers } from './venue-settings';
import { customerHandlers } from './customers';
import { staffHandlers } from './staff';
import { financialReportsHandlers } from './financial-reports';
import { pricingRulesHandlers } from './pricing-rules';
import { countryHandlers } from './countries';
import { taxSettingsHandlers } from './tax-settings';
import { complianceHandlers } from './compliance';
import { paymentSettingsHandlers } from './payment-settings';

import { tournamentHandlers } from './tournaments';
import { shopHandlers } from './products';
import { salesHandlers } from './sales';

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
  ...pricingRulesHandlers,
  ...countryHandlers,
  ...taxSettingsHandlers,
  ...complianceHandlers,
  ...paymentSettingsHandlers,
  ...tournamentHandlers,
  ...shopHandlers,
  ...salesHandlers,
];
