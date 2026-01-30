import { http, HttpResponse } from 'msw';
import { generateRevenueReport, generateOccupancyReport } from '../fixtures/financial-reports';
import { ReportPeriod } from '@smartclub/types';

export const financialReportsHandlers = [
  // GET /api/venues/:venueId/reports/revenue - Get revenue report
  http.get('/api/venues/:venueId/reports/revenue', async ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const period = (url.searchParams.get('period') as ReportPeriod) || ReportPeriod.LAST_30_DAYS;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const report = generateRevenueReport(venueId as string, period);

    return HttpResponse.json({
      data: report,
      success: true,
    });
  }),

  // GET /api/venues/:venueId/reports/occupancy - Get occupancy report
  http.get('/api/venues/:venueId/reports/occupancy', async ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const period = (url.searchParams.get('period') as ReportPeriod) || ReportPeriod.LAST_7_DAYS;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const report = generateOccupancyReport(venueId as string, period);

    return HttpResponse.json({
      data: report,
      success: true,
    });
  }),

  // GET /api/venues/:venueId/reports/export - Export report
  http.get('/api/venues/:venueId/reports/export', async ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const format = url.searchParams.get('format') || 'CSV';
    const reportType = url.searchParams.get('reportType') || 'REVENUE';

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (format === 'CSV') {
      const report = generateRevenueReport(venueId as string);

      // Generate CSV content
      const headers = ['Date', 'Revenue', 'Bookings', 'Completed', 'Cancelled'];
      const rows = report.daily.map((d) => [
        d.date,
        d.revenue.toString(),
        d.bookings.toString(),
        d.completedBookings.toString(),
        d.cancelledBookings.toString(),
      ]);

      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

      return new HttpResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="revenue-report-${Date.now()}.csv"`,
        },
      });
    }

    // PDF export (mock)
    return HttpResponse.json({
      message: 'PDF export will be implemented',
      downloadUrl: '/mock-report.pdf',
      success: true,
    });
  }),
];
