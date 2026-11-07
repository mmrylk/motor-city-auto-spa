"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShieldCheck } from "lucide-react";
import { DepositModal } from "@/components/services/deposit-modal";
import { SERVICES, type Service } from "@/lib/site";
import { cn, formatUSD } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ServiceAccordion({ services = SERVICES.slice(0, 6) }: { services?: Service[] }) {
  const [openSlug, setOpenSlug] = useState<string>(services[0]?.slug ?? "");
  const [depositService, setDepositService] = useState<Service | null>(null);

  return (
    <>
      <div className="border-t border-line">
        {services.map((service) => {
          const open = openSlug === service.slug;
          return (
            <div key={service.slug} id={service.slug} className="scroll-mt-28 border-b border-line">
              <button
                type="button"
                onClick={() => setOpenSlug(open ? "" : service.slug)}
                aria-expanded={open}
                aria-controls={`service-panel-${service.slug}`}
                className="group flex w-full items-center gap-4 py-6 text-left transition-colors md:gap-7 md:py-7"
              >
                <span
                  className={cn(
                    "font-mono text-[9px] tracking-[0.22em] transition-colors",
                    open ? "text-gold" : "text-ash-dim group-hover:text-gold"
                  )}
                >
                  {service.index}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h2
                      className={cn(
                        "display text-[clamp(1.5rem,3.4vw,2.7rem)] leading-[0.95] transition-colors duration-300",
                        open ? "text-gold" : "text-porcelain group-hover:text-gold/90"
                      )}
                    >
                      {service.shortName}
                    </h2>
                    {service.featured && (
                      <span className="border border-gold/30 px-1.5 py-0.5 font-mono text-[6px] uppercase tracking-[0.18em] text-gold">
                        Flagship
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                    <span>{service.category}</span>
                    <span className="h-1 w-1 bg-gold/40" />
                    <span>{service.duration}</span>
                    <span className="h-1 w-1 bg-gold/40" />
                    <span className="text-porcelain/60">{service.warranty}</span>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">From</p>
                  <p className="mt-0.5 font-display text-lg text-porcelain">
                    {formatUSD(service.fromPrice)}
                  </p>
                </div>

                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center border transition-colors",
                    open
                      ? "border-gold/60 bg-gold/10 text-gold"
                      : "border-line text-ash group-hover:border-gold/40 group-hover:text-gold"
                  )}
                >
                  {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`service-panel-${service.slug}`}
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-8 pb-8 lg:grid-cols-12 lg:gap-10">
                      <div className="lg:col-span-7">
                        <p className="max-w-2xl text-[15px] font-light leading-relaxed text-porcelain/85">
                          {service.tagline}
                        </p>
                        <div className="mt-4 space-y-4">
                          {service.description.map((paragraph) => (
                            <p key={paragraph.slice(0, 40)} className="prose-lux max-w-2xl text-pretty">
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        <div className="mt-6 border-t border-line pt-4">
                          <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                            Included in every installation
                          </p>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {service.includes.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-[12px] font-light text-ash">
                                <Check className="mt-0.5 h-3 w-3 shrink-0 text-gold" strokeWidth={2} />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="lg:col-span-5">
                        <div className="border border-line bg-carbon/45 p-5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-ash">
                              Technical sheet
                            </p>
                            <ShieldCheck className="h-4 w-4 text-gold" strokeWidth={1.3} />
                          </div>
                          <dl className="mt-4 space-y-3">
                            {service.specs.map((spec) => (
                              <div
                                key={spec.label}
                                className="flex items-baseline justify-between gap-4 border-b border-line pb-2 last:border-b-0 last:pb-0"
                              >
                                <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash-dim">
                                  {spec.label}
                                </dt>
                                <dd className="text-right font-mono text-[10px] uppercase tracking-[0.1em] text-porcelain/85">
                                  {spec.value}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          <div className="mt-5 border-t border-line pt-4">
                            <div className="flex items-end justify-between gap-3">
                              <div>
                                <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                                  Build from
                                </p>
                                <p className="mt-1 display text-2xl text-porcelain">
                                  {formatUSD(service.fromPrice)}
                                </p>
                              </div>
                              <p className="text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-gold">
                                $100 deposit
                                <br />
                                <span className="text-ash-dim">credited to invoice</span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setDepositService(service)}
                              className="mt-4 flex w-full items-center justify-center gap-2 bg-gold px-4 py-3.5 font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-carbon transition-colors hover:bg-gold-bright clip-notch-sm"
                            >
                              Reserve with $100 deposit
                            </button>
                            <Link
                              href={`/book?service=${service.slug}`}
                              className="mt-2 flex w-full items-center justify-center border border-line px-4 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-ash transition-colors hover:border-gold/50 hover:text-gold"
                            >
                              Schedule a drop-off first
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <DepositModal
        service={depositService ?? services[0]}
        open={Boolean(depositService)}
        onClose={() => setDepositService(null)}
      />
    </>
  );
}
