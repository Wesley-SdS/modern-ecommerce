import type { NextRequest } from "next/server"
import { ProductService } from "@/server/services/product.service"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { CategoryRepository } from "@/server/repositories/category.repository"
import { updateProductSchema } from "@/server/validators/product.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const productService = new ProductService(new ProductRepository(), new InventoryRepository(), new CategoryRepository())

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const product = await productService.updateProduct(id, validatedData)

    return successResponse(product)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to update product", error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    await productService.deleteProduct(id)

    return successResponse({ message: "Product deleted successfully" })
  } catch (error: any) {
    return errorResponse("Failed to delete product", error.message, 500)
  }
}
