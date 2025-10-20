import type { NextRequest } from "next/server"
import { ProductService } from "@/server/services/product.service"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { CategoryRepository } from "@/server/repositories/category.repository"
import { successResponse, errorResponse } from "@/lib/api-response"

const productService = new ProductService(new ProductRepository(), new InventoryRepository(), new CategoryRepository())

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await productService.getProduct(id)

    if (!product) {
      return errorResponse("Product not found", null, 404)
    }

    return successResponse(product)
  } catch (error: any) {
    return errorResponse("Failed to fetch product", error.message, 500)
  }
}
