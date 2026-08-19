"use client"

import { useEffect, useId, useRef, useState } from "react"
import {
  CORNER_DOT_STYLE_OPTIONS,
  CORNER_SQUARE_STYLE_OPTIONS,
  DOT_STYLE_OPTIONS,
  QR_PRESETS,
  generateStyledQRImage,
  hasLowContrast,
  type QRStyleOptions,
} from "@/lib/qrStyling"
import { QRFileError, readLogoFile } from "@/lib/qrFile"

type QRLinkFormProps = {
  onImageReady: (image: HTMLImageElement) => void
}

const DEFAULT_STYLE: QRStyleOptions = QR_PRESETS[0].style

export default function QRLinkForm({ onImageReady }: QRLinkFormProps) {
  const [content, setContent] = useState("")
  const [style, setStyle] = useState<QRStyleOptions>(DEFAULT_STYLE)
  const [activePresetId, setActivePresetId] = useState<string | null>(QR_PRESETS[0].id)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>(undefined)
  const [logoError, setLogoError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()

  function applyPreset(presetId: string) {
    const preset = QR_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setActivePresetId(presetId)
    setStyle(preset.style)
  }

  function updateStyle(patch: Partial<QRStyleOptions>) {
    setActivePresetId(null)
    setStyle((prev) => ({ ...prev, ...patch }))
  }

  async function handleLogoChange(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    setLogoError(null)
    try {
      const dataUrl = await readLogoFile(file)
      setLogoDataUrl(dataUrl)
    } catch (err) {
      setLogoError(
        err instanceof QRFileError ? err.message : "Couldn't use that image as a logo."
      )
    } finally {
      if (logoInputRef.current) logoInputRef.current.value = ""
    }
  }

  useEffect(() => {
    const trimmed = content.trim()
    if (!trimmed) {
      return
    }

    let cancelled = false

    const timeout = setTimeout(async () => {
      setIsGenerating(true)
      setError(null)
      try {
        const image = await generateStyledQRImage(trimmed, { ...style, logoDataUrl })
        if (cancelled) return
        onImageReady(image)
      } catch (err) {
        if (cancelled) return
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while generating your QR code."
        )
      } finally {
        if (!cancelled) setIsGenerating(false)
      }
    }, 350)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, style, logoDataUrl])

  const lowContrast = hasLowContrast(style)

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="block text-sm font-medium text-neutral-700">
        Link or text to encode
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="url"
        placeholder="https://your-link.com"
        value={content}
        onChange={(event) => {
          const value = event.target.value
          setContent(value)
          if (!value.trim()) setError(null)
        }}
        className="mt-2 w-full rounded-xl border border-neutral-900/15 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
      />

      <div className="mt-5">
        <span className="block text-sm font-medium text-neutral-700">QR style</span>
        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {QR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs transition ${
                activePresetId === preset.id
                  ? "border-neutral-900 bg-neutral-900/5"
                  : "border-neutral-900/10 hover:border-neutral-900/30"
              }`}
            >
              <span
                className="h-6 w-6 rounded-full border border-neutral-900/10"
                style={{ background: preset.swatch }}
              />
              <span className="text-neutral-700">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="mt-4 text-sm font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
      >
        {showAdvanced ? "Hide advanced options" : "Advanced: colors, shapes & logo"}
      </button>

      {showAdvanced ? (
        <div className="mt-4 grid gap-4 rounded-2xl border border-neutral-900/10 bg-white/60 p-4 sm:grid-cols-2">
          <label className="text-xs font-medium text-neutral-600">
            Dot color
            <input
              type="color"
              value={style.dotsColor}
              onChange={(event) =>
                updateStyle({ dotsColor: event.target.value, dotsGradient: undefined })
              }
              className="mt-1.5 h-9 w-full cursor-pointer rounded-lg border border-neutral-900/10"
            />
          </label>

          <label className="text-xs font-medium text-neutral-600">
            Background color
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(event) => updateStyle({ backgroundColor: event.target.value })}
              className="mt-1.5 h-9 w-full cursor-pointer rounded-lg border border-neutral-900/10"
            />
          </label>

          <label className="text-xs font-medium text-neutral-600">
            Dot style
            <select
              value={style.dotsType}
              onChange={(event) =>
                updateStyle({ dotsType: event.target.value as QRStyleOptions["dotsType"] })
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-900/10 bg-white px-2 py-2 text-sm"
            >
              {DOT_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-medium text-neutral-600">
            Corner style
            <select
              value={style.cornersSquareType}
              onChange={(event) =>
                updateStyle({
                  cornersSquareType: event.target.value as QRStyleOptions["cornersSquareType"],
                })
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-900/10 bg-white px-2 py-2 text-sm"
            >
              {CORNER_SQUARE_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-medium text-neutral-600">
            Corner dot style
            <select
              value={style.cornersDotType}
              onChange={(event) =>
                updateStyle({
                  cornersDotType: event.target.value as QRStyleOptions["cornersDotType"],
                })
              }
              className="mt-1.5 w-full rounded-lg border border-neutral-900/10 bg-white px-2 py-2 text-sm"
            >
              {CORNER_DOT_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="text-xs font-medium text-neutral-600">
            Logo (optional)
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => handleLogoChange(event.target.files)}
              className="mt-1.5 block w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
            />
            {logoDataUrl ? (
              <button
                type="button"
                onClick={() => setLogoDataUrl(undefined)}
                className="mt-1.5 text-xs text-neutral-500 underline"
              >
                Remove logo
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {lowContrast ? (
        <p className="mt-3 text-sm text-amber-600">
          This color combination may be hard to scan. Try a higher-contrast pairing.
        </p>
      ) : null}
      {logoError ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {logoError}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {isGenerating ? (
        <p role="status" className="mt-3 text-sm text-neutral-500">
          Generating your QR code…
        </p>
      ) : null}
    </div>
  )
}
