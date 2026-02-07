import { http, HttpResponse } from 'msw';
import {
  getAutomationRulesByVenue,
  getAutomationRuleById,
  createAutomationRule,
  updateAutomationRule,
  deleteAutomationRule,
} from '../fixtures/automation';

export const automationHandlers = [
  // GET /api/venues/:venueId/automation - Get automation rules list
  http.get('/api/venues/:venueId/automation', ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const search = url.searchParams.get('search')?.toLowerCase();
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let rules = getAutomationRulesByVenue(venueId as string);

    // Apply search filter
    if (search) {
      rules = rules.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search)
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
        case 'trigger':
          aValue = a.trigger;
          bValue = b.trigger;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
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

  // GET /api/automation/:ruleId - Get automation rule details
  http.get('/api/automation/:ruleId', ({ params }) => {
    const { ruleId } = params;
    const rule = getAutomationRuleById(ruleId as string);

    if (!rule) {
      return HttpResponse.json(
        { success: false, message: 'Automation rule not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: rule,
      success: true,
    });
  }),

  // POST /api/venues/:venueId/automation - Create new automation rule
  http.post('/api/venues/:venueId/automation', async ({ params, request }) => {
    const { venueId } = params;
    const data = await request.json() as any;

    const newRule = createAutomationRule(venueId as string, data);

    return HttpResponse.json(
      {
        data: newRule,
        success: true,
        message: 'Automation rule created successfully',
      },
      { status: 201 }
    );
  }),

  // PUT /api/automation/:ruleId - Update automation rule
  http.put('/api/automation/:ruleId', async ({ params, request }) => {
    const { ruleId } = params;
    const data = await request.json() as any;

    const updatedRule = updateAutomationRule(ruleId as string, data);

    if (!updatedRule) {
      return HttpResponse.json(
        { success: false, message: 'Automation rule not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: updatedRule,
      success: true,
      message: 'Automation rule updated successfully',
    });
  }),

  // DELETE /api/automation/:ruleId - Delete automation rule
  http.delete('/api/automation/:ruleId', ({ params }) => {
    const { ruleId } = params;
    const deleted = deleteAutomationRule(ruleId as string);

    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: 'Automation rule not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Automation rule deleted successfully',
    });
  }),
];
