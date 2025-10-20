import type { NextRequest } from "next/server"
import { FinanceService } from "@/server/services/finance.service"
import { AccountRepository } from "@/server/repositories/account.repository"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAdmin } from "@/lib/auth-utils"

const financeService = new FinanceService(new AccountRepository())

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()

    const { id } = await params
    const entry = await financeService.markAsPaid(id)

    return successResponse(entry)
  } catch (error: any) {
    return errorResponse("Failed to mark as paid", error.message, 500)
  }
}
