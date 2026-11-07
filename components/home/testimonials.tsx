import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { TESTIMONIALS } from "@/lib/site";

function Rating() {
  return (
    <div className="flex items-center gap-1" aria-label="Five out of five">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="h-1 w-1 rotate-45 bg-gold" aria-hidden="true" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section className="section relative overflow-hidden border-t border-line bg-carbon">
      <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-50" />
      <div className="pointer-events-none absolute right-0 top-0 select-none overflow-hidden">
        <span className="display block translate-x-1/4 text-[26vw] leading-none text-white/[0.02]">
          04
        </span>
      </div>

      <div className="shell relative">
        <SectionHeading
          index="08 / 10"
          eyebrow="Owner Log"
          title={
            <>
              The cars
              <br />
              <span className="text-outline">do the talking.</span>
            </>
          }
          description={
            <>
              <p>
                No paid placements, no detailer-of-the-month plaques. Just owners who inspected the
                work under the same lights we did.
              </p>
              <p className="mt-4">
                Three builds, three different disciplines, one standard. Read the vehicle and the
                service — the context matters.
              </p>
            </>
          }
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <figure className="group relative flex h-full flex-col justify-between overflow-hidden border border-line bg-slate-deep p-6 transition-colors duration-500 hover:border-gold/30 md:p-9">
              <div className="pointer-events-none absolute -right-4 -top-6 text-gold/10">
                <Quote className="h-28 w-28" strokeWidth={0.7} />
              </div>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Rating />
                  <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-ash-dim">
                    Log 001
                  </span>
                </div>
                <blockquote className="mt-8 max-w-2xl text-[clamp(1.35rem,2.4vw,2rem)] font-light leading-[1.35] tracking-tight text-porcelain">
                  &ldquo;{featured.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="mt-10 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-porcelain">{featured.name}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                    {featured.vehicle}
                  </p>
                </div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
                  {featured.service}
                </p>
              </figcaption>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
            </figure>
          </Reveal>

          <div className="grid gap-4 lg:col-span-5">
            {rest.map((testimonial, index) => (
              <Reveal key={testimonial.name} delay={0.1 + index * 0.08}>
                <figure className="group relative flex h-full flex-col justify-between overflow-hidden border border-line bg-slate-deep/70 p-6 transition-colors duration-500 hover:border-gold/30">
                  <div className="flex items-center justify-between gap-4">
                    <Rating />
                    <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-ash-dim">
                      Log 00{index + 2}
                    </span>
                  </div>
                  <blockquote className="mt-5 text-[15px] font-light leading-relaxed text-porcelain/85">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <p className="text-[13px] font-medium text-porcelain">{testimonial.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[7px] uppercase tracking-[0.18em] text-ash">
                      <span>{testimonial.vehicle}</span>
                      <span className="h-1 w-1 bg-gold/50" />
                      <span className="text-gold/80">{testimonial.service}</span>
                    </div>
                  </figcaption>
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim sm:flex-row sm:items-center sm:justify-between">
          <span>Verified owner interviews — 2023 to 2025</span>
          <span className="text-porcelain/50">Metro Detroit · Michigan</span>
        </div>
      </div>
    </section>
  );
}
