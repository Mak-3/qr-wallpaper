"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import type { WallpaperTemplate } from "@/lib/templates"
import { drawWallpaper } from "@/lib/wallpaperCanvas"

type WallpaperRendererProps = {
  template: WallpaperTemplate
  qrImage: HTMLImageElement | null
  backgroundImage?: HTMLImageElement | null
  watermark?: boolean
  className?: string
  onRenderError?: (message: string) => void
}

export type WallpaperRendererHandle = {
  getCanvas: () => HTMLCanvasElement | null
}

const WallpaperRenderer = forwardRef<WallpaperRendererHandle, WallpaperRendererProps>(
  function WallpaperRenderer(
    { template, qrImage, backgroundImage = null, watermark = false, className = "", onRenderError },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isReady, setIsReady] = useState(false)

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }))

    useEffect(() => {
      let cancelled = false
      const canvas = canvasRef.current
      if (!canvas) return

      setIsReady(false)
      drawWallpaper(canvas, template, qrImage, { watermark, backgroundImage })
        .then(() => {
          if (!cancelled) setIsReady(true)
        })
        .catch((error: unknown) => {
          if (cancelled) return
          const message =
            error instanceof Error
              ? error.message
              : "Something went wrong while rendering this wallpaper."
          onRenderError?.(message)
        })

      return () => {
        cancelled = true
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, qrImage, watermark, backgroundImage])

    return (
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${template.name} wallpaper preview`}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    )
  }
)

export default WallpaperRenderer
