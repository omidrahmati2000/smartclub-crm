# MSW Integration Fix - Permanent Solution

## Problem
Mock Service Worker (MSW) was not intercepting fetch requests, causing:
- `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` errors
- API calls returning HTML instead of JSON
- Mock data not loading

## Root Cause
1. Direct `fetch()` calls bypassing MSW initialization check
2. No centralized API client to ensure MSW readiness
3. Inconsistent fetch patterns across components

## Solution Implemented

### 1. Centralized API Client (`src/lib/api-client.ts`)
✅ Created a singleton API client that:
- Ensures MSW is initialized before ANY request
- Provides type-safe response interface
- Detects HTML responses (MSW failure indicator)
- Centralizes error handling

### 2. MSW Initialization Module (`src/lib/msw.ts`)
✅ Created dedicated MSW init module that:
- Initializes MSW exactly once
- Returns existing promise if already initializing
- Provides `isMSWReady()` status check

### 3. Updated Providers (`providers.tsx`)
✅ Simplified provider to use new MSW module
✅ Blocks rendering until MSW is ready (development only)

### 4. Migrated Core Hooks
✅ `use-assets.ts` - Now uses `apiClient`
✅ `use-bookings.ts` - Now uses `apiClient`
✅ `location-settings-form.tsx` - Partially migrated

## Files Still Needing Migration

Run this to see remaining files:
\`\`\`bash
grep -r "await fetch(" apps/venue-app/app --include="*.tsx" --include="*.ts" | grep -v node_modules
\`\`\`

Current list:
- `assets/_components/assets-content.tsx`
- `calendar/_components/calendar-view.tsx`
- `customers/_components/customer-profile-modal.tsx`
- `customers/_components/customers-content.tsx`
- `finance/_components/export-buttons.tsx`
- `overview/_components/overview-content.tsx`
- `pricing/_components/pricing-content.tsx`
- `settings/_components/booking-rules-form.tsx`
- `settings/_components/compliance-settings-form.tsx`
- `settings/_components/notification-settings.tsx`
- `settings/_components/operating-hours-form.tsx`
- `settings/_components/tax-settings-form.tsx`
- `settings/_components/venue-profile-form.tsx`
- `settings/_components/white-label-settings.tsx`
- `settings/services/payment-settings.ts`
- `staff/_components/add-staff-dialog.tsx`
- `staff/_components/delete-staff-dialog.tsx`
- `staff/_components/edit-staff-dialog.tsx`
- `staff/_components/staff-content.tsx`

## Migration Pattern

### OLD CODE:
\`\`\`typescript
const response = await fetch('/api/venues/123/assets');
const data = await response.json();
if (!data.success) {
  throw new Error(data.message);
}
return data.data;
\`\`\`

### NEW CODE:
\`\`\`typescript
import { apiClient } from '@/lib/api-client';

const result = await apiClient.get<Asset[]>('/venues/123/assets');
if (!result.success || !result.data) {
  throw new Error(result.message || result.error);
}
return result.data;
\`\`\`

### For POST/PUT/PATCH:
\`\`\`typescript
// OLD
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// NEW
const result = await apiClient.post('/bookings', data);
\`\`\`

## Testing

1. Start dev server: `pnpm dev`
2. Check console for: `[MSW] ✅ Mock Service Worker initialized`
3. Navigate to any page that loads data (e.g., `/assets`)
4. Data should load without "Unexpected token '<'" errors

## Benefits of This Approach

1. **Type Safety**: `apiClient.get<Asset[]>()` provides full TypeScript support
2. **Consistency**: All API calls follow the same pattern
3. **MSW Guaranteed**: Every request waits for MSW to be ready
4. **Better Errors**: Detects HTML responses (MSW failures) immediately
5. **Future-Proof**: Easy to swap MSW for real API later (just change `apiClient` implementation)

## Next Steps

1. ✅ Core infrastructure complete
2. ⏳ Migrate remaining component fetch calls (19 files)
3. ⏳ Create custom hooks for common operations (e.g., `useVenue`, `useCustomers`)
4. ⏳ Add React Query integration for caching (already in `use-assets` and `use-bookings`)

## Troubleshooting

If you still see "Unexpected token '<'" errors:
1. Check browser console for `[MSW]` messages
2. Verify `/mockServiceWorker.js` exists in `public/` folder
3. Check Network tab - requests to `/api/*` should show `[MSW]` in response
4. Clear browser cache and hard refresh (Ctrl+Shift+R)
