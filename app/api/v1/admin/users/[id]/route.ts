import type { NextRequest } from "next/server"
import { UserService } from "@/server/services/user.service"
import { UserRepository } from "@/server/repositories/user.repository"
import { updateUserRoleSchema } from "@/server/validators/user.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const userService = new UserService(new UserRepository())

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    const body = await request.json()
    const validatedData = updateUserRoleSchema.parse(body)

    const user = await userService.updateUserRole(id, validatedData.role)

    return successResponse(user)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to update user", error.message, 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    await userService.deleteUser(id)

    return successResponse({ message: "User deleted successfully" })
  } catch (error: any) {
    return errorResponse("Failed to delete user", error.message, 500)
  }
}
