import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-response"

export async function GET(req: NextRequest) {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { position: "asc" },
    })

    return successResponse(banners)
  } catch (error) {
    return errorResponse("Failed to fetch banners")
  }
}
