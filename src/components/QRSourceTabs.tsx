"use client"

import { useState } from "react"
import QRCodeUploader from "@/components/QRCodeUploader"
import QRGenerateForm from "@/components/QRGenerateForm"

type QRSource = "upload" | "upi" | "link"

type QRSourceTabsProps = {
  hasImage: boolean
  onImageReady: (image: HTMLImageElement) => void
  onClear: () => void
}

export default function QRSourceTabs({ hasImage, onImageReady, onClear }: QRSourceTabsProps) {
  const [source, setSource] = useState<QRSource>("upload")

  function selectSource(next: QRSource) {
    if (next === source) return
    setSource(next)
    onClear()
  }

  return (
    <div className="w-full">
      <div className="inline-flex max-w-full rounded-full border border-neutral-900/10 bg-white/60 p-1 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => selectSource("upload")}
          className={`whitespace-nowrap rounded-full px-3 py-2 font-medium transition sm:px-4 ${
            source === "upload" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Upload a QR image
        </button>
        <button
          type="button"
          onClick={() => selectSource("upi")}
          className={`whitespace-nowrap rounded-full px-3 py-2 font-medium transition sm:px-4 ${
            source === "upi" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Enter UPI ID
        </button>
        <button
          type="button"
          onClick={() => selectSource("link")}
          className={`whitespace-nowrap rounded-full px-3 py-2 font-medium transition sm:px-4 ${
            source === "link" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Enter a link
        </button>
      </div>

      <div className="mt-5">
        {source === "upload" ? (
          <QRCodeUploader
            hasUploaded={hasImage}
            onImageReady={(image) => onImageReady(image)}
          />
        ) : (
          <QRGenerateForm key={source} mode={source} onImageReady={onImageReady} />
        )}
      </div>
    </div>
  )
}
