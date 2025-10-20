import { PrismaClient } from "@prisma/client"

export abstract class BaseRepository<T> {
  constructor(protected prisma: PrismaClient) {}

  abstract create(data: Partial<T>): Promise<T>
  abstract findById(id: string): Promise<T | null>
  abstract findMany(params?: any): Promise<{ data: T[]; total: number }>
  abstract update(id: string, data: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<void>
  abstract count(where?: any): Promise<number>

  protected getPaginationParams(params: { page?: number; limit?: number }) {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    return { page, limit, skip }
  }

  protected buildPaginationResponse(data: T[], total: number, page: number, limit: number) {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}