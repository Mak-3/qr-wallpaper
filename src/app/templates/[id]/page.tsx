import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { formatPrice, getTemplateById, templates } from "@/lib/templates"
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo"
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

  const title = `${template.name} QR Code Wallpaper`
  const description = `${template.description} Add your UPI QR, a link, or your socials, style it, and download from ${formatPrice(template)}.`
  const path = `/templates/${template.id}`

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url: path,
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${template.name} QR Code Wallpaper`,
    description: template.description,
    image: absoluteUrl(template.preview),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/templates/${template.id}`),
      priceCurrency: "INR",
      price: template.price,
      availability: "https://schema.org/InStock",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Templates", item: absoluteUrl("/#templates") },
      {
        "@type": "ListItem",
        position: 3,
        name: template.name,
        item: absoluteUrl(`/templates/${template.id}`),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <TemplateDetailClient template={template} />
    </>
  )
}
