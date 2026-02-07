import { http, HttpResponse, delay } from 'msw'
import type { Product, ProductCategory, StockAdjustment } from '@smartclub/types'
import { ProductStatus, StockAdjustmentType } from '@smartclub/types'
import {
  PRODUCTS,
  PRODUCT_CATEGORIES,
  getProductById,
  getProductsByCategory,
  getCategoryById,
  getLowStockProducts,
  getOutOfStockProducts,
} from '../fixtures/products'

// In-memory store for runtime modifications
let products = [...PRODUCTS]
let categories = [...PRODUCT_CATEGORIES]
const stockAdjustments: StockAdjustment[] = []

/**
 * Products API Handlers
 */
export const productsHandlers = [
  // GET /api/products - List all products
  http.get('/api/products', async () => {
    await delay(300)
    return HttpResponse.json(products)
  }),

  // GET /api/products/:id - Get product by ID
  http.get('/api/products/:id', async ({ params }) => {
    await delay(200)
    const { id } = params
    const product = products.find((p) => p.id === id)

    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(product)
  }),

  // POST /api/products - Create new product
  http.post('/api/products', async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as Partial<Product>

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: body.name || '',
      sku: body.sku || '',
      description: body.description,
      categoryId: body.categoryId || '',
      price: body.price || 0,
      costPrice: body.costPrice,
      image: body.image,
      trackStock: body.trackStock ?? true,
      currentStock: body.currentStock,
      lowStockThreshold: body.lowStockThreshold,
      status: body.status || ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    products.push(newProduct)

    // Update category product count
    const category = categories.find((c) => c.id === newProduct.categoryId)
    if (category) {
      category.productCount += 1
    }

    return HttpResponse.json(newProduct, { status: 201 })
  }),

  // PUT /api/products/:id - Update product
  http.put('/api/products/:id', async ({ params, request }) => {
    await delay(400)
    const { id } = params
    const body = (await request.json()) as Partial<Product>

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const oldCategoryId = products[index].categoryId
    const newCategoryId = body.categoryId

    products[index] = {
      ...products[index],
      ...body,
      updatedAt: new Date(),
    }

    // Update category counts if category changed
    if (oldCategoryId !== newCategoryId && newCategoryId) {
      const oldCategory = categories.find((c) => c.id === oldCategoryId)
      const newCategory = categories.find((c) => c.id === newCategoryId)
      if (oldCategory) oldCategory.productCount -= 1
      if (newCategory) newCategory.productCount += 1
    }

    return HttpResponse.json(products[index])
  }),

  // DELETE /api/products/:id - Delete product
  http.delete('/api/products/:id', async ({ params }) => {
    await delay(300)
    const { id } = params

    const index = products.findIndex((p) => p.id === id)
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = products[index]
    const category = categories.find((c) => c.id === product.categoryId)
    if (category) {
      category.productCount -= 1
    }

    products.splice(index, 1)

    return HttpResponse.json({ success: true })
  }),

  // GET /api/products/low-stock - Get low stock products
  http.get('/api/products/low-stock', async () => {
    await delay(200)
    const lowStock = products.filter(
      (p) =>
        p.trackStock &&
        p.currentStock !== undefined &&
        p.lowStockThreshold !== undefined &&
        p.currentStock < p.lowStockThreshold &&
        p.currentStock > 0
    )
    return HttpResponse.json(lowStock)
  }),

  // GET /api/products/out-of-stock - Get out of stock products
  http.get('/api/products/out-of-stock', async () => {
    await delay(200)
    const outOfStock = products.filter(
      (p) => p.trackStock && p.currentStock === 0
    )
    return HttpResponse.json(outOfStock)
  }),
]

/**
 * Categories API Handlers
 */
