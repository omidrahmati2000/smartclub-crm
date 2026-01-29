import { http, HttpResponse } from 'msw';
import type { VenueTaxSettings } from '@smartclub/types';
import { TaxType, TaxDisplayMode, TaxCategory, Country } from '@smartclub/types';
import { mockVenueSettings } from '../fixtures/venue-settings';

/**
 * Tax settings API handlers
 */
export const taxSettingsHandlers = [
  // GET /api/venues/:venueId/tax-settings
  http.get('/api/venues/:venueId/tax-settings', ({ params }) => {
    const { venueId } = params;
    const settings = mockVenueSettings[venueId as string];

    if (!settings) {
      return HttpResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Return tax settings or default
    const taxSettings = settings.taxSettings || getDefaultTaxSettings(venueId as string);

    return HttpResponse.json({
      success: true,
      data: taxSettings,
    });
  }),

  // PUT /api/venues/:venueId/tax-settings
  http.put('/api/venues/:venueId/tax-settings', async ({ params, request }) => {
    const { venueId } = params;
    const updates = (await request.json()) as Partial<VenueTaxSettings>;

    const settings = mockVenueSettings[venueId as string];

    if (!settings) {
      return HttpResponse.json(
        { success: false, error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update tax settings
    const updatedTaxSettings: VenueTaxSettings = {
      ...(settings.taxSettings || getDefaultTaxSettings(venueId as string)),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    settings.taxSettings = updatedTaxSettings;

    return HttpResponse.json({
      success: true,
      data: updatedTaxSettings,
    });
  }),

  // POST /api/tax/validate-id - Validate tax ID for a country
  http.post('/api/tax/validate-id', async ({ request }) => {
    const body = (await request.json()) as {
      countryCode: Country;
      taxId: string;
      taxType: TaxType;
    };
    const { countryCode, taxId, taxType } = body;

    // Simple validation patterns by country
    const validationPatterns: Partial<Record<Country, RegExp>> = {
      [Country.DE]: /^DE\d{9}$/,
      [Country.GB]: /^GB(\d{9}|\d{12})$/,
      [Country.FR]: /^FR[A-Z0-9]{2}\d{9}$/,
      [Country.ES]: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
      [Country.AE]: /^\d{15}$/,
      [Country.US]: /^\d{2}-\d{7}$/,
      [Country.AU]: /^\d{11}$/,
    };

    const pattern = validationPatterns[countryCode];
    const isValid = pattern ? pattern.test(taxId) : true;

    return HttpResponse.json({
      success: true,
      data: {
        isValid,
        countryCode,
        taxType,
        message: isValid ? 'Valid tax ID format' : 'Invalid tax ID format',
      },
    });
  }),

  // POST /api/tax/calculate - Calculate tax for an amount
  http.post('/api/tax/calculate', async ({ request }) => {
    const body = (await request.json()) as {
      venueId: string;
      amount: number;
      categoryId?: string;
    };
    const { venueId, amount, categoryId } = body;

    const settings = mockVenueSettings[venueId];
    const taxSettings = settings?.taxSettings;

    if (!taxSettings || !taxSettings.taxEnabled) {
      return HttpResponse.json({
        success: true,
        data: {
          subtotal: amount,
          taxAmount: 0,
          total: amount,
          taxRate: 0,
          breakdown: [],
        },
      });
    }

    // Find applicable rate
    let taxRate = taxSettings.defaultTaxRate;
    let categoryName = 'Standard';

    if (categoryId && taxSettings.taxRateCategories) {
      const category = taxSettings.taxRateCategories.find((c) => c.id === categoryId);
      if (category) {
        taxRate = category.rate;
        categoryName = category.name;
      }
    }

    // Calculate based on display mode
    let subtotal: number;
    let taxAmount: number;
    let total: number;

    if (taxSettings.displayMode === TaxDisplayMode.INCLUSIVE) {
      // Price includes tax
      total = amount;
      taxAmount = (amount * taxRate) / (100 + taxRate);
      subtotal = amount - taxAmount;
    } else {
      // Tax added on top
      subtotal = amount;
      taxAmount = (amount * taxRate) / 100;
      total = amount + taxAmount;
    }

    return HttpResponse.json({
      success: true,
      data: {
        subtotal: Math.round(subtotal * 100) / 100,
        taxAmount: Math.round(taxAmount * 100) / 100,
        total: Math.round(total * 100) / 100,
        taxRate,
        displayMode: taxSettings.displayMode,
        breakdown: [
          {
            category: categoryName,
            rate: taxRate,
            amount: Math.round(taxAmount * 100) / 100,
          },
        ],
      },
    });
  }),
];

/**
 * Get default tax settings for a venue
 */
function getDefaultTaxSettings(venueId: string): VenueTaxSettings {
  return {
    id: `tax-${venueId}`,
    venueId,
    taxEnabled: false,
    taxType: TaxType.NONE,
    defaultTaxRate: 0,
    displayMode: TaxDisplayMode.INCLUSIVE,
    showTaxBreakdown: false,
    exemptions: [],
    updatedAt: new Date().toISOString(),
    updatedBy: 'system',
  };
}
