import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
};

type LegalLayoutProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalLayout({ eyebrow, title, intro, updated, sections }: LegalLayoutProps) {
  return (
    <section className="relative overflow-hidden bg-carbon pb-20 pt-[calc(var(--header-h)+3rem)] md:pb-28">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-gold/[0.05] blur-[130px]" />

      <div className="shell relative">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-ash"
        >
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <span className="text-ash-dim">/</span>
          <span className="text-porcelain/70">{eyebrow}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-gold" />
                <span className="eyebrow">{eyebrow}</span>
              </div>
              <h1 className="display mt-5 text-[clamp(2.6rem,5.5vw,4.6rem)] text-porcelain">
                {title}
              </h1>
              <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
                Last updated — {updated}
              </p>

              <nav aria-label="On this page" className="mt-8 hidden border-t border-line pt-5 lg:block">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">Contents</p>
                <ul className="mt-3 space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="font-mono text-[8px] uppercase tracking-[0.14em] text-ash-dim transition-colors hover:text-gold"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 border border-line bg-slate-deep/60 p-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
                  Questions
                </p>
                <a
                  href={SITE.phoneHref}
                  className="mt-3 flex items-center gap-2 text-sm font-light text-porcelain transition-colors hover:text-gold"
                >
                  <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                  {SITE.phone}
                </a>
                <a
                  href={SITE.emailHref}
                  className="mt-2 flex items-center gap-2 break-all font-mono text-[8px] uppercase tracking-[0.12em] text-ash transition-colors hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                  {SITE.email}
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <p className="prose-lux max-w-2xl text-pretty">{intro}</p>

            <div className="mt-10 space-y-10">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-line pt-7">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-gold">
                      0{index + 1}
                    </span>
                    <div>
                      <h2 className="text-lg font-light tracking-tight text-porcelain md:text-xl">
                        {section.title}
                      </h2>
                      {section.paragraphs?.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)} className="prose-lux mt-3 text-pretty">
                          {paragraph}
                        </p>
                      ))}
                      {section.list && (
                        <ul className="mt-4 space-y-2">
                          {section.list.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-[13px] font-light leading-relaxed text-ash">
                              <span className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[10px] font-light leading-relaxed text-ash-dim">
                This document is provided for transparency and does not replace the written build
                sheet or warranty terms issued with your vehicle.
              </p>
              <Link
                href="/book"
                className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-gold"
              >
                Reserve a bay
                <ArrowUpRight
                  className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
