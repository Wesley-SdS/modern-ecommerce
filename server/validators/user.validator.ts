import { z } from "zod"
import { UserRole } from "@prisma/client"

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole).optional(),
})

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
})
