# E-commerce API Documentation

## Overview

This document describes the REST API for the modern e-commerce platform built with Next.js 15 and TypeScript.

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://your-domain.com/api/v1
```

## Authentication

Most endpoints require authentication using NextAuth.js session cookies or bearer tokens.

```http
Authorization: Bearer <token>
```

## Response Format

All API responses follow a consistent format:

```json
{
  "data": {}, // Success response data
  "error": {}, // Error information
  "pagination": { // For paginated endpoints
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## Endpoints

### Products

#### GET /products
Retrieve products with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term for title/description
- `category` (string): Filter by category slug
- `sort` (string): Sort order (name-asc, name-desc, price-asc, price-desc, newest)

**Response:**
```json
{
  "data": [
    {
      "id": "prod_123",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "images": ["/image1.jpg", "/image2.jpg"],
      "category": "electronics",
      "stock": 10,
      "sku": "SKU-001",
      "slug": "product-name",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET /products/[id]
Retrieve a single product by ID or slug.

**Response:** Single product object

#### POST /products (Admin)
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "sku": "SKU-001",
  "stock": 10,
  "categoryId": "cat_123",
  "images": ["/image1.jpg"]
}
```

#### PUT /products/[id] (Admin)
Update an existing product.

#### DELETE /products/[id] (Admin)
Delete a product.

### Categories

#### GET /categories
Retrieve all categories.

**Response:**
```json
{
  "data": [
    {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic products",
      "isActive": true
    }
  ]
}
```

### Cart

#### GET /cart
Retrieve current user's cart items.

#### POST /cart/items
Add item to cart.

**Request Body:**
```json
{
  "productId": "prod_123",
  "quantity": 2
}
```

#### PUT /cart/items/[itemId]
Update cart item quantity.

#### DELETE /cart/items/[itemId]
Remove item from cart.

#### DELETE /cart
Clear entire cart.

### Checkout

#### POST /checkout
Initiate checkout process.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "customerInfo": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  }
}
```

### Banners

#### GET /banners
Retrieve active banners for homepage.

#### GET /banners/all (Admin)
Retrieve all banners.

#### POST /banners (Admin)
Create new banner.

#### PUT /banners/[id] (Admin)
Update banner.

#### DELETE /banners/[id] (Admin)
Delete banner.

### Users (Admin)

#### GET /admin/users
Retrieve users list with pagination.

#### GET /admin/users/[id]
Get user details.

#### PUT /admin/users/[id]
Update user information.

#### DELETE /admin/users/[id]
Delete user.

### Health Check

#### GET /health
Check application health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 3600,
  "checks": {
    "database": {
      "status": "pass",
      "responseTime": 5
    },
    "memory": {
      "status": "pass",
      "percentage": 45.2
    }
  }
}
```

## Error Responses

API errors follow this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "details": {}
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute
- Admin endpoints: 500 requests per minute

## Pagination

Paginated endpoints support these query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

## Webhooks

### Stripe Webhooks

#### POST /webhooks/stripe
Handle Stripe webhook events.

**Events handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`

## Testing

The API includes comprehensive tests:
- Unit tests: `npm run test`
- Integration tests: `npm run test:api`
- E2E tests: `npm run test:e2e`

## SDK Examples

### JavaScript/TypeScript

```typescript
// Get products
const response = await fetch('/api/v1/products?category=electronics')
const data = await response.json()

// Add to cart
const cartResponse = await fetch('/api/v1/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: 'prod_123',
    quantity: 1
  })
})
```

### cURL

```bash
# Get products
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10"

# Create product (admin)
curl -X POST "http://localhost:3000/api/v1/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "New Product",
    "price": 99.99,
    "sku": "SKU-001"
  }'
```

## Environment Variables

Required environment variables for API functionality:

```bash
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-password"
```

## Deployment Notes

### Production Considerations

1. Enable HTTPS
2. Configure proper CORS headers
3. Set up monitoring and logging
4. Configure backup strategy
5. Enable CDN for static assets

### Security Headers

The API includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`

## Support

For API support and questions:
- Documentation: [Link to docs]
- Issues: [GitHub issues link]
- Email: support@your-domain.com