import { ProductService } from "@/server/services/product.service"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { CategoryRepository } from "@/server/repositories/category.repository"

jest.mock("@/server/repositories/product.repository")
jest.mock("@/server/repositories/inventory.repository")
jest.mock("@/server/repositories/category.repository")

describe("ProductService", () => {
  let productService: ProductService
  let mockProductRepo: jest.Mocked<ProductRepository>
  let mockInventoryRepo: jest.Mocked<InventoryRepository>
  let mockCategoryRepo: jest.Mocked<CategoryRepository>

  beforeEach(() => {
    mockProductRepo = new ProductRepository() as jest.Mocked<ProductRepository>
    mockInventoryRepo = new InventoryRepository() as jest.Mocked<InventoryRepository>
    mockCategoryRepo = new CategoryRepository() as jest.Mocked<CategoryRepository>
    productService = new ProductService(mockProductRepo, mockInventoryRepo, mockCategoryRepo)
  })

  describe("listProducts", () => {
    it("should return paginated products", async () => {
      const mockProducts = [
        { id: "1", title: "Product 1", priceCents: 1000 },
        { id: "2", title: "Product 2", priceCents: 2000 },
      ]

      mockProductRepo.findAll.mockResolvedValue({
        products: mockProducts as any,
        total: 2,
      })

      const result = await productService.listProducts({ page: 1, limit: 10 })

      expect(result.data).toEqual(mockProducts)
      expect(result.pagination.total).toBe(2)
      expect(mockProductRepo.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: {},
        orderBy: { createdAt: "desc" },
      })
    })
  })

  describe("createProduct", () => {
    it("should create product and inventory movement", async () => {
      const productData = {
        title: "New Product",
        slug: "new-product",
        description: "Description",
        priceCents: 1000,
        sku: "SKU-001",
        stock: 10,
      }

      const mockProduct = { id: "1", ...productData }
      mockProductRepo.create.mockResolvedValue(mockProduct as any)
      mockInventoryRepo.createMovement.mockResolvedValue({} as any)

      const result = await productService.createProduct(productData)

      expect(result).toEqual(mockProduct)
      expect(mockProductRepo.create).toHaveBeenCalled()
      expect(mockInventoryRepo.createMovement).toHaveBeenCalledWith({
        productId: "1",
        type: "ADD",
        quantity: 10,
        note: "Initial stock",
      })
    })
  })
})
