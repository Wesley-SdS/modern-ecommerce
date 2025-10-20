import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class BannerRepository {
  async findAll(activeOnly = false) {
    const where: Prisma.BannerWhereInput = activeOnly ? { active: true } : {}

    return prisma.banner.findMany({
      where,
      orderBy: { position: "asc" },
    })
  }

  async findById(id: string) {
    return prisma.banner.findUnique({ where: { id } })
  }

  async create(data: Prisma.BannerCreateInput) {
    return prisma.banner.create({ data })
  }

  async update(id: string, data: Prisma.BannerUpdateInput) {
    return prisma.banner.update({ where: { id }, data })
  }

  async delete(id: string) {
    return prisma.banner.delete({ where: { id } })
  }

  async toggleActive(id: string) {
    const banner = await this.findById(id)
    if (!banner) throw new Error("Banner not found")

    return prisma.banner.update({
      where: { id },
      data: { active: !banner.active },
    })
  }
}
