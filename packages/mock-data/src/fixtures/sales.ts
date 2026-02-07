import type { Sale, SalesReport } from '@smartclub/types'
import { PRODUCTS } from './products'

/**
 * Mock Sales Data for UAE Demo
 */
export const SALES: Sale[] = [
  {
    id: 'sale-1',
    items: [
      {
        productId: 'prod-1',
        productName: 'Espresso',
        quantity: 2,
        unitPrice: 15,
        total: 30,
      },
      {
        productId: 'prod-7',
        productName: 'Sandwich',
        quantity: 1,
        unitPrice: 28,
        total: 28,
      },
    ],
    subtotal: 58,
    tax: 0,
    total: 58,
    paymentMethod: 'card',
    customerName: 'Ahmed Al Sharif',
    tableNumber: '12',
    createdBy: 'staff-1',
    createdAt: new Date('2024-02-01T10:30:00'),
  },
  {
    id: 'sale-2',
    items: [
      {
        productId: 'prod-2',
        productName: 'Water (500ml)',
        quantity: 3,
        unitPrice: 5,
        total: 15,
      },
      {
        productId: 'prod-10',
        productName: 'Padel Balls (3-pack)',
        quantity: 1,
        unitPrice: 45,
        total: 45,
      },
    ],
    subtotal: 60,
    tax: 0,
    total: 60,
    paymentMethod: 'cash',
    customerName: 'Sara Abdullah',
    createdBy: 'staff-1',
    createdAt: new Date('2024-02-01T11:15:00'),
  },
  {
    id: 'sale-3',
    items: [
      {
        productId: 'prod-15',
        productName: 'Racket Rental - Pro',
        quantity: 2,
        unitPrice: 35,
        total: 70,
      },
    ],
    subtotal: 70,
    tax: 0,
    total: 70,
    paymentMethod: 'wallet',
    customerId: 'cust-1',
    customerName: 'Rashid Kareem',
    createdBy: 'staff-2',
    createdAt: new Date('2024-02-01T14:00:00'),
  },
  // More sales for analytics
  ...generateMockSales(100),
]

function generateMockSales(count: number): Sale[] {
  const sales: Sale[] = []
  const now = new Date()
  const paymentMethods: ('cash' | 'card' | 'wallet')[] = ['cash', 'card', 'wallet']
  const customerNames = [
    'Ahmed Al Sharif',
    'Sara Abdullah',
    'Rashid Kareem',
    'Mariam Hassan',
    'Hussein Al Rashid',
  ]

  for (let i = 0; i < count; i++) {
    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const hoursAgo = Math.floor(Math.random() * 24)
    const saleDate = new Date(now)
    saleDate.setDate(saleDate.getDate() - daysAgo)
    saleDate.setHours(hoursAgo)

    // Random 1-4 items
    const itemCount = Math.floor(Math.random() * 4) + 1
    const items = []
    let subtotal = 0

    for (let j = 0; j < itemCount; j++) {
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const total = product.price * quantity

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total,
      })

      subtotal += total
    }

    sales.push({
      id: `sale-${i + 4}`,
      items,
      subtotal,
      tax: 0,
      total: subtotal,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      createdBy: `staff-${Math.floor(Math.random() * 3) + 1}`,
      createdAt: saleDate,
    })
  }

  return sales
}

/**
 * Generate Sales Report
 */
export function generateSalesReport(
  startDate: Date,
  endDate: Date
): SalesReport {
  const salesInRange = SALES.filter(
    (sale) => sale.createdAt >= startDate && sale.createdAt <= endDate
  )

  const totalSales = salesInRange.reduce((sum, sale) => sum + sale.total, 0)
  const totalOrders = salesInRange.length
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

  // Top Products
  const productSales = new Map<string, { name: string; quantity: number; revenue: number }>()
  salesInRange.forEach((sale) => {
    sale.items.forEach((item) => {
      const existing = productSales.get(item.productId) || {
        name: item.productName,
        quantity: 0,
        revenue: 0,
      }
      productSales.set(item.productId, {
        name: item.productName,
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.total,
      })
    })
  })

  const topProducts = Array.from(productSales.entries())
    .map(([productId, data]) => ({
      productId,
      productName: data.name,
      quantity: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Sales by Category
  const categorySales = new Map<string, { name: string; revenue: number; orderCount: number }>()
  salesInRange.forEach((sale) => {
    sale.items.forEach((item) => {
      const product = PRODUCTS.find((p) => p.id === item.productId)
      if (product) {
        const existing = categorySales.get(product.categoryId) || {
          name: 'Unknown',
          revenue: 0,
          orderCount: 0,
        }
        categorySales.set(product.categoryId, {
          name: existing.name,
          revenue: existing.revenue + item.total,
          orderCount: existing.orderCount + 1,
        })
      }
    })
  })

  const salesByCategory = Array.from(categorySales.entries()).map(([categoryId, data]) => ({
    categoryId,
    categoryName: data.name,
    revenue: data.revenue,
    orderCount: data.orderCount,
  }))

  // Sales Trend (daily)
  const dailySales = new Map<string, { revenue: number; orders: number }>()
  salesInRange.forEach((sale) => {
    const dateKey = sale.createdAt.toISOString().split('T')[0]
    const existing = dailySales.get(dateKey) || { revenue: 0, orders: 0 }
    dailySales.set(dateKey, {
      revenue: existing.revenue + sale.total,
      orders: existing.orders + 1,
    })
  })

  const salesTrend = Array.from(dailySales.entries())
    .map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    period: {
      start: startDate,
      end: endDate,
    },
    totalSales,
    totalOrders,
    averageOrderValue,
    topProducts,
    salesByCategory,
    salesTrend,
  }
}

export function getSalesReport(periodDays: number = 30): SalesReport {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - periodDays)

  return generateSalesReport(startDate, endDate)
}
