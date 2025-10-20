import type { NextRequest } from "next/server"
import { ProductService } from "@/server/services/product.service"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { CategoryRepository } from "@/server/repositories/category.repository"
import { adjustStockSchema } from "@/server/validators/product.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const productService = new ProductService(new ProductRepository(), new InventoryRepository(), new CategoryRepository())

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const validatedData = adjustStockSchema.parse(body)

    const product = await productService.adjustStock(id, validatedData.quantity, validatedData.note)

    return successResponse(product)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to adjust stock", error.message, 500)
  }
}
