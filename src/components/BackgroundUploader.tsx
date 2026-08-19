"use client"

import { useId, useRef, useState } from "react"
import { QRFileError, readBackgroundFile } from "@/lib/qrFile"
import type { WallpaperTemplate } from "@/lib/templates"

type BackgroundUploaderProps = {
  template: WallpaperTemplate
  hasCustomBackground: boolean
  onImageReady: (image: HTMLImageElement) => void
  onReset: () => void
}

export default function BackgroundUploader({
  template,
  hasCustomBackground,
  onImageReady,
  onReset,
}: BackgroundUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputId = useId()

  function openFilePicker() {
    inputRef.current?.click()
  }

  function handleReset() {
    setError(null)
    setWarning(null)
    onReset()
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return

    setError(null)
    setWarning(null)
    setIsProcessing(true)

    try {
      const result = await readBackgroundFile(file, template.width, template.height)
      if (result.isLowRes) {
        setWarning(
          "This image is smaller than the wallpaper size, so it may look soft once downloaded."
        )
      }
      onImageReady(result.image)
    } catch (err) {
      const message =
        err instanceof QRFileError
          ? err.message
          : "Something went wrong while reading that file. Please try again."
      setError(message)
    } finally {
      setIsProcessing(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isProcessing}
          aria-describedby={error ? `${inputId}-error` : warning ? `${inputId}-warning` : undefined}
          className="inline-flex items-center justify-center rounded-full border border-neutral-900/20 px-6 py-3 text-sm font-medium tracking-wide text-neutral-900 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isProcessing
            ? "Reading your photo…"
            : hasCustomBackground
              ? "Replace background"
              : "Use my own photo"}
        </button>
        {hasCustomBackground ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-sm font-medium text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline"
          >
            Reset to template artwork
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {!error && warning ? (
        <p id={`${inputId}-warning`} role="status" className="mt-3 text-sm text-amber-600">
          {warning}
        </p>
      ) : null}
    </div>
  )
}
