import type { QRArea, WallpaperTemplate } from "@/lib/templates"

const backgroundCache = new Map<string, Promise<HTMLImageElement>>()

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

function loadBackground(src: string): Promise<HTMLImageElement> {
  let cached = backgroundCache.get(src)
  if (!cached) {
    cached = loadImage(src)
    backgroundCache.set(src, cached)
  }
  return cached
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

function drawFinderRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) {
  ctx.lineWidth = size * 0.24
  ctx.strokeRect(
    x + size * 0.12,
    y + size * 0.12,
    size * 0.76,
    size * 0.76
  )
}

function drawQRPlaceholder(ctx: CanvasRenderingContext2D, qrArea: QRArea) {
  const { x, y, width, height } = qrArea
  const radius = Math.min(width, height) * 0.08

  ctx.save()
  roundedRectPath(ctx, x, y, width, height, radius)
  ctx.fillStyle = "rgba(255, 255, 255, 0.14)"
  ctx.fill()
  ctx.lineWidth = 2.5
  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)"
  ctx.setLineDash([12, 10])
  ctx.stroke()
  ctx.restore()

  const glyphSize = Math.min(width, height) * 0.46
  const cx = x + width / 2
  const cy = y + height / 2 - Math.min(width, height) * 0.04
  const finder = glyphSize * 0.34

  ctx.save()
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)"
  ctx.translate(cx - glyphSize / 2, cy - glyphSize / 2)
  drawFinderRing(ctx, 0, 0, finder)
  drawFinderRing(ctx, glyphSize - finder, 0, finder)
  drawFinderRing(ctx, 0, glyphSize - finder, finder)

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
  const dot = finder * 0.16
  const dotPositions = [
    [0.62, 0.62],
    [0.78, 0.62],
    [0.62, 0.78],
    [0.86, 0.86],
    [0.7, 0.86],
    [0.86, 0.7],
  ]
  for (const [dx, dy] of dotPositions) {
    ctx.fillRect(glyphSize * dx, glyphSize * dy, dot, dot)
  }
  ctx.restore()

  ctx.save()
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
  ctx.font =
    "600 27px system-ui, -apple-system, 'Segoe UI', sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("Your QR code goes here", cx, y + height - 40)
  ctx.restore()
}

function drawQRImage(
  ctx: CanvasRenderingContext2D,
  qrImage: HTMLImageElement,
  qrArea: QRArea
) {
  const { x, y, width, height } = qrArea
  const cardRadius = Math.min(width, height) * 0.08
  const padding = Math.min(width, height) * 0.09

  ctx.save()
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)"
  ctx.shadowBlur = 36
  ctx.shadowOffsetY = 14
  roundedRectPath(ctx, x, y, width, height, cardRadius)
  ctx.fillStyle = "#ffffff"
  ctx.fill()
  ctx.restore()

  const innerX = x + padding
  const innerY = y + padding
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  const scale = Math.min(
    innerWidth / qrImage.naturalWidth,
    innerHeight / qrImage.naturalHeight
  )
  const drawWidth = qrImage.naturalWidth * scale
  const drawHeight = qrImage.naturalHeight * scale
  const drawX = innerX + (innerWidth - drawWidth) / 2
  const drawY = innerY + (innerHeight - drawHeight) / 2

  ctx.save()
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(qrImage, drawX, drawY, drawWidth, drawHeight)
  ctx.restore()
}

function drawPreviewWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save()
  ctx.globalAlpha = 0.16
  ctx.fillStyle = "#ffffff"
  ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
  ctx.lineWidth = 2
  ctx.font = "800 64px system-ui, -apple-system, 'Segoe UI', sans-serif"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  ctx.translate(width / 2, height / 2)
  ctx.rotate(-Math.PI / 5)

  const label = "PREVIEW"
  const stepY = 220
  const rows = Math.ceil(height / stepY) + 3
  for (let i = -rows; i <= rows; i++) {
    ctx.strokeText(label, 0, i * stepY)
    ctx.fillText(label, 0, i * stepY)
  }
  ctx.restore()
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  const drawX = x + (width - drawWidth) / 2
  const drawY = y + (height - drawHeight) / 2
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
}

export type DrawWallpaperOptions = {
  watermark?: boolean
  backgroundImage?: HTMLImageElement | null
}

export async function drawWallpaper(
  canvas: HTMLCanvasElement,
  template: WallpaperTemplate,
  qrImage: HTMLImageElement | null,
  options: DrawWallpaperOptions = {}
) {
  canvas.width = template.width
  canvas.height = template.height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("This browser does not support canvas rendering.")
  }

  const background = options.backgroundImage ?? (await loadBackground(template.background))
  ctx.clearRect(0, 0, template.width, template.height)
  drawImageCover(ctx, background, 0, 0, template.width, template.height)

  if (qrImage) {
    drawQRImage(ctx, qrImage, template.qrArea)
  } else {
    drawQRPlaceholder(ctx, template.qrArea)
  }

  if (options.watermark && qrImage) {
    drawPreviewWatermark(ctx, template.width, template.height)
  }
}
