import type { NextRequest } from "next/server"
import { BannerService } from "@/server/services/banner.service"
import { BannerRepository } from "@/server/repositories/banner.repository"
import { updateBannerSchema } from "@/server/validators/banner.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const bannerService = new BannerService(new BannerRepository())

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const validatedData = updateBannerSchema.parse(body)

    const banner = await bannerService.updateBanner(id, validatedData)

    return successResponse(banner)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to update banner", error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    await bannerService.deleteBanner(id)

    return successResponse({ message: "Banner deleted successfully" })
  } catch (error: any) {
    return errorResponse("Failed to delete banner", error.message, 500)
  }
}
