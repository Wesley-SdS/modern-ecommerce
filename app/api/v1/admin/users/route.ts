import type { NextRequest } from "next/server"
import { UserService } from "@/server/services/user.service"
import { UserRepository } from "@/server/repositories/user.repository"
import { createUserSchema } from "@/server/validators/user.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const userService = new UserService(new UserRepository())

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const result = await userService.listUsers({ page, limit })

    return successResponse(result)
  } catch (error: any) {
    return errorResponse("Failed to fetch users", error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    const user = await userService.createUser(validatedData)

    return successResponse(user, 201)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to create user", error.message, 500)
  }
}
