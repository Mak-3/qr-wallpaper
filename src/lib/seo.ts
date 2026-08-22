export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://qrwallpaper.in"
).replace(/\/$/, "")

export const SITE_NAME = "QR Wallpaper"

export const SITE_DESCRIPTION =
  "Turn your lock screen into a UPI payment QR, emergency info card, or social profile link. Choose a premium wallpaper template, style your QR, and download from ₹9."

export const SITE_KEYWORDS = [
  "QR code wallpaper",
  "UPI QR wallpaper",
  "payment QR lock screen",
  "custom QR code wallpaper",
  "QR code lock screen India",
  "scannable wallpaper",
  "emergency info QR wallpaper",
  "QR code phone background",
]

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}
