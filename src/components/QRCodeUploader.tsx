"use client"

import { useId, useRef, useState } from "react"
import { ACCEPTED_TYPES, QRFileError, readQRFile } from "@/lib/qrFile"

type QRCodeUploaderProps = {
  hasUploaded: boolean
  onImageReady: (image: HTMLImageElement, looksLikeQR: boolean) => void
}

export default function QRCodeUploader({
  hasUploaded,
  onImageReady,
}: QRCodeUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputId = useId()

  function openFilePicker() {
    inputRef.current?.click()
  }

  async function handleFiles(files: FileList | null) {
    const file = files?.[0]
    if (!file) return

    setError(null)
    setWarning(null)
    setIsProcessing(true)

    try {
      const result = await readQRFile(file)
      if (!result.looksLikeQR) {
        setWarning(
          "We couldn't confirm this looks like a scannable QR code. Make sure it's high-contrast (dark modules on a light background) before sharing."
        )
      }
      onImageReady(result.image, result.looksLikeQR)
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
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <button
        type="button"
        onClick={openFilePicker}
        disabled={isProcessing}
        aria-describedby={error ? `${inputId}-error` : warning ? `${inputId}-warning` : undefined}
        className="inline-flex w-full items-center justify-center rounded-full border border-neutral-900 px-8 py-4 text-sm font-medium tracking-wide text-neutral-900 transition hover:bg-neutral-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isProcessing
          ? "Reading your QR…"
          : hasUploaded
            ? "Replace your QR code"
            : "Add your QR Code"}
      </button>

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
