import type { NextRequest } from "next/server"
import { ProductService } from "@/server/services/product.service"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { CategoryRepository } from "@/server/repositories/category.repository"
import { successResponse, errorResponse } from "@/lib/api-response"

const productService = new ProductService(new ProductRepository(), new InventoryRepository(), new CategoryRepository())

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || undefined
    const category = searchParams.get("category") || undefined

    const result = await productService.listProducts({
      page,
      limit,
      search,
      category,
    })

    return successResponse(result)
  } catch (error: any) {
    return errorResponse("Failed to fetch products", error.message, 500)
  }
}
