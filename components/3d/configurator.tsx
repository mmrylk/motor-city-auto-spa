"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, Info, Move3d, RotateCcw, Shield, Sparkles, SunDim } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import {
  COATINGS,
  DEFAULT_SPEC,
  PAINTS,
  PPF_LEVELS,
  SPEC_PRESETS,
  TINTS,
  type CarSpec,
  type CoatingId,
  type PaintId,
  type PpfId,
  type TintId
} from "@/lib/configurator";
import { cn, formatUSD } from "@/lib/utils";

const CarScene = dynamic(
  () => import("@/components/3d/car-scene").then((module) => module.CarScene),
  {
    ssr: false,
    loading: () => <SceneSkeleton />
  }
);

function SceneSkeleton() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center border border-gold/30">
        <span className="absolute inset-0 animate-ping border border-gold/15" />
        <Move3d className="h-5 w-5 text-gold" strokeWidth={1.2} />
      </div>
      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-gold">
        Loading studio asset
      </p>
    </div>
  );
}

function SpecGroup({
  index,
  label,
  children
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line pt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-ash">{label}</p>
        <span className="font-mono text-[8px] tracking-[0.2em] text-ash-dim">{index}</span>
      </div>
      {children}
    </div>
  );
}

export function Configurator() {
  const [spec, setSpec] = useState<CarSpec>(DEFAULT_SPEC);
  const [viewKey, setViewKey] = useState(0);

  const paint = PAINTS.find((entry) => entry.id === spec.paint) ?? PAINTS[0];
  const coating = COATINGS.find((entry) => entry.id === spec.coating) ?? COATINGS[0];
  const ppf = PPF_LEVELS.find((entry) => entry.id === spec.ppf) ?? PPF_LEVELS[0];
  const tint = TINTS.find((entry) => entry.id === spec.tint) ?? TINTS[1];

  const estimate = useMemo(() => {
    const coatingPrice = spec.coating === "rocklear" ? 2495 : spec.coating === "ceramic" ? 1295 : 0;
    const filmPrice = spec.ppf === "full" ? 3295 : spec.ppf === "track" ? 1895 : 0;
    const tintPrice = 349;
    return coatingPrice + filmPrice + tintPrice;
  }, [spec.coating, spec.ppf]);

  const service = spec.coating === "rocklear" ? "icon-rocklear" : spec.coating === "ceramic" ? "opti-coat" : "paint-correction";
  const bookingHref = `/book?service=${service}&vehicle=exotic&addons=tint-upgrade`;

  const setPaint = (paintId: PaintId) => setSpec((current) => ({ ...current, paint: paintId }));
  const setCoating = (coatingId: CoatingId) =>
    setSpec((current) => ({ ...current, coating: coatingId }));
  const setPpf = (ppfId: PpfId) => setSpec((current) => ({ ...current, ppf: ppfId }));
  const setTint = (tintId: TintId) => setSpec((current) => ({ ...current, tint: tintId }));

  return (
    <section
      id="configurator"
      className="section relative overflow-hidden border-t border-line bg-slate-deep"
    >
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-olive/25 blur-[150px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-[130px]" />

      <div className="shell relative">
        <SectionHeading
          index="03 / 07"
          eyebrow="Digital Configurator"
          title={
            <>
              Specify the
              <br />
              <span className="text-outline">protection.</span>
            </>
          }
          description={
            <>
              <p>
                A live material study, not a marketing render. Change the coating, film coverage and
                ceramic tint — the surface responds in real time.
              </p>
              <p className="mt-4">
                Built on a reference 458 Italia. Your own car is measured and quoted in person before
                a single panel is touched.
              </p>
            </>
          }
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-8">
            <div className="relative overflow-hidden border border-line bg-[#08090b]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_38%,rgba(59,65,58,0.24),transparent_62%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#08090b] to-transparent" />

              <div className="relative flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-5">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
                    Live material study
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden font-mono text-[8px] uppercase tracking-[0.2em] text-ash sm:block">
                    Ref. 458 Italia
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewKey((current) => current + 1)}
                    className="group flex items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-ash transition-colors hover:border-gold/50 hover:text-gold"
                    aria-label="Reset 3D camera view"
                  >
                    <RotateCcw
                      className="h-3 w-3 transition-transform duration-500 group-hover:-rotate-180"
                      strokeWidth={1.5}
                    />
                    <span className="hidden sm:inline">Reset view</span>
                  </button>
                </div>
              </div>

              <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
                <CarScene key={viewKey} spec={spec} />

                <div className="pointer-events-none absolute left-4 top-4 hidden flex-col gap-1 font-mono text-[7px] uppercase tracking-[0.2em] text-porcelain/35 sm:flex">
                  <span>CAM 01 / ORBIT</span>
                  <span>6500K — CONTROLLED</span>
                </div>
                <div className="pointer-events-none absolute right-4 top-4 hidden text-right font-mono text-[7px] uppercase leading-relaxed tracking-[0.2em] text-porcelain/35 sm:block">
                  DRAG TO ROTATE
                  <br />
                  ROYAL OAK / MI
                </div>

                <div className="pointer-events-none absolute inset-x-4 bottom-4 grid grid-cols-2 gap-px border border-white/10 bg-carbon/70 backdrop-blur-xl sm:grid-cols-4">
                  {[
                    { label: "Paint", value: paint.label },
                    { label: "Coating", value: coating.label },
                    { label: "Film", value: ppf.label },
                    { label: "Tint", value: `${tint.label} VLT` }
                  ].map((entry) => (
                    <div key={entry.label} className="border-r border-white/10 px-3 py-2.5 last:border-r-0">
                      <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-ash-dim">
                        {entry.label}
                      </p>
                      <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-porcelain">
                        {entry.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 md:px-5">
                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                  <Move3d className="h-3 w-3 text-gold" strokeWidth={1.4} />
                  Drag to inspect · auto-orbit enabled
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                  Model: Ferrari 458 · reference only
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 bg-gold" /> Real-time PBR materials
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 bg-gold" /> 4 paint finishes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 bg-gold" /> 3 film coverage levels
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-4">
            <div className="glass relative overflow-hidden border-gold/15">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              <div className="border-b border-line px-5 py-4">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-gold">Build sheet</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                    MCAS / 458
                  </span>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5">
                <SpecGroup index="01" label="Paint finish">
                  <div className="grid grid-cols-4 gap-2">
                    {PAINTS.map((entry) => {
                      const active = spec.paint === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setPaint(entry.id)}
                          className={cn(
                            "group relative flex aspect-square items-center justify-center border transition-all duration-300",
                            active
                              ? "border-gold/70"
                              : "border-line hover:border-porcelain/25"
                          )}
                          aria-pressed={active}
                          aria-label={entry.label}
                          title={entry.label}
                        >
                          <span
                            className="h-6 w-6 border border-white/10"
                            style={{ backgroundColor: entry.swatch }}
                          />
                          {active && (
                            <Check
                              className="absolute right-1 top-1 h-2.5 w-2.5 text-gold"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-porcelain/60">
                    {paint.label}
                  </p>
                </SpecGroup>

                <SpecGroup index="02" label="Coating system">
                  <div className="space-y-1.5">
                    {COATINGS.map((entry) => {
                      const active = spec.coating === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setCoating(entry.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 border px-3 py-2.5 text-left transition-all duration-300",
                            active
                              ? "border-gold/60 bg-gold/[0.06]"
                              : "border-line hover:border-porcelain/20"
                          )}
                          aria-pressed={active}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "flex h-3.5 w-3.5 items-center justify-center border",
                                active ? "border-gold bg-gold text-carbon" : "border-line"
                              )}
                            >
                              {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                            </span>
                            <span>
                              <span className="block text-[12px] font-medium text-porcelain">
                                {entry.label}
                              </span>
                              <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.16em] text-ash">
                                {entry.note}
                              </span>
                            </span>
                          </span>
                          <Sparkles
                            className={cn(
                              "h-3.5 w-3.5",
                              active ? "text-gold" : "text-ash-dim"
                            )}
                            strokeWidth={1.3}
                          />
                        </button>
                      );
                    })}
                  </div>
                </SpecGroup>

                <SpecGroup index="03" label="Paint protection film">
                  <div className="grid grid-cols-3 gap-1.5">
                    {PPF_LEVELS.map((entry) => {
                      const active = spec.ppf === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setPpf(entry.id)}
                          className={cn(
                            "border px-2 py-2.5 text-left transition-all duration-300",
                            active
                              ? "border-gold/60 bg-gold/[0.06]"
                              : "border-line hover:border-porcelain/20"
                          )}
                          aria-pressed={active}
                        >
                          <span className="flex items-center justify-between gap-1">
                            <Shield
                              className={cn(
                                "h-3 w-3",
                                active ? "text-gold" : "text-ash-dim"
                              )}
                              strokeWidth={1.4}
                            />
                            {active && <span className="h-1 w-1 bg-gold" />}
                          </span>
                          <span className="mt-2 block text-[10px] font-medium leading-tight text-porcelain">
                            {entry.label}
                          </span>
                          <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.1em] text-ash">
                            {entry.panels}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </SpecGroup>

                <SpecGroup index="04" label="Ceramic tint">
                  <div className="grid grid-cols-4 gap-1.5">
                    {TINTS.map((entry) => {
                      const active = spec.tint === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => setTint(entry.id)}
                          className={cn(
                            "border py-2 text-center transition-all duration-300",
                            active
                              ? "border-gold/60 bg-gold/[0.06]"
                              : "border-line hover:border-porcelain/20"
                          )}
                          aria-pressed={active}
                        >
                          <SunDim
                            className={cn(
                              "mx-auto h-3 w-3",
                              active ? "text-gold" : "text-ash-dim"
                            )}
                            strokeWidth={1.4}
                          />
                          <span className="mt-1.5 block font-mono text-[10px] text-porcelain">
                            {entry.label}
                          </span>
                          <span className="block font-mono text-[6px] uppercase tracking-[0.14em] text-ash">
                            VLT
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </SpecGroup>

                <div className="border-t border-line pt-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                        Estimated build
                      </p>
                      <p className="mt-1 display text-3xl leading-none text-porcelain">
                        {formatUSD(estimate)}
                      </p>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-gold">
                      + $100 deposit
                    </span>
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-[10px] font-light leading-relaxed text-ash-dim">
                    <Info className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.4} />
                    Reference estimate for an exotic-class vehicle. Final build sheet after paint
                    depth inspection.
                  </p>
                  <Button href={bookingHref} variant="gold" size="lg" className="mt-4 w-full">
                    Reserve this specification
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {SPEC_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSpec(preset.spec)}
                  className="group border border-line bg-carbon/40 px-2.5 py-2 text-left transition-colors hover:border-gold/40"
                >
                  <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-gold">
                    {preset.label}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-light leading-tight text-ash">
                    {preset.note}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
