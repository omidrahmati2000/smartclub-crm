import { http, HttpResponse } from 'msw';
import {
  getCustomersByVenue,
  getCustomerById,
  addCustomerTag,
  removeCustomerTag,
  addCustomerNote,
  updateCustomerStatus,
  customerTags,
} from '../fixtures/customers';
import type { CustomerFilters, CustomerListItem } from '@smartclub/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const customerHandlers = [
  // GET /api/venues/:venueId/customers - Get customers list with filters
  http.get(`${BASE_URL}/venues/:venueId/customers`, ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    // Get query params for filters
    const search = url.searchParams.get('search')?.toLowerCase();
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sortBy') || 'lastVisit';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let customers = getCustomersByVenue(venueId as string);

    // Apply search filter
    if (search) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.phone.includes(search)
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      customers = customers.filter((c) => c.status === status);
    }

    // Sort
    customers.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'totalSpent':
          aValue = a.stats.totalSpent;
          bValue = b.stats.totalSpent;
          break;
        case 'totalBookings':
          aValue = a.stats.totalBookings;
          bValue = b.stats.totalBookings;
          break;
        case 'lastVisit':
        default:
          aValue = new Date(a.lastVisit).getTime();
          bValue = new Date(b.lastVisit).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Convert to list items
    const listItems: CustomerListItem[] = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      avatar: c.avatar,
      status: c.status,
      tags: c.customerTags,
      totalBookings: c.stats.totalBookings,
      totalSpent: c.stats.totalSpent,
      currency: c.stats.currency,
      lastVisit: c.lastVisit,
    }));

    return HttpResponse.json({
      data: listItems,
      total: listItems.length,
      success: true,
    });
  }),

  // GET /api/customers/:customerId - Get customer profile
  http.get(`${BASE_URL}/customers/:customerId`, ({ params }) => {
    const { customerId } = params;
    const customer = getCustomerById(customerId as string);

    if (!customer) {
      return HttpResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: customer,
      success: true,
    });
  }),

  // POST /api/customers/:customerId/tags - Add tag to customer
  http.post(`${BASE_URL}/customers/:customerId/tags`, async ({ params, request }) => {
    const { customerId } = params;
    const body = (await request.json()) as any;
    const { tagId } = body;

    const tag = customerTags.find((t) => t.id === tagId);
    if (!tag) {
      return HttpResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    const customer = addCustomerTag(customerId as string, tag);

    if (!customer) {
      return HttpResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json({
      data: customer,
      success: true,
    });
  }),

  // DELETE /api/customers/:customerId/tags/:tagId - Remove tag from customer
  http.delete(`${BASE_URL}/customers/:customerId/tags/:tagId`, async ({ params }) => {
    const { customerId, tagId } = params;

    const customer = removeCustomerTag(customerId as string, tagId as string);

    if (!customer) {
      return HttpResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json({
      data: customer,
      success: true,
    });
  }),

  // POST /api/customers/:customerId/notes - Add note to customer
  http.post(`${BASE_URL}/customers/:customerId/notes`, async ({ params, request }) => {
    const { customerId } = params;
    const body = (await request.json()) as any;
    const { content, createdBy, createdByName } = body;

    const customer = addCustomerNote(customerId as string, {
      content,
      createdBy,
      createdByName,
    });

    if (!customer) {
      return HttpResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return HttpResponse.json({
      data: customer,
      success: true,
    });
  }),

  // PATCH /api/customers/:customerId/status - Update customer status
  http.patch(`${BASE_URL}/customers/:customerId/status`, async ({ params, request }) => {
    const { customerId } = params;
    const body = (await request.json()) as any;
    const { status } = body;

    const customer = updateCustomerStatus(customerId as string, status);

    if (!customer) {
      return HttpResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return HttpResponse.json({
      data: customer,
      success: true,
    });
  }),

  // GET /api/venues/:venueId/customer-tags - Get available tags
  http.get(`${BASE_URL}/venues/:venueId/customer-tags`, () => {
    return HttpResponse.json({
      data: customerTags,
      success: true,
    });
  }),

  // GET /api/venues/:venueId/customers/export - Export customers to CSV
  http.get(`${BASE_URL}/venues/:venueId/customers/export`, ({ params }) => {
    const { venueId } = params;
    const customers = getCustomersByVenue(venueId as string);

    // Generate CSV content
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Total Bookings', 'Total Spent', 'Last Visit'];
    const rows = customers.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.status,
      c.stats.totalBookings.toString(),
      c.stats.totalSpent.toString(),
      new Date(c.lastVisit).toLocaleDateString('fa-IR'),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

    return new HttpResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="customers-${Date.now()}.csv"`,
      },
    });
  }),
];
