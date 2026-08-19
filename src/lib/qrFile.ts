import jsQR from "jsqr"
import { loadImage } from "@/lib/wallpaperCanvas"

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"]
export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024 // 8MB

export type QRFileResult = {
  image: HTMLImageElement
  looksLikeQR: boolean
}

export type BackgroundFileResult = {
  image: HTMLImageElement
  isLowRes: boolean
}

export class QRFileError extends Error {}

export function validateQRFile(file: File): void {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new QRFileError(
      "That file type isn't supported. Please upload a PNG, JPG, or WEBP image."
    )
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new QRFileError(
      "That image is too large. Please upload a file under 8MB."
    )
  }
}

function looksLikeQRCode(image: HTMLImageElement): boolean {
  try {
    const maxDimension = 700
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.naturalWidth, image.naturalHeight)
    )
    const width = Math.max(1, Math.round(image.naturalWidth * scale))
    const height = Math.max(1, Math.round(image.naturalHeight * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return false

    ctx.drawImage(image, 0, 0, width, height)
    const imageData = ctx.getImageData(0, 0, width, height)
    const code = jsQR(imageData.data, width, height)
    return code !== null
  } catch {
    return false
  }
}

export async function readLogoFile(file: File): Promise<string> {
  validateQRFile(file)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () =>
      reject(new QRFileError("We couldn't read that image. Please try a different file."))
    reader.readAsDataURL(file)
  })
}

export async function readBackgroundFile(
  file: File,
  minWidth = 1080,
  minHeight = 1920
): Promise<BackgroundFileResult> {
  validateQRFile(file)

  const objectUrl = URL.createObjectURL(file)
  try {
    let image: HTMLImageElement
    try {
      image = await loadImage(objectUrl)
    } catch {
      throw new QRFileError(
        "We couldn't read that image. It may be corrupted — try a different file."
      )
    }

    return {
      image,
      isLowRes: image.naturalWidth < minWidth || image.naturalHeight < minHeight,
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function readQRFile(file: File): Promise<QRFileResult> {
  validateQRFile(file)

  const objectUrl = URL.createObjectURL(file)
  try {
    let image: HTMLImageElement
    try {
      image = await loadImage(objectUrl)
    } catch {
      throw new QRFileError(
        "We couldn't read that image. It may be corrupted — try a different file."
      )
    }

    return {
      image,
      looksLikeQR: looksLikeQRCode(image),
    }
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
