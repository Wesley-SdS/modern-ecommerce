import type { NextRequest } from "next/server"
import { FinanceService } from "@/server/services/finance.service"
import { AccountRepository } from "@/server/repositories/account.repository"
import { createAccountEntrySchema } from "@/server/validators/finance.validator"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const financeService = new FinanceService(new AccountRepository())

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") || undefined

    const result = await financeService.listEntries({
      page,
      limit,
      type: "PAYABLE",
      status,
    })

    return successResponse(result)
  } catch (error: any) {
    return errorResponse("Failed to fetch accounts payable", error.message, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const validatedData = createAccountEntrySchema.parse({
      ...body,
      type: "PAYABLE",
    })

    const entry = await financeService.createEntry(validatedData)

    return successResponse(entry, 201)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to create account entry", error.message, 500)
  }
}
