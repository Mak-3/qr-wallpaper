import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
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
            fontSize: 28,
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
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 920,
          }}
        >
          The QR that&apos;s always with you.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "#d4c9b8",
          }}
        >
          UPI Payments · Emergency Info · Social Links
        </div>
      </div>
    ),
    { ...size }
  )
}
