"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SERVICES } from "@/lib/site";
import { cn, formatUSD } from "@/lib/utils";

const IMAGE_MAP: Record<string, string> = {
  "icon-rocklear": "/media/studio.webp",
  "xpel-ppf": "/media/red.webp",
  "opti-coat": "/media/porsche.webp",
  "dry-ice": "/media/engine.webp",
  "paint-correction": "/media/detail.webp",
  "window-tint": "/media/night.webp"
};

const IMAGE_ALT: Record<string, string> = {
  "icon-rocklear": "Silver performance coupe with a freshly coated finish",
  "xpel-ppf": "Red exotic sports car prepared for paint protection film",
  "opti-coat": "Black Porsche under studio lighting after ceramic coating",
  "dry-ice": "Technician working on an engine bay during a mechanical detail",
  "paint-correction": "Detailer pressure-washing a black coupe before correction",
  "window-tint": "Performance car at night with deep ceramic window tint"
};

export function ServicesPreview() {
  const [active, setActive] = useState(0);
  const services = SERVICES.slice(0, 6);

  return (
    <section className="section relative overflow-hidden border-t border-line bg-carbon">
      <div className="shell relative">
        <SectionHeading
          index="06 / 07"
          eyebrow="Disciplines"
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
                level — and we decline the work we cannot.
              </p>
              <p className="mt-4">
                Each discipline has its own bay, its own tooling and its own protocol. Select a
                service to inspect the details.
              </p>
            </>
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden border border-line clip-notch">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={services[active].slug}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={IMAGE_MAP[services[active].slug]}
                      alt={IMAGE_ALT[services[active].slug]}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
                    {services[active].index} / {services[active].category}
                  </p>
                  <p className="mt-2 text-lg font-light leading-snug text-porcelain">
                    {services[active].tagline}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                      From {formatUSD(services[active].fromPrice)}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                      {services[active].duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                <span>Fig. 0{active + 1} — {services[active].shortName}</span>
                <span>Royal Oak</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-line">
              {services.map((service, index) => {
                const isActive = index === active;
                return (
                  <Reveal key={service.slug} delay={index * 0.05}>
                    <Link
                      href={`/services#${service.slug}`}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={cn(
                        "group relative flex items-start gap-4 border-b border-line py-6 transition-colors md:gap-6 md:py-7",
                        isActive ? "text-porcelain" : "text-porcelain/70 hover:text-porcelain"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1 font-mono text-[9px] tracking-[0.22em] transition-colors",
                          isActive ? "text-gold" : "text-ash-dim"
                        )}
                      >
                        {service.index}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h3
                            className={cn(
                              "display text-[clamp(1.5rem,3.2vw,2.6rem)] leading-[0.95] transition-colors duration-300",
                              isActive ? "text-gold" : "text-porcelain"
                            )}
                          >
                            {service.shortName}
                          </h3>
                          <ArrowUpRight
                            className={cn(
                              "mt-1 h-4 w-4 shrink-0 transition-all duration-500",
                              isActive
                                ? "-translate-y-1 translate-x-1 text-gold"
                                : "text-ash-dim group-hover:text-gold"
                            )}
                            strokeWidth={1.2}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                            {service.category}
                          </span>
                          <span className="h-1 w-1 bg-gold/40" />
                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                            {service.duration}
                          </span>
                          <span className="h-1 w-1 bg-gold/40" />
                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold/80">
                            From {formatUSD(service.fromPrice)}
                          </span>
                        </div>
                        <p className="mt-2 max-w-xl text-[12px] font-light leading-relaxed text-ash line-clamp-2">
                          {service.summary}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "absolute bottom-0 left-0 h-px bg-gold transition-all duration-700",
                          isActive ? "w-full" : "w-0"
                        )}
                      />
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[11px] font-light leading-relaxed text-ash-dim">
                Not sure which discipline your paint needs? A 20-minute inspection at either studio
                ends with a written recommendation, not a sales pitch.
              </p>
              <Link
                href="/services"
                className="link-line shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-gold"
              >
                All service details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
