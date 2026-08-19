import crypto from "crypto"
import Razorpay from "razorpay"

export class RazorpayConfigError extends Error {
  constructor() {
    super("Payments aren't configured yet. Add Razorpay API keys to enable checkout.")
    this.name = "RazorpayConfigError"
  }
}

export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    throw new RazorpayConfigError()
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    throw new RazorpayConfigError()
  }

  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")

  const expectedBuffer = Buffer.from(expected, "utf8")
  const signatureBuffer = Buffer.from(signature, "utf8")
  if (expectedBuffer.length !== signatureBuffer.length) {
    return false
  }
  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
}
