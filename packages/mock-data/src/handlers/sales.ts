import { http, HttpResponse, delay } from 'msw'
import { getSalesReport } from '../fixtures/sales'

/**
 * Sales Reports API Handlers
 */
export const salesHandlers = [
  // GET /api/sales/report - Get sales report
  http.get('/api/sales/report', async ({ request }) => {
    await delay(400)

    const url = new URL(request.url)
    const periodDays = parseInt(url.searchParams.get('days') || '30', 10)

    const report = getSalesReport(periodDays)

    return HttpResponse.json(report)
  }),
]
