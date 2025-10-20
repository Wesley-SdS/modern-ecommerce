import type { NextRequest } from "next/server"
import { CheckoutService } from "@/server/services/checkout.service"
import { OrderRepository } from "@/server/repositories/order.repository"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { AccountRepository } from "@/server/repositories/account.repository"
import { successResponse, errorResponse } from "@/lib/api-response"
import { requireAuth } from "@/lib/auth-utils"
import { z } from "zod"

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
})

const checkoutService = new CheckoutService(
  new OrderRepository(),
  new ProductRepository(),
  new InventoryRepository(),
  new AccountRepository(),
)

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const userId = (user as any).id

    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    const result = await checkoutService.createCheckoutSession(
      userId,
      validatedData.items,
      validatedData.successUrl,
      validatedData.cancelUrl,
    )

    return successResponse(result)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return errorResponse("Validation error", error.errors, 400)
    }
    return errorResponse("Failed to create checkout session", error.message, 500)
  }
}
