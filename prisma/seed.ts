import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecommerce.com" },
    update: {},
    create: {
      email: "admin@ecommerce.com",
      name: "Admin User",
      passwordHash: adminPassword,
      role: "SUPER_ADMIN",
    },
  })

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: { name: "Clothing", slug: "clothing" },
    }),
    prisma.category.upsert({
      where: { slug: "home" },
      update: {},
      create: { name: "Home & Garden", slug: "home" },
    }),
  ])

  // Create realistic products
  const products = [
    {
      title: "Premium Wireless Headphones",
      slug: "premium-wireless-headphones",
      description: "Experience crystal-clear audio with active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers and professionals.",
      priceCents: 29990,
      currency: "BRL",
      sku: "PH-001",
      stock: 45,
      categorySlug: "electronics",
      images: ["/premium-wireless-headphones.png"],
    },
    {
      title: "Smart Watch Pro Max",
      slug: "smart-watch-pro",
      description: "Advanced fitness tracking, heart rate monitoring, GPS navigation, and 5-day battery life. Water-resistant design with customizable watch faces.",
      priceCents: 159990,
      currency: "BRL",
      sku: "SW-002",
      stock: 25,
      categorySlug: "electronics",
      images: ["/smart-watch-pro.jpg"],
    },
    {
      title: "Designer Leather Jacket",
      slug: "designer-leather-jacket",
      description: "Genuine leather jacket with modern cut, inner lining, and premium hardware. A timeless piece for any wardrobe.",
      priceCents: 89990,
      currency: "BRL",
      sku: "LJ-003",
      stock: 15,
      categorySlug: "clothing",
      images: ["/designer-leather-jacket.jpg"],
    },
    {
      title: "Minimalist Desk Lamp",
      slug: "minimalist-desk-lamp",
      description: "Sleek LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Perfect for modern workspaces.",
      priceCents: 24990,
      currency: "BRL",
      sku: "DL-004",
      stock: 60,
      categorySlug: "home",
      images: ["/minimalist-desk-lamp.png"],
    },
    {
      title: "Modern Electronics Bundle",
      slug: "modern-electronics",
      description: "Complete tech starter pack including wireless earbuds, portable charger, and cable organizer. Essential for modern digital lifestyle.",
      priceCents: 19990,
      currency: "BRL",
      sku: "EB-005",
      stock: 80,
      categorySlug: "electronics",
      images: ["/modern-electronics.png"],
    },
  ]

  for (const productData of products) {
    const category = categories.find(c => c.slug === productData.categorySlug)
    if (!category) continue

    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        title: productData.title,
        description: productData.description,
        priceCents: productData.priceCents,
        sku: productData.sku,
        stock: productData.stock,
        categoryId: category.id,
        images: JSON.stringify(productData.images),
      },
      create: {
        title: productData.title,
        slug: productData.slug,
        description: productData.description,
        priceCents: productData.priceCents,
        currency: productData.currency,
        sku: productData.sku,
        stock: productData.stock,
        categoryId: category.id,
        images: JSON.stringify(productData.images),
      },
    })
  }

  // Create additional test users
  const customerPassword = await hash("customer123", 12)
  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      name: "John Customer",
      passwordHash: customerPassword,
      role: "CUSTOMER",
    },
  })

  // Create promotional banners
  const banners = [
    {
      id: "summer-sale",
      title: "Summer Collection",
      subtitle: "Up to 50% off selected items",
      imageUrl: "/summer-fashion-collection.png",
      targetUrl: "/products?category=clothing",
      position: 0,
      active: true,
    },
    {
      id: "electronics-deals",
      title: "Tech Deals",
      subtitle: "Latest gadgets at amazing prices",
      imageUrl: "/modern-electronics.png",
      targetUrl: "/products?category=electronics",
      position: 1,
      active: true,
    },
  ]

  for (const bannerData of banners) {
    await prisma.banner.upsert({
      where: { id: bannerData.id },
      update: bannerData,
      create: bannerData,
    })
  }
}

main()
  .catch((e) => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })