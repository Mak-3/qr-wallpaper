import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

const PATTERN = [
  [true, true, false],
  [false, true, false],
  [true, false, true],
]

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0a09",
          borderRadius: 7,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {PATTERN.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 2 }}>
              {row.map((filled, j) => (
                <div
                  key={j}
                  style={{
                    width: 6,
                    height: 6,
                    background: filled ? "#caa14d" : "transparent",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
