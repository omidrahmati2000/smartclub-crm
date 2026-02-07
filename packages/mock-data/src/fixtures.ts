// Re-export fixtures only (no MSW handlers)
// Use this for edge runtime / middleware compatible imports
export { allMockUsers, mockCustomer, mockCoach, mockVenueOwner, mockVenueManager, mockAdmin } from './fixtures/users';
export { mockVenues, mockAssets } from './fixtures/venues';
export { mockBookings } from './fixtures/bookings';
export { PRODUCTS, PRODUCT_CATEGORIES, getProductById, getProductsByCategory, getCategoryById, getLowStockProducts, getOutOfStockProducts } from './fixtures/products';
export { SALES, generateSalesReport, getSalesReport } from './fixtures/sales';
