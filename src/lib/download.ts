export async function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"))
  if (!blob) {
    throw new Error("Export failed")
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
