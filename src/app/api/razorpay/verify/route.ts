import { NextResponse } from "next/server"
import { RazorpayConfigError, verifyPaymentSignature } from "@/lib/razorpay"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const orderId = body?.orderId
  const paymentId = body?.paymentId
  const signature = body?.signature

  if (
    typeof orderId !== "string" ||
    typeof paymentId !== "string" ||
    typeof signature !== "string"
  ) {
    return NextResponse.json({ error: "Missing payment details." }, { status: 400 })
  }

  try {
    const verified = verifyPaymentSignature({ orderId, paymentId, signature })
    if (!verified) {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 })
    }
    return NextResponse.json({ verified: true })
  } catch (error) {
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    return NextResponse.json({ error: "Couldn't verify payment." }, { status: 500 })
  }
}
