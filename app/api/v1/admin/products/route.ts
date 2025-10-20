import type { NextRequest } from "next/server"
import { ProductService } from "@/server/services/product.service"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { CategoryRepository } from "@/server/repositories/category.repository"
import { createProductSchema } from "@/server/validators/product.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const productService = new ProductService(new ProductRepository(), new InventoryRepository(), new CategoryRepository())

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await productService.createProduct(validatedData)

    return successResponse(product, 201)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to create product", error.message, 500)
  }
}
