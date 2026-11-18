import Image from "next/image"
import Link from "next/link"
import { templates } from "@/lib/templates"
import TemplateGallery from "@/components/TemplateGallery"
import PhoneFrame from "@/components/PhoneFrame"

const steps = [
  {
    number: "01",
    title: "Choose a template",
    description: "Browse a curated set of premium lock-screen designs.",
  },
  {
    number: "02",
    title: "Add your QR",
    description:
      "Upload an existing QR code, or enter your UPI ID or a link and style one yourself — colors, shapes, even a logo.",
  },
  {
    number: "03",
    title: "Pay & download",
    description:
      "Preview for free. Pay once, from ₹9, to download the crisp, watermark-free wallpaper.",
  },
]

const faqs = [
  {
    question: "Can I put my UPI QR code on my phone wallpaper?",
    answer:
      "Yes. Enter your UPI ID (or upload your existing UPI QR image), pick a template and QR style, then download — your payment QR becomes your lock screen, ready to scan any time.",
  },
  {
    question: "Will the QR code still scan properly after I download the wallpaper?",
    answer:
      "Yes. QR codes generated in the app use high error correction, and downloads are full resolution, so the code stays scannable even with custom colors, shapes, or a logo.",
  },
  {
    question: "Can I use my own photo as the background instead of a template?",
    answer:
      "Yes. Every template lets you swap in your own photo as the background while keeping the same QR placement — your photo, your QR, one wallpaper.",
  },
  {
    question: "Do I have to pay before I can design my wallpaper?",
    answer:
      "No. Choosing a template, adding your QR, and styling it are all free. You only pay — starting at ₹9 — when you're ready to download the final, watermark-free wallpaper.",
  },
  {
    question: "What can I encode besides a payment QR?",
    answer:
      "Anything a QR code can hold: emergency medical info, a contact card, your Instagram or portfolio link, Wi-Fi credentials, or plain text.",
  },
]

const useCases = [
  {
    title: "Collect payments, instantly",
    description:
      "Put your UPI QR on your lock screen so anyone can scan and pay. No more digging through your gallery for a blurry payment QR screenshot.",
    icon: (
      <>
        <path d="M4 9V6a2 2 0 0 1 2-2h3" />
        <path d="M20 9V6a2 2 0 0 0-2-2h-3" />
        <path d="M4 15v3a2 2 0 0 0 2 2h3" />
        <path d="M20 15v3a2 2 0 0 1-2 2h-3" />
        <rect x="9" y="9" width="2.5" height="2.5" />
        <rect x="13.5" y="9" width="1.5" height="1.5" />
        <rect x="9" y="13" width="1.5" height="1.5" />
        <rect x="13" y="13" width="3" height="3" />
      </>
    ),
  },
  {
    title: "Store emergency info",
    description:
      "Encode your blood group, allergies, or an emergency contact. Anyone can scan your lock screen in seconds — no unlocking required.",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3Z" />
        <path d="M12 9v6M9 12h6" />
      </>
    ),
  },
  {
    title: "Share your socials",
    description:
      "Link your Instagram, portfolio, or contact card. Hand someone your phone and let them scan — no typing, no searching.",
    icon: (
      <>
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="6" r="2.2" />
        <circle cx="18" cy="18" r="2.2" />
        <path d="M8 11l8-4M8 13l8 4" />
      </>
    ),
  },
]

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 sm:px-10">
        <span className="font-serif text-xl tracking-tight text-neutral-900">
          QR Wallpaper
        </span>
        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="#use-cases"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Use cases
          </Link>
          <Link
            href="#templates"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Templates
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            FAQ
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-6 pb-20 sm:px-10 sm:pt-10 sm:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center rounded-full border border-neutral-900/15 px-4 py-1.5 text-xs font-medium tracking-wide text-neutral-600">
              Not just a wallpaper
            </span>
            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.08] tracking-tight text-neutral-900 sm:text-6xl">
              The QR that&apos;s
              <br />
              <span className="italic">always with you.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-neutral-600">
              Collect payments, store emergency info, or share your socials — right from your
              lock screen. No more hunting through screenshots for your payment QR.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="#templates"
                className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-8 py-4 text-sm font-medium tracking-wide text-white transition hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                Explore templates
              </Link>
              <span className="text-sm text-neutral-500">Design free — from ₹9 to download</span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mx-auto max-w-[280px]">
              <PhoneFrame>
                <Image
                  src="/sunset-lake-wallpaper.png"
                  alt="Example wallpaper — Sunset Lake template with a styled UPI payment QR code, made with QR Wallpaper"
                  fill
                  sizes="280px"
                  priority
                  className="object-cover"
                />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="border-y border-neutral-900/5 bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
          <div className="mb-12 max-w-xl">
            <h2 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
              One wallpaper. Endless possibilities.
            </h2>
            <p className="mt-3 text-neutral-600">
              Your lock screen is prime real estate — put it to work instead of just looking at
              it.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {useCases.map((useCase) => (
              <div key={useCase.title}>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    {useCase.icon}
                  </svg>
                </div>
                <h3 className="mt-4 font-serif text-xl text-neutral-900">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <div key={step.number}>
              <span className="font-serif text-sm text-neutral-400">{step.number}</span>
              <h3 className="mt-3 font-serif text-xl text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 max-w-xl">
          <h2 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
            Choose your template
          </h2>
          <p className="mt-3 text-neutral-600">
            Every design comes with a predefined space for your QR code — no editing required.
          </p>
        </div>
        <TemplateGallery templates={templates} />
      </section>

      <section id="faq" className="border-t border-neutral-900/5 bg-white/60">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-10 sm:py-24">
          <h2 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-neutral-900/10">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg text-neutral-900 marker:content-none">
                  {faq.question}
                  <span className="shrink-0 text-neutral-400 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-neutral-400 sm:px-10">
        QR Wallpaper
      </footer>
    </main>
  )
}
