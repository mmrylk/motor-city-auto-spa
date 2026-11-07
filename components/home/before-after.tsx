"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function BeforeAfterSection() {
  const [position, setPosition] = useState(52);

  return (
    <section className="section relative overflow-hidden border-t border-line bg-carbon">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-60" />
      <div className="shell relative">
        <SectionHeading
          index="04 / 07"
          eyebrow="Inspection Light"
          title={
            <>
              Swirl marks are
              <br />
              <span className="text-outline">not normal.</span>
            </>
          }
          description={
            <>
              <p>
                Black paint is unforgiving. Under a focused inspection light it shows every wash
                mitt, every automatic brush, every shortcut. We use it as the benchmark because if
                the correction holds here, it holds everywhere.
              </p>
              <p className="mt-4">
                Drag the divider. The left side is a typical dealer-lot finish. The right side is
                the same panel after a measured two-stage correction.
              </p>
            </>
          }
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="relative select-none overflow-hidden border border-line clip-notch">
            <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
              <Image
                src="/media/paint-before.jpg"
                alt="Black automotive paint with severe swirl marks and holograms under inspection lighting"
                fill
                sizes="(min-width: 1024px) 90vw, 100vw"
                className="object-cover"
                priority={false}
              />
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 0 0 ${position}%)` }}
              >
                <Image
                  src="/media/paint-after.jpg"
                  alt="The same black paint after multi-stage machine correction, showing a mirror gloss finish"
                  fill
                  sizes="(min-width: 1024px) 90vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-carbon/30 via-transparent to-transparent" />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/70 via-transparent to-carbon/30" />

              <div className="absolute left-4 top-4 flex items-center gap-2 border border-white/15 bg-carbon/60 px-3 py-2 backdrop-blur-md md:left-6 md:top-6">
                <span className="h-1.5 w-1.5 bg-[#c46a55]" />
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-porcelain/75">
                  Before — severe swirl
                </span>
              </div>
              <div className="absolute right-4 top-4 flex items-center gap-2 border border-gold/30 bg-carbon/60 px-3 py-2 backdrop-blur-md md:right-6 md:top-6">
                <span className="h-1.5 w-1.5 bg-gold" />
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
                  After — 2-stage correction
                </span>
              </div>

              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-gold/80"
                style={{ left: `${position}%` }}
              >
                <div className="absolute inset-y-0 -left-3 w-6 bg-gold/10 blur-md" />
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-carbon/85 text-gold shadow-[0_0_40px_rgba(229,169,60,0.28)] backdrop-blur-md">
                  <MoveHorizontal className="h-4 w-4" strokeWidth={1.4} />
                </div>
                <span className="absolute left-1/2 top-1/2 mt-8 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.22em] text-gold/80">
                  Drag
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={position}
                onChange={(event) => setPosition(Number(event.target.value))}
                aria-label="Reveal the corrected paint finish"
                className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
              />

              <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-4 md:inset-x-6 md:bottom-6">
                <div className="font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-porcelain/55">
                  Panel 04 — Rear quarter
                  <br />
                  Inspection: 6500K LED bar
                </div>
                <div className="hidden text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.2em] text-porcelain/55 sm:block">
                  Defect removal: 96%
                  <br />
                  Clear coat: measured
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 border-t border-line pt-6 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
              The honest version
            </p>
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-ash">
              Correction removes material. There is no additive fix for swirl marks. We measure
              before we cut, and we will tell you when a panel is too thin to chase perfection.
            </p>
          </div>
          <div className="flex items-end justify-start md:col-span-4 md:justify-center">
            <div className="flex gap-8 font-mono text-[9px] uppercase tracking-[0.2em]">
              <div>
                <p className="text-porcelain">01 — 03</p>
                <p className="mt-1 text-ash-dim">Stages</p>
              </div>
              <div>
                <p className="text-porcelain">96%</p>
                <p className="mt-1 text-ash-dim">Defect removal</p>
              </div>
              <div>
                <p className="text-porcelain">24h</p>
                <p className="mt-1 text-ash-dim">Cure window</p>
              </div>
            </div>
          </div>
          <div className="flex md:col-span-3 md:justify-end">
            <Button href="/services#paint-correction" variant="outline">
              Correction protocol
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
