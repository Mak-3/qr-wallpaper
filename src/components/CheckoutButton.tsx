"use client"

import { useState } from "react"
import { formatPrice, type WallpaperTemplate } from "@/lib/templates"
import { drawWallpaper } from "@/lib/wallpaperCanvas"
import { downloadCanvasAsPng } from "@/lib/download"
import type { WallpaperRendererHandle } from "@/components/WallpaperRenderer"

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: unknown) => void) => void
    }
  }
}

type RazorpayHandlerResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type CheckoutButtonProps = {
  template: WallpaperTemplate
  qrImage: HTMLImageElement | null
  backgroundImage?: HTMLImageElement | null
  rendererRef: React.RefObject<WallpaperRendererHandle | null>
  disabled?: boolean
  onUnlocked: () => void
}

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false)
  if (window.Razorpay) return Promise.resolve(true)

  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutButton({
  template,
  qrImage,
  backgroundImage = null,
  rendererRef,
  disabled,
  onUnlocked,
}: CheckoutButtonProps) {
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  async function handleCheckout() {
    setError(null)
    const canvas = rendererRef.current?.getCanvas()
    if (!canvas || !qrImage) {
      setError("Your wallpaper isn't ready yet. Please try again in a moment.")
      return
    }

    setIsProcessing(true)
    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Couldn't load the payment gateway. Check your connection and try again.")
      }

      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        throw new Error(orderData?.error || "Couldn't start checkout.")
      }

      await new Promise<void>((resolve, reject) => {
        const razorpay = new window.Razorpay!({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: "QR Wallpaper",
          description: `${template.name} wallpaper`,
          theme: { color: "#171717" },
          modal: {
            ondismiss: () => resolve(),
          },
          handler: async (response: unknown) => {
            try {
              const payment = response as RazorpayHandlerResponse
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: payment.razorpay_order_id,
                  paymentId: payment.razorpay_payment_id,
                  signature: payment.razorpay_signature,
                }),
              })
              const verifyData = await verifyRes.json()
              if (!verifyRes.ok || !verifyData.verified) {
                throw new Error(verifyData?.error || "Payment verification failed.")
              }

              await drawWallpaper(canvas, template, qrImage, { watermark: false, backgroundImage })
              await downloadCanvasAsPng(canvas, `${template.id}-wallpaper.png`)
              onUnlocked()
              resolve()
            } catch (err) {
              reject(err instanceof Error ? err : new Error("Payment verification failed."))
            }
          },
        })
        razorpay.on("payment.failed", () =>
          reject(new Error("Payment failed. Please try again."))
        )
        razorpay.open()
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong during checkout.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || isProcessing}
        className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-medium tracking-wide text-white transition hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500 sm:w-auto"
      >
        {isProcessing ? "Processing…" : `Pay ${formatPrice(template)} & Download`}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
