import type { UserRepository } from "../repositories/user.repository"
import type { UserRole } from "@prisma/client"
import { hash } from "bcryptjs"

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async listUsers(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params
    const skip = (page - 1) * limit

    const { users, total } = await this.userRepo.findAll({ skip, take: limit })

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async getUser(id: string) {
    return this.userRepo.findById(id)
  }

  async createUser(data: { name: string; email: string; password: string; role?: UserRole }) {
    const existingUser = await this.userRepo.findByEmail(data.email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    const passwordHash = await hash(data.password, 12)

    return this.userRepo.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role || "CUSTOMER",
    })
  }

  async updateUserRole(id: string, role: UserRole) {
    return this.userRepo.updateRole(id, role)
  }

  async deleteUser(id: string) {
    return this.userRepo.delete(id)
  }
}
