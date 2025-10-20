import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8">Your payment was cancelled. You can try again when you&apos;re ready.</p>
      <div className="flex gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/">Continue Shopping</Link>
        </Button>
        <Button asChild>
          <Link href="/checkout">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}
