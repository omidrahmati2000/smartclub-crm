import { http, HttpResponse } from 'msw';
import type { CountryInfo, StateProvince } from '@smartclub/types';
import { Country, COUNTRY_TAX_CONFIGS } from '@smartclub/types';
import {
  mockCountries,
  mockStates,
  getCountryInfo,
  getStatesForCountry,
} from '../fixtures/countries';

/**
 * Country and location-related API handlers
 */
export const countryHandlers = [
  // GET /api/countries - List all supported countries
  http.get('/api/countries', ({ request }) => {
    const url = new URL(request.url);
    const region = url.searchParams.get('region');
    const search = url.searchParams.get('search')?.toLowerCase();

    let countries = [...mockCountries];

    // Filter by region
    if (region) {
      countries = countries.filter((c) => c.region === region);
    }

    // Filter by search term
    if (search) {
      countries = countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.nameLocal?.toLowerCase().includes(search) ||
          c.code.toLowerCase().includes(search)
      );
    }

    return HttpResponse.json({
      success: true,
      data: countries,
    });
  }),

  // GET /api/countries/:code - Get single country info
  http.get('/api/countries/:code', ({ params }) => {
    const code = (params.code as string).toUpperCase() as Country;
    const country = getCountryInfo(code);

    if (!country) {
      return HttpResponse.json(
        { success: false, error: 'Country not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: country,
    });
  }),

  // GET /api/countries/:code/states - Get states for a country
  http.get('/api/countries/:code/states', ({ params }) => {
    const code = (params.code as string).toUpperCase() as Country;
    const states = getStatesForCountry(code);

    return HttpResponse.json({
      success: true,
      data: states,
    });
  }),

  // GET /api/countries/:code/cities - Get cities for a country (with search)
  http.get('/api/countries/:code/cities', ({ params, request }) => {
    const code = (params.code as string).toUpperCase() as Country;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const state = url.searchParams.get('state');

    // For now, return empty - can be expanded with city data
    // In real app, this would query a cities database
    const cities: { id: string; name: string; state?: string }[] = [];

    return HttpResponse.json({
      success: true,
      data: cities,
    });
  }),

  // POST /api/location/timezone - Get timezone from coordinates
  http.post('/api/location/timezone', async ({ request }) => {
    const body = (await request.json()) as { latitude: number; longitude: number };
    const { latitude, longitude } = body;

    // Simple timezone approximation based on longitude
    // In real app, this would use a proper timezone API
    let timezone = 'UTC';

    // Middle East (longitude ~45-60)
    if (longitude >= 44 && longitude <= 63) {
      if (latitude >= 24 && latitude <= 40) {
        timezone = longitude >= 51 ? 'Asia/Tehran' : 'Asia/Dubai';
      }
    }
    // Europe (longitude ~-10 to 40)
    else if (longitude >= -10 && longitude <= 40) {
      if (latitude >= 35 && latitude <= 70) {
        timezone = longitude <= 0 ? 'Europe/London' : 'Europe/Berlin';
      }
    }
    // Americas (longitude ~-180 to -30)
    else if (longitude >= -180 && longitude <= -30) {
      if (latitude >= 25 && latitude <= 50) {
        timezone = longitude <= -100 ? 'America/Los_Angeles' : 'America/New_York';
      }
    }
    // Asia Pacific (longitude ~100 to 180)
    else if (longitude >= 100 && longitude <= 180) {
      timezone = 'Asia/Tokyo';
    }

    return HttpResponse.json({
      success: true,
      data: { timezone },
    });
  }),

  // POST /api/location/validate-postal - Validate postal code format
  http.post('/api/location/validate-postal', async ({ request }) => {
    const body = (await request.json()) as { countryCode: Country; postalCode: string };
    const { countryCode, postalCode } = body;

    const country = getCountryInfo(countryCode);

    if (!country) {
      return HttpResponse.json({
        success: false,
        error: 'Country not found',
      });
    }

    const pattern = new RegExp(country.postalCode.pattern, 'i');
    const isValid = pattern.test(postalCode);

    return HttpResponse.json({
      success: true,
      data: {
        isValid,
        format: country.postalCode.example,
        label: country.postalCode.label,
      },
    });
  }),

  // GET /api/tax/countries/:code - Get tax configuration for a country
  http.get('/api/tax/countries/:code', ({ params }) => {
    const code = (params.code as string).toUpperCase() as Country;
    const taxConfig = COUNTRY_TAX_CONFIGS[code];

    if (!taxConfig) {
      // Return default no-tax config for unknown countries
      return HttpResponse.json({
        success: true,
        data: {
          country: code,
          taxType: 'NONE',
          standardRate: 0,
          taxIdRequired: false,
          hasStateLevelTax: false,
        },
      });
    }

    return HttpResponse.json({
      success: true,
      data: taxConfig,
    });
  }),

  // GET /api/regions - Get list of regions for grouping
  http.get('/api/regions', () => {
    const regions = [
      { id: 'middle_east', name: 'Middle East', nameLocal: 'خاورمیانه' },
      { id: 'europe', name: 'Europe', nameLocal: 'اروپا' },
      { id: 'americas', name: 'Americas', nameLocal: 'آمریکا' },
      { id: 'asia_pacific', name: 'Asia Pacific', nameLocal: 'آسیا و اقیانوسیه' },
      { id: 'africa', name: 'Africa', nameLocal: 'آفریقا' },
    ];

    return HttpResponse.json({
      success: true,
      data: regions,
    });
  }),
];
