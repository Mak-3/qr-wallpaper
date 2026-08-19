export type QRArea = {
  x: number
  y: number
  width: number
  height: number
}

export type WallpaperTier = "standard" | "premium"

export type WallpaperTemplate = {
  id: string
  name: string
  description: string
  preview: string
  background: string
  width: number
  height: number
  qrArea: QRArea
  price: number
  tier: WallpaperTier
}

export const templates: WallpaperTemplate[] = [
  {
    id: "mountain-night",
    name: "Mountain Night",
    description:
      "A quiet night skyline in deep indigo, with layered peaks beneath a glowing moon.",
    preview: "/templates/mountain-night.svg",
    background: "/templates/mountain-night.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 620, width: 520, height: 520 },
    price: 9,
    tier: "standard",
  },
  {
    id: "sunset-lake",
    name: "Sunset Lake",
    description:
      "Warm dusk light melting over still water and distant hills.",
    preview: "/templates/sunset-lake.svg",
    background: "/templates/sunset-lake.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 1180, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "minimal-dark",
    name: "Minimal Dark",
    description:
      "A clean, moody charcoal backdrop for a distraction-free lock screen.",
    preview: "/templates/minimal-dark.svg",
    background: "/templates/minimal-dark.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 700, width: 520, height: 520 },
    price: 9,
    tier: "standard",
  },
  {
    id: "love",
    name: "Love",
    description:
      "Soft blush tones and gentle light, made for sharing something personal.",
    preview: "/templates/love.svg",
    background: "/templates/love.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 700, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "creator",
    name: "Creator",
    description: "Bold gradients and dynamic shapes for creators who stand out.",
    preview: "/templates/creator.svg",
    background: "/templates/creator.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 680, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "minimal-light",
    name: "Minimal Light",
    description:
      "An airy, warm-white canvas with quiet, understated elegance.",
    preview: "/templates/minimal-light.svg",
    background: "/templates/minimal-light.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 700, width: 520, height: 520 },
    price: 9,
    tier: "standard",
  },
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    description:
      "Sharp gold lines cut across a deep charcoal backdrop for a refined, executive look.",
    preview: "/templates/midnight-gold.svg",
    background: "/templates/midnight-gold.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 760, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "aurora-glow",
    name: "Aurora Glow",
    description:
      "A dreamy wash of pink, violet, and aqua light — soft, modern, unmistakably premium.",
    preview: "/templates/aurora-glow.svg",
    background: "/templates/aurora-glow.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 700, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "galaxy-night",
    name: "Galaxy Night",
    description:
      "A starfield drifting through deep-space nebulae, with a shooting star streaking by.",
    preview: "/templates/galaxy-night.svg",
    background: "/templates/galaxy-night.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 760, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "cyber-blue",
    name: "Cyber Blue",
    description:
      "A glowing neon circuit trace over a matte-black grid — sleek and tech-forward.",
    preview: "/templates/cyber-blue.svg",
    background: "/templates/cyber-blue.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 760, width: 520, height: 520 },
    price: 9,
    tier: "standard",
  },
  {
    id: "hexa-black",
    name: "Hexa Black",
    description:
      "Fine gold hexagon outlines scattered across black, with two softly glowing accents.",
    preview: "/templates/hexa-black.svg",
    background: "/templates/hexa-black.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 760, width: 520, height: 520 },
    price: 19,
    tier: "premium",
  },
  {
    id: "sage-green",
    name: "Sage Green",
    description:
      "A calm sage backdrop with a trailing botanical branch — quiet and natural.",
    preview: "/templates/sage-green.svg",
    background: "/templates/sage-green.svg",
    width: 1080,
    height: 1920,
    qrArea: { x: 280, y: 820, width: 520, height: 520 },
    price: 9,
    tier: "standard",
  },
]

export function getTemplateById(id: string): WallpaperTemplate | undefined {
  return templates.find((template) => template.id === id)
}

export function formatPrice(template: Pick<WallpaperTemplate, "price">): string {
  return `₹${template.price}`
}
