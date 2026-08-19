import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getTemplateById, templates } from "@/lib/templates"
import TemplateDetailClient from "@/app/templates/[id]/TemplateDetailClient"

export function generateStaticParams() {
  return templates.map((template) => ({ id: template.id }))
}

export async function generateMetadata({
  params,
}: PageProps<"/templates/[id]">): Promise<Metadata> {
  const { id } = await params
  const template = getTemplateById(id)
  if (!template) return {}
  return {
    title: `${template.name} — QR Wallpaper`,
    description: template.description,
  }
}

export default async function TemplatePage({
  params,
}: PageProps<"/templates/[id]">) {
  const { id } = await params
  const template = getTemplateById(id)

  if (!template) {
    notFound()
  }

  return <TemplateDetailClient template={template} />
}
