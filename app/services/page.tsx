import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, CreditCard, ScanLine, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Marquee } from "@/components/ui/marquee";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ServiceAccordion } from "@/components/services/service-accordion";
import { FaqSection } from "@/components/services/faq-section";
import { FAQS, SERVICES, SITE, serviceBySlug } from "@/lib/site";
import { formatUSD } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services — Ceramic Coating, PPF, Paint Correction & Dry Ice",
  description:
    "Six disciplines executed at the highest level: Icon Rocklear composite coating, XPEL paint protection film, Opti-Coat Pro ceramic, dry ice underbody blasting, multi-stage paint correction and ceramic window tint. Royal Oak, Michigan.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Motor City Auto Spa",
    description:
      "Paint protection film, composite coating, ceramic coating, dry ice blasting, paint correction and ceramic tint. Two Royal Oak studios.",
    url: "/services",
    images: ["/media/studio.webp"]
  }
};

const DEPOSIT_STEPS = [
  {
    icon: CreditCard,
    title: "Reserve",
    copy: "A $100 card deposit holds the bay and is credited in full against the final invoice. No hidden booking fee."
  },
  {
    icon: ScanLine,
    title: "Inspect",
    copy: "We map paint depth, document defects and issue a written build sheet before the car enters the bay."
  },
  {
    icon: ShieldCheck,
    title: "Build",
    copy: "One technician owns the vehicle from decontamination through cure and the delivery walkthrough."
  }
];

const interior = serviceBySlug("interior-steam");

export default function ServicesPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Motor City Auto Spa Services",
    itemListElement: SERVICES.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: service.summary,
        serviceType: service.category,
        provider: {
          "@type": "AutoDetailing",
          name: SITE.name,
          telephone: SITE.phone,
          address: {
            "@type": "PostalAddress",
            streetAddress: "901 W 11 Mile Rd",
            addressLocality: "Royal Oak",
            addressRegion: "MI",
            postalCode: "48067",
            addressCountry: "US"
          }
        },
        areaServed: "Royal Oak, Michigan",
        offers: {
          "@type": "Offer",
          price: service.fromPrice,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        }
      }
    }))
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a }
    }))
  };

  return (
    <>
      <PageHero
        index="02 / 04"
        eyebrow="Services"
        title={
          <>
            Six disciplines.
            <br />
            <span className="text-outline">One standard.</span>
          </>
        }
        description={
          <>
            <p>
              We do not offer everything. We offer the six services we can execute at the highest
              level — and we decline the work we cannot. Every discipline has its own bay, tooling
              and protocol.
            </p>
            <p className="mt-4">
              Prices below are starting points for standard-condition vehicles. Final build sheets
              are issued after a measured paint-depth inspection.
            </p>
          </>
        }
        image="/media/studio.webp"
        imageAlt="Motor City Auto Spa installation bay with a vehicle under controlled lighting"
        breadcrumb="Services"
        meta={[
          { label: "Established", value: "2011" },
          { label: "Studios", value: "Royal Oak ×2" },
          { label: "Warranty", value: "Up to 10 years" }
        ]}
      />

      <Marquee
        items={[
          "Icon Rocklear Composite",
          "XPEL Paint Protection Film",
          "Opti-Coat Pro Ceramic",
          "Dry Ice Underbody Blasting",
          "Multi-Stage Paint Correction",
          "Ceramic Window Film",
          "Interior Steam Restoration"
        ]}
      />

      <section className="section-tight relative overflow-hidden border-b border-line bg-slate-deep">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
        <div className="shell relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-gold" />
                <span className="eyebrow">The menu, without the theatre</span>
              </div>
              <h2 className="display mt-4 text-display-sm text-balance">
                Choose the work.
                <br />
                <span className="text-outline">We will tell you if it is wrong.</span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="prose-lux text-pretty">
                A coating without correction is a clear coat over defects. Film without a wrapped
                edge is a future lift. The correct service is the one that solves the actual
                condition of your paint — not the most expensive line on the menu.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {SERVICES.slice(0, 6).map((service) => (
                  <Link
                    key={service.slug}
                    href={`#${service.slug}`}
                    className="border border-line px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-ash transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    {service.index} / {service.shortName}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden border-b border-line bg-carbon">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-40" />
        <div className="shell relative">
          <SectionHeading
            index="01 — 06"
            eyebrow="Discipline index"
            title={
              <>
                Inspect the
                <br />
                <span className="text-outline">protocol.</span>
              </>
            }
            description={
              <>
                <p>
                  Open a discipline to read the full method, the technical sheet and exactly what is
                  included. Every installation ends with a documented inspection.
                </p>
                <p className="mt-4">
                  Reserve with a $100 deposit or schedule a drop-off first — both routes end in the
                  same written build plan.
                </p>
              </>
            }
          />

          <div className="mt-10">
            <ServiceAccordion />
          </div>
        </div>
      </section>

      <section className="section-tight relative overflow-hidden border-b border-line bg-slate-deep">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
        <div className="shell relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <Reveal className="lg:col-span-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
                Also in the bay
              </p>
              <h2 className="display mt-4 text-display-sm">
                {interior.shortName}
                <span className="text-gold">.</span>
              </h2>
              <p className="prose-lux mt-4 max-w-md text-pretty">{interior.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button href={`/book?service=${interior.slug}`} variant="gold">
                  Book interior restoration
                </Button>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ash">
                  From {formatUSD(interior.fromPrice)}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7">
              <div className="border border-line bg-carbon/45 p-6 md:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  {interior.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 border-b border-line pb-3">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={2} />
                      <span className="text-[12px] font-light leading-relaxed text-ash">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
                    Dry steam · pH-balanced chemistry · ozone finish
                  </p>
                  <Link
                    href={`/book?service=${interior.slug}`}
                    className="link-line font-mono text-[8px] uppercase tracking-[0.18em] text-gold"
                  >
                    Add to a coating build
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-tight relative overflow-hidden border-b border-line bg-carbon">
        <div className="shell relative">
          <div className="grid gap-6 md:grid-cols-3">
            {DEPOSIT_STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <div className="group h-full border border-line bg-slate-deep/60 p-6 transition-colors hover:border-gold/30">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center border border-line text-gold transition-colors group-hover:border-gold/50 group-hover:bg-gold/5">
                      <step.icon className="h-4 w-4" strokeWidth={1.3} />
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-ash-dim">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-light text-porcelain">{step.title}</h3>
                  <p className="mt-2 text-[12px] font-light leading-relaxed text-ash">{step.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-4 border border-line bg-slate-deep/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-[11px] font-light leading-relaxed text-ash-dim">
              Deposits are refundable up to 72 hours before the appointment and transferable once
              with 48 hours&apos; notice. The balance is due at collection.
            </p>
            <Link
              href="/terms"
              className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-gold"
            >
              Deposit terms
              <ArrowUpRight
                className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([serviceJsonLd, faqJsonLd]) }}
      />
    </>
  );
}
