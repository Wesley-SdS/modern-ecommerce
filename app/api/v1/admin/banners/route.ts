import type { NextRequest } from "next/server"
import { BannerService } from "@/server/services/banner.service"
import { BannerRepository } from "@/server/repositories/banner.repository"
import { createBannerSchema } from "@/server/validators/banner.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const bannerService = new BannerService(new BannerRepository())

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const activeOnly = searchParams.get("active") === "true"

    const banners = await bannerService.listBanners(activeOnly)

    return successResponse(banners)
  } catch (error: any) {
    return errorResponse("Failed to fetch banners", error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createBannerSchema.parse(body)

    const banner = await bannerService.createBanner(validatedData)

    return successResponse(banner, 201)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to create banner", error.message, 500)
  }
}
