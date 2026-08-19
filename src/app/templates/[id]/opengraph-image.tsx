import { ImageResponse } from "next/og"
import { formatPrice, getTemplateById, templates } from "@/lib/templates"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return templates.map((template) => ({ id: template.id }))
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const template = getTemplateById(id)
  const name = template?.name ?? "QR Wallpaper"
  const price = template ? formatPrice(template) : ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #161514 0%, #0b0a09 55%, #040403 100%)",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "#caa14d",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          QR Wallpaper
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 980,
          }}
        >
          {name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginTop: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#0b0a09",
              background: "#caa14d",
              padding: "10px 28px",
              borderRadius: 999,
              fontWeight: 600,
            }}
          >
            {price}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#d4c9b8" }}>
            Your QR, styled and ready
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
