import Image from "next/image";
import { ArrowUpRight, Clock3, Ruler, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { PROCESS } from "@/lib/site";

export function ProcessSection() {
  return (
    <section className="section relative overflow-hidden border-t border-line bg-slate-deep">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full bg-olive/20 blur-[150px]" />

      <div className="shell relative">
        <SectionHeading
          index="07 / 07"
          eyebrow="The Protocol"
          title={
            <>
              Four stages.
              <br />
              <span className="text-outline">No shortcuts.</span>
            </>
          }
          description={
            <>
              <p>
                Every build follows the same sequence, whether it is a daily-driven SUV or a
                concours car. The order is not negotiable — correction before protection, cure
                before delivery.
              </p>
              <p className="mt-4">
                You receive the inspection notes, the build sheet and the photo log at handover. The
                record is part of the work.
              </p>
            </>
          }
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden border border-line clip-notch">
                <Image
                  src="/media/spray.webp"
                  alt="Technician applying a protective coating in the Motor City Auto Spa spray bay"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-carbon/50 to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-2 border border-white/15 bg-carbon/55 px-3 py-2 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-porcelain/75">
                    Bay 02 — Film
                  </span>
                </div>

                <div className="absolute inset-x-5 bottom-5">
                  <div className="border border-white/10 bg-carbon/70 p-5 backdrop-blur-xl">
                    <p className="font-mono text-[8px] uppercase tracking-[0.26em] text-gold">
                      Build record
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <Ruler className="h-3.5 w-3.5 text-gold" strokeWidth={1.3} />
                        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                          Paint depth
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-porcelain">Measured</p>
                      </div>
                      <div>
                        <Clock3 className="h-3.5 w-3.5 text-gold" strokeWidth={1.3} />
                        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                          Cure
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-porcelain">12h IR</p>
                      </div>
                      <div>
                        <ShieldCheck className="h-3.5 w-3.5 text-gold" strokeWidth={1.3} />
                        <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                          Warranty
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-porcelain">Registered</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                <span>Fig. 07 — Film installation</span>
                <span>Delemere Studio</span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div className="border-t border-line">
              {PROCESS.map((step, index) => (
                <Reveal key={step.index} delay={index * 0.07}>
                  <div className="group relative grid grid-cols-[auto_1fr] gap-5 border-b border-line py-7 transition-colors md:gap-8 md:py-9">
                    <div className="flex flex-col items-center">
                      <span className="flex h-10 w-10 items-center justify-center border border-line font-mono text-[10px] tracking-[0.18em] text-gold transition-colors group-hover:border-gold/50 group-hover:bg-gold/5">
                        {step.index}
                      </span>
                      {index < PROCESS.length - 1 && (
                        <span className="mt-3 h-full w-px bg-gradient-to-b from-line to-transparent" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="display text-[clamp(1.9rem,3.8vw,3.2rem)] leading-none text-porcelain transition-colors group-hover:text-gold">
                          {step.title}
                        </h3>
                        <ArrowUpRight
                          className="mt-1 h-4 w-4 shrink-0 text-ash-dim transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
                          strokeWidth={1.2}
                        />
                      </div>
                      <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-ash">
                        {step.copy}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
                        {index === 0 && (
                          <>
                            <span>Paint depth map</span>
                            <span>Defect log</span>
                            <span>Written build sheet</span>
                          </>
                        )}
                        {index === 1 && (
                          <>
                            <span>Decontamination</span>
                            <span>Machine correction</span>
                            <span>IPA wipe</span>
                          </>
                        )}
                        {index === 2 && (
                          <>
                            <span>Coating</span>
                            <span>Film</span>
                            <span>Single technician</span>
                          </>
                        )}
                        {index === 3 && (
                          <>
                            <span>IR cure</span>
                            <span>Sun-gun inspection</span>
                            <span>Delivery walkthrough</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[11px] font-light leading-relaxed text-ash-dim">
                The full protocol is documented on every invoice. If a stage is skipped, the warranty
                is void — ours, not yours.
              </p>
              <Button href="/book" variant="gold">
                Start a build
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
