import { prisma } from "@/lib/prisma"
import type { Prisma, OrderStatus } from "@prisma/client"

export class OrderRepository {
  async create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,
      include: { user: true },
    })
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { user: true, accountEntry: true },
    })
  }

  async findByPaymentIntent(paymentIntentId: string) {
    return prisma.order.findUnique({
      where: { paymentIntentId },
      include: { user: true },
    })
  }

  async findAll(params?: {
    skip?: number
    take?: number
    where?: Prisma.OrderWhereInput
  }) {
    const { skip, take, where } = params || {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.order.count({ where }),
    ])

    return { orders, total }
  }

  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    })
  }

  async update(id: string, data: Prisma.OrderUpdateInput) {
    return prisma.order.update({
      where: { id },
      data,
    })
  }
}
