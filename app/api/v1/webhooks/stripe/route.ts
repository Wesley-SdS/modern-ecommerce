import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { CheckoutService } from "@/server/services/checkout.service"
import { OrderRepository } from "@/server/repositories/order.repository"
import { ProductRepository } from "@/server/repositories/product.repository"
import { InventoryRepository } from "@/server/repositories/inventory.repository"
import { AccountRepository } from "@/server/repositories/account.repository"
import { NextResponse } from "next/server"

const checkoutService = new CheckoutService(
  new OrderRepository(),
  new ProductRepository(),
  new InventoryRepository(),
  new AccountRepository(),
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        await checkoutService.handlePaymentSuccess(session.id)
        break
      }

      case "payment_intent.succeeded": {
        break
      }

      case "payment_intent.payment_failed": {
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
