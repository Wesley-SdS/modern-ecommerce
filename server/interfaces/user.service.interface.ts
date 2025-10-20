import type { User, CreateUserInput, UpdateUserInput } from "@/lib/types"

export interface IUserService {
  getUser(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(data: CreateUserInput): Promise<User>
  updateUser(id: string, data: UpdateUserInput): Promise<User>
  deleteUser(id: string): Promise<void>
  listUsers(params: {
    page?: number
    limit?: number
    role?: string
    search?: string
  }): Promise<{
    users: User[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>
  
  updateRole(userId: string, role: User["role"]): Promise<User>
  deactivateUser(userId: string): Promise<User>
  activateUser(userId: string): Promise<User>
}