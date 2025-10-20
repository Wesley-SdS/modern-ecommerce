import type { AccountRepository } from "../repositories/account.repository"
import type { AccountEntryType } from "@prisma/client"

export class FinanceService {
  constructor(private accountRepo: AccountRepository) {}

  async createEntry(data: {
    type: AccountEntryType
    amountCents: number
    dueDate: Date
    description: string
    relatedOrderId?: string
  }) {
    return this.accountRepo.create(data)
  }

  async listEntries(params: {
    page?: number
    limit?: number
    type?: AccountEntryType
    status?: string
  }) {
    const { page = 1, limit = 20, type, status } = params
    const skip = (page - 1) * limit

    const where: any = {}
    if (type) where.type = type
    if (status) where.status = status

    const { entries, total } = await this.accountRepo.findAll({
      skip,
      take: limit,
      where,
    })

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async markAsPaid(id: string) {
    return this.accountRepo.markAsPaid(id, new Date())
  }

  async getCashFlow(startDate: Date, endDate: Date) {
    return this.accountRepo.getCashFlow(startDate, endDate)
  }

  async deleteEntry(id: string) {
    return this.accountRepo.delete(id)
  }
}
