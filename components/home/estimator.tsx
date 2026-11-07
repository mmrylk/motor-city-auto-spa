"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ADD_ONS, ESTIMATOR_SERVICES, PRICE_MATRIX, VEHICLE_TYPES, serviceBySlug, type ServiceSlug, type VehicleType } from "@/lib/site";
import { buildQuote } from "@/lib/pricing";
import { cn, formatUSD } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { id: 1, label: "Vehicle" },
  { id: 2, label: "Service" },
  { id: 3, label: "Build" }
];

export function Estimator() {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState<VehicleType>("sedan");
  const [service, setService] = useState<ServiceSlug>("icon-rocklear");
  const [addons, setAddons] = useState<string[]>(["wheel-faces"]);

  const quote = useMemo(() => buildQuote(service, vehicle, addons), [service, vehicle, addons]);
  const selectedService = serviceBySlug(service);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams({ service, vehicle });
    if (addons.length) params.set("addons", addons.join(","));
    return `/book?${params.toString()}`;
  }, [service, vehicle, addons]);

  const toggleAddon = (id: string) => {
    setAddons((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  };

  return (
    <section id="estimator" className="section relative overflow-hidden border-t border-line bg-slate-deep">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-olive/20 blur-[140px]" />
      <div className="shell relative">
        <SectionHeading
          index="05 / 07"
          eyebrow="Build Estimator"
          title={
            <>
              Configure the
              <br />
              <span className="text-outline">protection.</span>
            </>
          }
          description={
            <>
              <p>
                Three decisions. A live number. No vague &ldquo;starting at&rdquo; pricing that
                changes after the car is in the bay.
              </p>
              <p className="mt-4">
                Select your vehicle class and the discipline you need. Your estimate updates as
                you build — and the $100 deposit is credited in full against the final invoice.
              </p>
            </>
          }
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="border border-line bg-carbon/50">
              <div className="flex items-center justify-between border-b border-line px-5 py-4 md:px-7">
                <div className="flex items-center gap-4 md:gap-6">
                  {STEPS.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setStep(entry.id)}
                      className={cn(
                        "group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors",
                        step === entry.id
                          ? "text-gold"
                          : step > entry.id
                            ? "text-porcelain/60 hover:text-porcelain"
                            : "text-ash-dim hover:text-ash"
                      )}
                      aria-current={step === entry.id ? "step" : undefined}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center border text-[8px]",
                          step === entry.id
                            ? "border-gold/60 bg-gold/10 text-gold"
                            : "border-line text-ash-dim"
                        )}
                      >
                        {step > entry.id ? <Check className="h-3 w-3" /> : `0${entry.id}`}
                      </span>
                      <span className="hidden sm:inline">{entry.label}</span>
                    </button>
                  ))}
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                  0{step} / 03
                </span>
              </div>

              <div className="relative min-h-[420px] p-5 md:p-7">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="eyebrow">Step 01 — Vehicle class</p>
                      <h3 className="mt-3 text-2xl font-light tracking-tight text-porcelain">
                        What are we protecting?
                      </h3>
                      <p className="mt-2 max-w-lg text-[13px] font-light leading-relaxed text-ash">
                        Vehicle class sets the panel count, film coverage and time in the bay.
                        Oversized or heavily modified vehicles are quoted after inspection.
                      </p>

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {VEHICLE_TYPES.map((type, index) => {
                          const active = vehicle === type.value;
                          return (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setVehicle(type.value)}
                              className={cn(
                                "group relative flex items-start gap-4 border p-5 text-left transition-all duration-300",
                                active
                                  ? "border-gold/60 bg-gold/[0.06]"
                                  : "border-line bg-carbon/30 hover:border-porcelain/20"
                              )}
                              aria-pressed={active}
                            >
                              <span
                                className={cn(
                                  "font-mono text-[9px] tracking-[0.2em]",
                                  active ? "text-gold" : "text-ash-dim"
                                )}
                              >
                                A{index + 1}
                              </span>
                              <span className="flex-1">
                                <span className="block text-sm font-medium text-porcelain">
                                  {type.label}
                                </span>
                                <span className="mt-1 block text-[11px] font-light text-ash">
                                  {type.note}
                                </span>
                              </span>
                              <span
                                className={cn(
                                  "mt-0.5 flex h-4 w-4 items-center justify-center border",
                                  active ? "border-gold bg-gold text-carbon" : "border-line"
                                )}
                              >
                                {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="eyebrow">Step 02 — Discipline</p>
                      <h3 className="mt-3 text-2xl font-light tracking-tight text-porcelain">
                        Select the primary service.
                      </h3>
                      <p className="mt-2 max-w-lg text-[13px] font-light leading-relaxed text-ash">
                        Prices below reflect the {VEHICLE_TYPES.find((entry) => entry.value === vehicle)?.label.toLowerCase()} class. Coating and film packages include the correction required beneath them.
                      </p>

                      <div className="mt-7 space-y-2">
                        {ESTIMATOR_SERVICES.map((slug) => {
                          const entry = serviceBySlug(slug);
                          const active = service === slug;
                          const price = PRICE_MATRIX[slug]?.[vehicle] ?? entry.fromPrice;
                          return (
                            <button
                              key={slug}
                              type="button"
                              onClick={() => setService(slug)}
                              className={cn(
                                "group flex w-full items-center gap-4 border px-4 py-4 text-left transition-all duration-300 md:px-5",
                                active
                                  ? "border-gold/60 bg-gold/[0.06]"
                                  : "border-line bg-carbon/30 hover:border-porcelain/20"
                              )}
                              aria-pressed={active}
                            >
                              <span
                                className={cn(
                                  "flex h-4 w-4 shrink-0 items-center justify-center border",
                                  active ? "border-gold bg-gold text-carbon" : "border-line"
                                )}
                              >
                                {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-porcelain">
                                  {entry.shortName}
                                </span>
                                <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                                  {entry.category} · {entry.duration}
                                </span>
                              </span>
                              <span className="shrink-0 text-right">
                                <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-ash-dim">
                                  from
                                </span>
                                <span className="block font-display text-lg text-porcelain">
                                  {formatUSD(price)}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="eyebrow">Step 03 — Final detail</p>
                      <h3 className="mt-3 text-2xl font-light tracking-tight text-porcelain">
                        Complete the build.
                      </h3>
                      <p className="mt-2 max-w-lg text-[13px] font-light leading-relaxed text-ash">
                        Optional additions. Every item is installed by the same technician in the
                        same bay — no subcontracted add-ons.
                      </p>

                      <div className="mt-7 grid gap-2 sm:grid-cols-2">
                        {ADD_ONS.map((addon) => {
                          const active = addons.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => toggleAddon(addon.id)}
                              className={cn(
                                "flex items-start gap-3 border p-4 text-left transition-all duration-300",
                                active
                                  ? "border-gold/50 bg-gold/[0.05]"
                                  : "border-line bg-carbon/30 hover:border-porcelain/20"
                              )}
                              aria-pressed={active}
                            >
                              <span
                                className={cn(
                                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border",
                                  active ? "border-gold bg-gold text-carbon" : "border-line text-ash"
                                )}
                              >
                                {active ? (
                                  <Check className="h-3 w-3" strokeWidth={2.5} />
                                ) : (
                                  <Plus className="h-2.5 w-2.5" strokeWidth={1.5} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[13px] font-medium text-porcelain">
                                  {addon.label}
                                </span>
                                <span className="mt-0.5 block text-[10px] font-light text-ash">
                                  {addon.note}
                                </span>
                              </span>
                              <span className="shrink-0 font-mono text-[10px] text-gold">
                                +{formatUSD(addon.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-7 border-t border-line pt-5">
                        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                          What happens next
                        </p>
                        <ol className="mt-3 space-y-2 text-[12px] font-light leading-relaxed text-ash">
                          <li className="flex gap-3">
                            <span className="font-mono text-[9px] text-gold">01</span>
                            Reserve a drop-off slot with a $100 deposit — credited to the final
                            invoice.
                          </li>
                          <li className="flex gap-3">
                            <span className="font-mono text-[9px] text-gold">02</span>
                            We confirm by phone within one business day and issue a written build
                            sheet.
                          </li>
                          <li className="flex gap-3">
                            <span className="font-mono text-[9px] text-gold">03</span>
                            Inspect the car with us at delivery under the same lights we used to
                            build it.
                          </li>
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 md:px-7">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                  disabled={step === 1}
                  className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-porcelain disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Back
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep((current) => Math.min(3, current + 1))}
                    className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-bright"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <Button href={bookingHref} variant="gold" size="sm">
                    Reserve this build
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="glass relative overflow-hidden border-gold/20">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="border-b border-line px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-gold">Live estimate</span>
                    <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                      <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
                      Updating
                    </span>
                  </div>
                </div>

                <div className="px-5 py-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-ash">
                    {VEHICLE_TYPES.find((entry) => entry.value === vehicle)?.label} / {selectedService.category}
                  </p>
                  <h3 className="mt-2 text-xl font-light leading-tight text-porcelain">
                    {selectedService.shortName}
                  </h3>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-display text-4xl text-gold">$</span>
                    <span className="display text-[clamp(3rem,5vw,4.6rem)] leading-none text-porcelain">
                      {formatUSD(quote.total).replace("$", "")}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                    Estimated build total
                  </p>

                  <div className="mt-6 space-y-3 border-t border-line pt-4 text-[12px] font-light">
                    <div className="flex items-center justify-between gap-3 text-ash">
                      <span>Base — {selectedService.shortName}</span>
                      <span className="font-mono text-porcelain">{formatUSD(quote.base)}</span>
                    </div>
                    {quote.addOns.map((addon) => (
                      <div key={addon.id} className="flex items-center justify-between gap-3 text-ash">
                        <span>{addon.label}</span>
                        <span className="font-mono text-porcelain">+{formatUSD(addon.amount)}</span>
                      </div>
                    ))}
                    {quote.addOns.length === 0 && (
                      <div className="flex items-center justify-between gap-3 text-ash-dim">
                        <span>No add-ons selected</span>
                        <span className="font-mono">—</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                        Bay time
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-porcelain">{quote.duration}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                        Deposit
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-gold">
                        {formatUSD(quote.depositCents, { cents: true })}
                      </p>
                    </div>
                  </div>

                  <Button href={bookingHref} variant="gold" size="lg" className="mt-6 w-full">
                    Book &amp; reserve deposit
                  </Button>

                  <p className="mt-3 flex items-start gap-2 text-[10px] font-light leading-relaxed text-ash-dim">
                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.4} />
                    Estimate only. Final build sheet issued after paint-depth inspection. Deposit
                    refundable up to 72 hours before your appointment.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border border-line bg-carbon/40 px-4 py-3">
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                  Need a second opinion?
                </span>
                <Link
                  href="/locations"
                  className="link-line font-mono text-[8px] uppercase tracking-[0.2em] text-gold"
                >
                  Visit a studio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
