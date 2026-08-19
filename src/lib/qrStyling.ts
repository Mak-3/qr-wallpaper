import { loadImage } from "@/lib/wallpaperCanvas"

export type DotStyle =
  | "square"
  | "dots"
  | "rounded"
  | "classy"
  | "classy-rounded"
  | "extra-rounded"

export type CornerSquareStyle = "square" | "dot" | "extra-rounded"
export type CornerDotStyle = "square" | "dot"

export type QRGradient = {
  from: string
  to: string
}

export type QRStyleOptions = {
  dotsColor: string
  dotsGradient?: QRGradient
  backgroundColor: string
  dotsType: DotStyle
  cornersSquareType: CornerSquareStyle
  cornersDotType: CornerDotStyle
  logoDataUrl?: string
}

export type QRPreset = {
  id: string
  name: string
  swatch: string
  style: QRStyleOptions
}

export const QR_PRESETS: QRPreset[] = [
  {
    id: "classic",
    name: "Classic",
    swatch: "#111827",
    style: {
      dotsColor: "#111827",
      backgroundColor: "#ffffff",
      dotsType: "square",
      cornersSquareType: "square",
      cornersDotType: "square",
    },
  },
  {
    id: "rounded-noir",
    name: "Rounded Noir",
    swatch: "#0a0a0a",
    style: {
      dotsColor: "#0a0a0a",
      backgroundColor: "#ffffff",
      dotsType: "extra-rounded",
      cornersSquareType: "extra-rounded",
      cornersDotType: "dot",
    },
  },
  {
    id: "ocean-gradient",
    name: "Ocean Gradient",
    swatch: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
    style: {
      dotsColor: "#0ea5e9",
      dotsGradient: { from: "#0ea5e9", to: "#14b8a6" },
      backgroundColor: "#ffffff",
      dotsType: "dots",
      cornersSquareType: "extra-rounded",
      cornersDotType: "dot",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    swatch: "linear-gradient(135deg, #f97316, #ec4899)",
    style: {
      dotsColor: "#f97316",
      dotsGradient: { from: "#f97316", to: "#ec4899" },
      backgroundColor: "#ffffff",
      dotsType: "classy-rounded",
      cornersSquareType: "extra-rounded",
      cornersDotType: "dot",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    swatch: "#f5f5f5",
    style: {
      dotsColor: "#f5f5f5",
      backgroundColor: "#0a0a0a",
      dotsType: "dots",
      cornersSquareType: "dot",
      cornersDotType: "dot",
    },
  },
  {
    id: "forest",
    name: "Forest",
    swatch: "#166534",
    style: {
      dotsColor: "#166534",
      backgroundColor: "#ffffff",
      dotsType: "extra-rounded",
      cornersSquareType: "extra-rounded",
      cornersDotType: "square",
    },
  },
]

export const DOT_STYLE_OPTIONS: { value: DotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy rounded" },
  { value: "extra-rounded", label: "Extra rounded" },
]

export const CORNER_SQUARE_STYLE_OPTIONS: { value: CornerSquareStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Circle" },
  { value: "extra-rounded", label: "Rounded" },
]

export const CORNER_DOT_STYLE_OPTIONS: { value: CornerDotStyle; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Circle" },
]

function relativeLuminance(hex: string): number {
  const normalized = hex.replace("#", "")
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized

  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255

  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(colorA: string, colorB: string): number {
  const lumA = relativeLuminance(colorA)
  const lumB = relativeLuminance(colorB)
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}

export function hasLowContrast(style: Pick<QRStyleOptions, "dotsColor" | "backgroundColor">): boolean {
  return contrastRatio(style.dotsColor, style.backgroundColor) < 2.5
}

export async function generateStyledQRImage(
  data: string,
  style: QRStyleOptions,
  size = 1000
): Promise<HTMLImageElement> {
  const { default: QRCodeStyling } = await import("qr-code-styling")

  const dotsOptions: Record<string, unknown> = { type: style.dotsType }
  if (style.dotsGradient) {
    dotsOptions.gradient = {
      type: "linear",
      rotation: Math.PI / 4,
      colorStops: [
        { offset: 0, color: style.dotsGradient.from },
        { offset: 1, color: style.dotsGradient.to },
      ],
    }
  } else {
    dotsOptions.color = style.dotsColor
  }

  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    type: "canvas",
    data,
    margin: 8,
    qrOptions: { errorCorrectionLevel: "H" },
    dotsOptions,
    backgroundOptions: { color: style.backgroundColor },
    cornersSquareOptions: { type: style.cornersSquareType, color: style.dotsColor },
    cornersDotOptions: { type: style.cornersDotType, color: style.dotsColor },
    ...(style.logoDataUrl
      ? {
          image: style.logoDataUrl,
          imageOptions: {
            crossOrigin: "anonymous",
            margin: 8,
            imageSize: 0.35,
            hideBackgroundDots: true,
          },
        }
      : {}),
  })

  const raw = await qrCode.getRawData("png")
  if (!raw || !(raw instanceof Blob)) {
    throw new Error("Couldn't generate a QR code from that content.")
  }

  const objectUrl = URL.createObjectURL(raw)
  try {
    return await loadImage(objectUrl)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
