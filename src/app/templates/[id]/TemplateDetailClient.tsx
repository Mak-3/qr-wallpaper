"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { formatPrice, type WallpaperTemplate } from "@/lib/templates"
import WallpaperPreview from "@/components/WallpaperPreview"
import QRSourceTabs from "@/components/QRSourceTabs"
import BackgroundUploader from "@/components/BackgroundUploader"
import CheckoutButton from "@/components/CheckoutButton"
import type { WallpaperRendererHandle } from "@/components/WallpaperRenderer"

type TemplateDetailClientProps = {
  template: WallpaperTemplate
}

export default function TemplateDetailClient({
  template,
}: TemplateDetailClientProps) {
  const [qrImage, setQrImage] = useState<HTMLImageElement | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const rendererRef = useRef<WallpaperRendererHandle>(null)

  function handleImageReady(image: HTMLImageElement) {
    setQrImage(image)
    setIsUnlocked(false)
  }

  function handleClear() {
    setQrImage(null)
    setIsUnlocked(false)
  }

  function handleBackgroundReady(image: HTMLImageElement) {
    setBackgroundImage(image)
    setIsUnlocked(false)
  }

  function handleBackgroundReset() {
    setBackgroundImage(null)
    setIsUnlocked(false)
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <Link
          href="/#templates"
          className="text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
        >
          ← All templates
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="mx-auto w-full max-w-xs sm:max-w-sm">
            <WallpaperPreview
              ref={rendererRef}
              template={template}
              qrImage={qrImage}
              backgroundImage={backgroundImage}
              watermark={!isUnlocked}
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
                {template.name}
              </h1>
              <span className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium tracking-wide text-white">
                {formatPrice(template)}
              </span>
            </div>
            <p className="mt-4 max-w-md text-neutral-600">{template.description}</p>

            <div className="mt-10">
              <span className="block text-sm font-medium text-neutral-700">Background</span>
              <p className="mt-1 text-sm text-neutral-500">
                Optional — swap in your own photo, or keep this template&apos;s artwork.
              </p>
              <div className="mt-3">
                <BackgroundUploader
                  template={template}
                  hasCustomBackground={backgroundImage !== null}
                  onImageReady={handleBackgroundReady}
                  onReset={handleBackgroundReset}
                />
              </div>
            </div>

            <div className="mt-10">
              <QRSourceTabs
                hasImage={qrImage !== null}
                onImageReady={handleImageReady}
                onClear={handleClear}
              />
            </div>

            <div className="mt-8">
              <CheckoutButton
                template={template}
                qrImage={qrImage}
                backgroundImage={backgroundImage}
                rendererRef={rendererRef}
                disabled={qrImage === null}
                onUnlocked={() => setIsUnlocked(true)}
              />
            </div>

            {qrImage === null ? (
              <p className="mt-5 text-sm text-neutral-500">
                Upload a QR code or enter a link to preview your wallpaper for free — pay only
                when you&apos;re ready to download.
              </p>
            ) : !isUnlocked ? (
              <p className="mt-5 text-sm text-neutral-500">
                Your preview includes a watermark. Pay {formatPrice(template)} to download the
                clean, full-resolution wallpaper.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  )
}
