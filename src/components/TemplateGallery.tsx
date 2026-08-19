import type { WallpaperTemplate } from "@/lib/templates"
import TemplateCard from "@/components/TemplateCard"

type TemplateGalleryProps = {
  templates: WallpaperTemplate[]
}

export default function TemplateGallery({ templates }: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
