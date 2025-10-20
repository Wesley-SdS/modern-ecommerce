import { z } from "zod"

export const createBannerSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  targetUrl: z.string().url("Invalid target URL").optional(),
  position: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
})

export const updateBannerSchema = createBannerSchema.partial()
