import Image from "next/image"
import Link from "next/link"
import { formatPrice, type WallpaperTemplate } from "@/lib/templates"

type TemplateCardProps = {
  template: WallpaperTemplate
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      href={`/templates/${template.id}`}
      className="group block rounded-3xl bg-white/60 p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-neutral-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
    >
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={template.preview}
          alt={`${template.name} QR code wallpaper — ${template.tier} lock screen template`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 45vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-neutral-900/85 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur">
          {template.tier === "premium" ? `Premium · ${formatPrice(template)}` : formatPrice(template)}
        </span>
      </div>
      <div className="flex flex-col items-start gap-2.5 px-2 pt-4 pb-2">
        <h3 className="font-serif text-lg text-neutral-900">{template.name}</h3>
        <span className="inline-flex items-center rounded-full border border-neutral-900/15 px-4 py-2 text-xs font-medium tracking-wide text-neutral-900 transition group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
          Try this template
        </span>
      </div>
    </Link>
  )
}
