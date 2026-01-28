import { http, HttpResponse } from 'msw';
import {
  getPricingRulesByVenue,
  getPricingRuleById,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  togglePricingRuleStatus,
} from '../fixtures/pricing-rules';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const pricingRulesHandlers = [
  // GET /api/venues/:venueId/pricing-rules - Get pricing rules list
  http.get(`${BASE_URL}/venues/:venueId/pricing-rules`, ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.toLowerCase();
    const sortBy = url.searchParams.get('sortBy') || 'priority';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let rules = getPricingRulesByVenue(venueId as string);

    // Apply filters
    if (type && type !== 'all') {
      rules = rules.filter((r) => r.type === type);
    }

    if (status && status !== 'all') {
      rules = rules.filter((r) => r.status === status);
    }

    if (search) {
      rules = rules.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.description?.toLowerCase().includes(search)
      );
    }

    // Sort
    rules.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.priority;
          bValue = b.priority;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return HttpResponse.json({
      data: rules,
      total: rules.length,
      success: true,
    });
  }),

  // GET /api/pricing-rules/:ruleId - Get pricing rule details
  http.get(`${BASE_URL}/pricing-rules/:ruleId`, ({ params }) => {
    const { ruleId } = params;
    const rule = getPricingRuleById(ruleId as string);

    if (!rule) {
      return HttpResponse.json({ error: 'Pricing rule not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: rule,
      success: true,
    });
  }),

  // POST /api/venues/:venueId/pricing-rules - Create pricing rule
  http.post(`${BASE_URL}/venues/:venueId/pricing-rules`, async ({ params, request }) => {
    const { venueId } = params;
    const body = await request.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newRule = createPricingRule({
      ...body,
      venueId,
    });

    return HttpResponse.json({
      data: newRule,
      success: true,
    });
  }),

  // PUT /api/pricing-rules/:ruleId - Update pricing rule
  http.put(`${BASE_URL}/pricing-rules/:ruleId`, async ({ params, request }) => {
    const { ruleId } = params;
    const updates = await request.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updated = updatePricingRule(ruleId as string, updates);

    if (!updated) {
      return HttpResponse.json({ error: 'Pricing rule not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: updated,
      success: true,
    });
  }),

  // DELETE /api/pricing-rules/:ruleId - Delete pricing rule
  http.delete(`${BASE_URL}/pricing-rules/:ruleId`, async ({ params }) => {
    const { ruleId } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = deletePricingRule(ruleId as string);

    if (!success) {
      return HttpResponse.json({ error: 'Pricing rule not found' }, { status: 404 });
    }

    return HttpResponse.json({
      message: 'Pricing rule deleted successfully',
      success: true,
    });
  }),

  // PATCH /api/pricing-rules/:ruleId/toggle - Toggle pricing rule status
  http.patch(`${BASE_URL}/pricing-rules/:ruleId/toggle`, async ({ params }) => {
    const { ruleId } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const rule = togglePricingRuleStatus(ruleId as string);

    if (!rule) {
      return HttpResponse.json({ error: 'Pricing rule not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: rule,
      success: true,
    });
  }),

  // POST /api/pricing-rules/preview - Preview price with rules
  http.post(`${BASE_URL}/pricing-rules/preview`, async ({ request }) => {
    const { basePrice, assetId, dateTime, duration } = await request.json();

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock price calculation
    const mockPreview = {
      basePrice,
      appliedRules: [
        {
          ruleId: 'pricing-1',
          ruleName: 'قیمت‌گذاری ساعات اوج',
          ruleType: 'PEAK_HOURS',
          adjustment: basePrice * 0.25,
          adjustmentType: 'PERCENTAGE_INCREASE',
        },
      ],
      finalPrice: basePrice * 1.25,
      totalAdjustment: basePrice * 0.25,
      totalAdjustmentPercentage: 25,
      currency: 'IRR',
    };

    return HttpResponse.json({
      data: mockPreview,
      success: true,
    });
  }),
];
