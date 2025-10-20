import { z } from "zod"
import { AccountEntryType } from "@prisma/client"

export const createAccountEntrySchema = z.object({
  type: z.nativeEnum(AccountEntryType),
  amountCents: z.number().int().positive("Amount must be positive"),
  dueDate: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
  description: z.string().min(1, "Description is required"),
  relatedOrderId: z.string().optional(),
})
