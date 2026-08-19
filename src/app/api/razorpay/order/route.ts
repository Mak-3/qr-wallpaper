import { NextResponse } from "next/server"
import { getTemplateById } from "@/lib/templates"
import { RazorpayConfigError, getRazorpayClient } from "@/lib/razorpay"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const templateId = body?.templateId

  if (typeof templateId !== "string") {
    return NextResponse.json({ error: "Missing templateId." }, { status: 400 })
  }

  const template = getTemplateById(templateId)
  if (!template) {
    return NextResponse.json({ error: "Unknown template." }, { status: 404 })
  }

  try {
    const razorpay = getRazorpayClient()
    const order = await razorpay.orders.create({
      amount: template.price * 100,
      currency: "INR",
      receipt: `order_${template.id}_${Date.now()}`,
      notes: { templateId: template.id },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    if (error instanceof RazorpayConfigError) {
      return NextResponse.json({ error: error.message }, { status: 503 })
    }
    return NextResponse.json({ error: "Couldn't create a payment order." }, { status: 500 })
  }
}
