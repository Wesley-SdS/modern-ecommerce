import type { NextRequest } from "next/server"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const inventoryRepo = new InventoryRepository()

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    const result = await inventoryRepo.findAll({ skip, take: limit })

    return successResponse(result)
  } catch (error: any) {
    return errorResponse("Failed to fetch inventory movements", error.message, 500)
  }
}
