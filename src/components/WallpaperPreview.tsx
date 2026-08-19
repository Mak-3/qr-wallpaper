"use client"

import { forwardRef, useState } from "react"
import type { WallpaperTemplate } from "@/lib/templates"
import PhoneFrame from "@/components/PhoneFrame"
import WallpaperRenderer, {
  type WallpaperRendererHandle,
} from "@/components/WallpaperRenderer"

type WallpaperPreviewProps = {
  template: WallpaperTemplate
  qrImage: HTMLImageElement | null
  backgroundImage?: HTMLImageElement | null
  watermark?: boolean
  framed?: boolean
}

const WallpaperPreview = forwardRef<WallpaperRendererHandle, WallpaperPreviewProps>(
  function WallpaperPreview(
    { template, qrImage, backgroundImage = null, watermark = false, framed = true },
    ref
  ) {
    const [renderError, setRenderError] = useState<string | null>(null)

    const canvas = (
      <div className="relative h-full w-full">
        <WallpaperRenderer
          ref={ref}
          template={template}
          qrImage={qrImage}
          backgroundImage={backgroundImage}
          watermark={watermark}
          onRenderError={setRenderError}
        />
        {renderError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/90 p-6 text-center text-sm text-white">
            {renderError}
          </div>
        ) : null}
      </div>
    )

    if (!framed) return canvas

    return <PhoneFrame>{canvas}</PhoneFrame>
  }
)

export default WallpaperPreview