export const categoriesHandlers = [
  // GET /api/categories - List all categories
  http.get('/api/categories', async () => {
    await delay(200)
    return HttpResponse.json(categories)
  }),

  // GET /api/categories/:id - Get category by ID
  http.get('/api/categories/:id', async ({ params }) => {
    await delay(150)
    const { id } = params
    const category = categories.find((c) => c.id === id)

    if (!category) {
      return HttpResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(category)
  }),

  // POST /api/categories - Create new category
  http.post('/api/categories', async ({ request }) => {
    await delay(300)
    const body = (await request.json()) as Partial<ProductCategory>

    const newCategory: ProductCategory = {
      id: `cat-${Date.now()}`,
      name: body.name || '',
      description: body.description,
      productCount: 0,
      status: body.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    categories.push(newCategory)

    return HttpResponse.json(newCategory, { status: 201 })
  }),

  // PUT /api/categories/:id - Update category
  http.put('/api/categories/:id', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const body = (await request.json()) as Partial<ProductCategory>

    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    categories[index] = {
      ...categories[index],
      ...body,
      updatedAt: new Date(),
    }

    return HttpResponse.json(categories[index])
  }),

  // DELETE /api/categories/:id - Delete category
  http.delete('/api/categories/:id', async ({ params }) => {
    await delay(300)
    const { id } = params

    const index = categories.findIndex((c) => c.id === id)
    if (index === -1) {
      return HttpResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if category has products
    const hasProducts = products.some((p) => p.categoryId === id)
    if (hasProducts) {
      return HttpResponse.json(
        { error: 'Cannot delete category with products' },
        { status: 400 }
      )
    }

    categories.splice(index, 1)

    return HttpResponse.json({ success: true })
  }),

  // GET /api/categories/:id/products - Get products by category
  http.get('/api/categories/:id/products', async ({ params }) => {
    await delay(250)
    const { id } = params
    const categoryProducts = products.filter((p) => p.categoryId === id)
    return HttpResponse.json(categoryProducts)
  }),
]

/**
 * Stock Adjustment API Handlers
 */
export const stockHandlers = [
  // POST /api/products/:id/adjust-stock - Adjust product stock
  http.post('/api/products/:id/adjust-stock', async ({ params, request }) => {
    await delay(300)
    const { id } = params
    const body = (await request.json()) as {
      type: StockAdjustmentType
      quantity: number
      reason?: string
      createdBy: string
    }

    const product = products.find((p) => p.id === id)
    if (!product) {
      return HttpResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.trackStock) {
      return HttpResponse.json(
        { error: 'Product does not track stock' },
        { status: 400 }
      )
    }

    const previousStock = product.currentStock || 0
    let newStock = previousStock

    switch (body.type) {
      case StockAdjustmentType.INCREASE:
        newStock = previousStock + body.quantity
        break
      case StockAdjustmentType.DECREASE:
        newStock = Math.max(0, previousStock - body.quantity)
        break
      case StockAdjustmentType.SET:
        newStock = body.quantity
        break
    }

    product.currentStock = newStock
    product.updatedAt = new Date()

    // Update product status based on stock
    if (newStock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK
    } else if (product.status === ProductStatus.OUT_OF_STOCK) {
      product.status = ProductStatus.ACTIVE
    }

    // Create stock adjustment record
    const adjustment: StockAdjustment = {
      id: `adj-${Date.now()}`,
      productId: product.id,
      type: body.type,
      quantity: body.quantity,
      previousStock,
      newStock,
      reason: body.reason,
      createdBy: body.createdBy,
      createdAt: new Date(),
    }

    stockAdjustments.push(adjustment)

    return HttpResponse.json({
      product,
      adjustment,
    })
  }),

  // GET /api/products/:id/stock-history - Get stock adjustment history
  http.get('/api/products/:id/stock-history', async ({ params }) => {
    await delay(200)
    const { id } = params
    const history = stockAdjustments
      .filter((adj) => adj.productId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return HttpResponse.json(history)
  }),
]

export const shopHandlers = [
  ...productsHandlers,
  ...categoriesHandlers,
  ...stockHandlers,
]
