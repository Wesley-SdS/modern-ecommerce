import { prisma } from "@/lib/prisma"
import type { Prisma, AccountEntry } from "@prisma/client"

export class AccountRepository {
  async create(data: Prisma.AccountEntryCreateInput) {
    return prisma.accountEntry.create({ data })
  }

  async findAll(params?: {
    skip?: number
    take?: number
    where?: Prisma.AccountEntryWhereInput
  }) {
    const { skip, take, where } = params || {}

    const [entries, total] = await Promise.all([
      prisma.accountEntry.findMany({
        skip,
        take,
        where,
        orderBy: { dueDate: "asc" },
      }),
      prisma.accountEntry.count({ where }),
    ])

    return { entries, total }
  }

  async findById(id: string) {
    return prisma.accountEntry.findUnique({ where: { id } })
  }

  async markAsPaid(id: string, paidDate: Date) {
    return prisma.accountEntry.update({
      where: { id },
      data: { status: "PAID", paidDate },
    })
  }

  async update(id: string, data: Prisma.AccountEntryUpdateInput) {
    return prisma.accountEntry.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.accountEntry.delete({ where: { id } })
  }

  async getCashFlow(startDate: Date, endDate: Date) {
    const entries = await prisma.accountEntry.findMany({
      where: {
        dueDate: { gte: startDate, lte: endDate },
      },
    })

    const receivables = entries.filter((e) => e.type === "RECEIVABLE").reduce((sum, e) => sum + e.amountCents, 0)

    const payables = entries.filter((e) => e.type === "PAYABLE").reduce((sum, e) => sum + e.amountCents, 0)

    return { receivables, payables, balance: receivables - payables }
  }
}
