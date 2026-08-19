"use client"

import { useState } from "react"
import QRCodeUploader from "@/components/QRCodeUploader"
import QRLinkForm from "@/components/QRLinkForm"

type QRSource = "upload" | "link"

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
      <div className="inline-flex rounded-full border border-neutral-900/10 bg-white/60 p-1 text-sm">
        <button
          type="button"
          onClick={() => selectSource("upload")}
          className={`rounded-full px-4 py-2 font-medium transition ${
            source === "upload" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
          }`}
        >
          Upload a QR image
        </button>
        <button
          type="button"
          onClick={() => selectSource("link")}
          className={`rounded-full px-4 py-2 font-medium transition ${
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
          <QRLinkForm onImageReady={onImageReady} />
        )}
      </div>
    </div>
  )
}
