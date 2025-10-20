import { test, expect } from "@playwright/test"

test.describe("E-commerce User Journey", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("homepage loads correctly", async ({ page }) => {
    await expect(page).toHaveTitle(/my-v0-project/)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator('nav[role="navigation"]')).toBeVisible()
  })

  test("product search and filtering", async ({ page }) => {
    await page.click('text=Products')
    await expect(page).toHaveURL("/products")

    await page.fill('input[placeholder*="Search"]', "wireless")
    await page.waitForTimeout(500)

    const products = page.locator('[data-testid="product-card"]')
    await expect(products.first()).toBeVisible()
  })

  test("add product to cart", async ({ page }) => {
    await page.click('text=Products')
    await page.waitForSelector('[data-testid="product-card"]')
    
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await expect(firstProduct).toBeVisible()
    
    await firstProduct.locator('button:has-text("addToCart")').click()
    
    const cartButton = page.locator('a[href="/cart"]')
    await expect(cartButton.locator('text="1"')).toBeVisible()
  })

  test("navigate to product details", async ({ page }) => {
    await page.click('text=Products')
    await page.waitForSelector('[data-testid="product-card"]')
    
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    
    await expect(page).toHaveURL(/\/products\/\w+/)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator('img[alt*="Product"]')).toBeVisible()
  })

  test("checkout flow", async ({ page }) => {
    await page.click('text=Products')
    await page.waitForSelector('[data-testid="product-card"]')
    
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.locator('button:has-text("addToCart")').click()
    
    await page.click('a[href="/cart"]')
    await expect(page).toHaveURL("/cart")
    
    await page.click('button:has-text("Checkout")')
    await expect(page).toHaveURL("/checkout")
    
    await expect(page.locator('form')).toBeVisible()
  })

  test("mobile responsive navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const mobileMenuButton = page.locator('button:has([data-lucide="menu"])')
    await expect(mobileMenuButton).toBeVisible()
    
    await mobileMenuButton.click()
    await expect(page.locator('[role="menu"]')).toBeVisible()
  })

  test("admin login and dashboard", async ({ page }) => {
    await page.click('text=Login')
    await page.fill('input[type="email"]', "admin@ecommerce.com")
    await page.fill('input[type="password"]', "admin123")
    await page.click('button:has-text("Login")')
    
    await expect(page).toHaveURL("/")
    
    await page.click('button:has([data-lucide="user"])')
    await page.click('text=adminPanel')
    await expect(page).toHaveURL("/admin")
    
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
  })

  test("product filtering and sorting", async ({ page }) => {
    await page.click('text=Products')
    
    const sortSelect = page.locator('select')
    await sortSelect.selectOption("price-asc")
    await page.waitForTimeout(500)
    
    const categoryFilter = page.locator('button:has-text("Filters")')
    await categoryFilter.click()
    
    await page.selectOption('select:has-text("All categories")', "electronics")
    await page.click('button:has-text("Clear Filters")')
  })

  test("error handling and validation", async ({ page }) => {
    await page.click('text=Login')
    
    await page.click('button:has-text("Login")')
    await expect(page.locator('text=Required')).toBeVisible()
    
    await page.fill('input[type="email"]', "invalid-email")
    await page.click('button:has-text("Login")')
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })

  test("accessibility compliance", async ({ page }) => {
    const accessibilityScanResults = await page.accessibility.snapshot()
    
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('[role="navigation"]')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
  })
})