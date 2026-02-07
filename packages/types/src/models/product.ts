/**
 * Product Management Types
 */

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export enum StockAdjustmentType {
  INCREASE = 'increase',
  DECREASE = 'decrease',
  SET = 'set',
}

export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  categoryId: string
  price: number
  costPrice?: number
  image?: string
  trackStock: boolean
  currentStock?: number
  lowStockThreshold?: number
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  productCount: number
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface StockAdjustment {
  id: string
  productId: string
  type: StockAdjustmentType
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  createdBy: string
  createdAt: Date
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'cash' | 'card' | 'wallet'
  customerId?: string
  customerName?: string
  tableNumber?: string
  createdBy: string
  createdAt: Date
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface SalesReport {
  period: {
    start: Date
    end: Date
  }
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  topProducts: {
    productId: string
    productName: string
    quantity: number
    revenue: number
  }[]
  salesByCategory: {
    categoryId: string
    categoryName: string
    revenue: number
    orderCount: number
  }[]
  salesTrend: {
    date: string
    revenue: number
    orders: number
  }[]
}
