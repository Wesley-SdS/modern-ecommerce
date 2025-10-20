import type { OrderRepository } from "../repositories/order.repository"
import type { ProductRepository } from "../repositories/product.repository"
import type { InventoryRepository } from "../repositories/inventory.repository"
import type { AccountRepository } from "../repositories/account.repository"
import { stripe } from "@/lib/stripe"

interface CheckoutItem {
  productId: string
  quantity: number
}

export class CheckoutService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository,
    private inventoryRepo: InventoryRepository,
    private accountRepo: AccountRepository,
  ) {}

  async createCheckoutSession(userId: string, items: CheckoutItem[], successUrl: string, cancelUrl: string) {
    const products = await Promise.all(items.map((item) => this.productRepo.findById(item.productId)))

    const validProducts = products.filter((p) => p !== null)

    if (validProducts.length !== items.length) {
      throw new Error("Some products not found")
    }

    for (const product of validProducts) {
      if (!product) continue
      
      const item = items.find((cartItem) => cartItem.productId === product.id)
      
      if (!item || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}`)
      }
    }

    const lineItems = validProducts.map((product) => {
      const item = items.find((cartItem) => cartItem.productId === product.id)
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: product.title,
            description: product.description,
            images: product.images ? JSON.parse(product.images as string) : [],
          },
          unit_amount: product.priceCents,
        },
        quantity: item?.quantity || 1,
      }
    })

    const totalCents = validProducts.reduce(
      (sum, product) => {
        const item = items.find((cartItem) => cartItem.productId === product.id)
        return sum + product.priceCents * (item?.quantity || 1)
      },
      0,
    )

    const order = await this.orderRepo.create({
      user: { connect: { id: userId } },
      totalCents,
      status: "PENDING",
      items: JSON.stringify(
        validProducts.map((product) => {
          const item = items.find((cartItem) => cartItem.productId === product.id)
          return {
            productId: product.id,
            quantity: item?.quantity || 1,
            priceCents: product.priceCents,
            title: product.title,
          }
        }),
      ),
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id,
        userId,
      },
    })

    await this.orderRepo.update(order.id, {
      paymentIntentId: session.id,
    })

    return { sessionId: session.id, sessionUrl: session.url, orderId: order.id }
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    const order = await this.orderRepo.findByPaymentIntent(paymentIntentId)

    if (!order) {
      throw new Error("Order not found")
    }

    if (order.status === "PAID") {
      return order
    }

    await this.orderRepo.updateStatus(order.id, "PAID")

    const items = JSON.parse(order.items as string)

    for (const item of items) {
      await this.productRepo.updateStock(item.productId, -item.quantity)

      await this.inventoryRepo.createMovement({
        productId: item.productId,
        type: "SALE",
        quantity: -item.quantity,
        note: `Order ${order.id}`,
      })
    }

    await this.accountRepo.create({
      type: "RECEIVABLE",
      amountCents: order.totalCents,
      dueDate: new Date(),
      paidDate: new Date(),
      status: "PAID",
      description: `Payment for order ${order.id}`,
      order: { connect: { id: order.id } },
    })

    return order
  }
}
