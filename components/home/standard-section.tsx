import Image from "next/image";
import { ArrowUpRight, Ruler, ScanLine, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const PILLARS = [
  {
    icon: Ruler,
    title: "Measured, not guessed",
    copy: "Paint depth is mapped on every panel before correction. Clear coat is finite — we treat it that way."
  },
  {
    icon: ScanLine,
    title: "One technician, one build",
    copy: "No handoffs. The installer who inspects your car owns it through coating, cure and delivery."
  },
  {
    icon: ShieldCheck,
    title: "Documented at every stage",
    copy: "A photo log, a written build sheet and a sun-gun inspection at handover. Proof, not promises."
  }
];

export function StandardSection() {
  return (
    <section className="section relative overflow-hidden border-t border-line bg-carbon">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              index="01 / 07"
              eyebrow="The Standard"
              title={
                <>
                  Detroit built
                  <br />
                  the car.{" "}
                  <span className="text-outline">We keep it.</span>
                </>
              }
              align="stack"
            />

            <Reveal delay={0.15} className="mt-8 space-y-5">
              <p className="prose-lux text-pretty">
                Motor City Auto Spa exists for owners who can feel the difference between
                &ldquo;clean&rdquo; and <strong>correct</strong>. Factory paint is thin, Michigan
                winters are brutal, and most detailing shops are selling a weekend of gloss with a
                warranty that will never be honoured.
              </p>
              <p className="prose-lux text-pretty">
                We built the opposite. A paint protection laboratory with two Royal Oak studios,
                controlled installation bays and a single standard: the finish has to survive
                inspection under a sun gun, in direct sunlight, five years from now.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {PILLARS.map((pillar, index) => (
                <Reveal key={pillar.title} delay={0.1 + index * 0.08}>
                  <div className="group flex gap-4 border-t border-line pt-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-gold transition-colors group-hover:border-gold/50 group-hover:bg-gold/5">
                      <pillar.icon className="h-4 w-4" strokeWidth={1.3} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium tracking-wide text-porcelain">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-[13px] font-light leading-relaxed text-ash">
                        {pillar.copy}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-9">
              <Button href="/services" variant="outline">
                The full protocol
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="group relative">
              <div className="relative aspect-[4/5] overflow-hidden clip-notch border border-line sm:aspect-[5/6] lg:aspect-[4/5]">
                <Image
                  src="/media/garage.webp"
                  alt="A protected vehicle inside the Motor City Auto Spa installation bay in Royal Oak"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/10 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-carbon/40 to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-2 border border-white/15 bg-carbon/50 px-3 py-2 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-porcelain/75">
                    Bay 01 — Coating
                  </span>
                </div>

                <div className="absolute right-5 top-5 font-mono text-[8px] uppercase leading-relaxed tracking-[0.22em] text-porcelain/45">
                  Royal Oak
                  <br />
                  11 Mile Studio
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <div className="border border-white/10 bg-carbon/65 p-5 backdrop-blur-xl">
                    <p className="font-mono text-[8px] uppercase tracking-[0.26em] text-gold">
                      The non-negotiable
                    </p>
                    <p className="mt-2 text-lg font-light leading-snug text-porcelain">
                      If it would not pass inspection under our own lights, it does not leave the
                      building.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                        Motor City Standard
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                <span>Fig. 01 — Climate-controlled installation</span>
                <span className="hidden sm:block">42.4897° N</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
