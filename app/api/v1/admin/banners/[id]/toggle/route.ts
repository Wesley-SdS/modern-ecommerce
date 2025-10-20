import type { NextRequest } from "next/server"
import { BannerService } from "@/server/services/banner.service"
import { BannerRepository } from "@/server/repositories/banner.repository"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const bannerService = new BannerService(new BannerRepository())

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    const banner = await bannerService.toggleBannerActive(id)

    return successResponse(banner)
  } catch (error: any) {
    return errorResponse("Failed to toggle banner", error.message, 500)
  }
}
