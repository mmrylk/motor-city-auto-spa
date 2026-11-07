import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { StatCounter } from "@/components/ui/stat-counter";
import { STATS } from "@/lib/site";

export function MetricsSection() {
  return (
    <section className="section-tight relative overflow-hidden border-y border-line bg-slate-deep">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />
      <div className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[420px] rounded-full bg-gold/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <span className="display select-none whitespace-nowrap text-[18vw] leading-none text-white/[0.022]">
          PROOF
        </span>
      </div>

      <div className="shell relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-gold" />
              <span className="eyebrow">02 / Proof</span>
            </div>
            <h2 className="display mt-4 text-display-sm">
              The record,
              <br />
              <span className="text-outline">not the pitch.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-ash">
            Numbers from the bay floor. Every vehicle logged, every warranty registered, every
            installation documented.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.08}
              className="group relative border-b border-line px-1 py-8 sm:px-5 lg:border-b-0 lg:border-r lg:py-10 lg:last:border-r-0"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] tracking-[0.24em] text-ash-dim">
                  0{index + 1}
                </span>
                <span className="h-1 w-1 bg-gold/40 transition-colors group-hover:bg-gold" />
              </div>
              <div className="mt-8 flex items-baseline">
                <span className="display whitespace-nowrap text-[clamp(1.25rem,4vw,2.25rem)] leading-none text-porcelain transition-colors duration-500 group-hover:text-gold">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="mt-4 text-sm font-light text-porcelain/80">{stat.label}</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                {stat.note}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-5 font-mono text-[8px] uppercase tracking-[0.22em] text-ash-dim md:flex-row md:items-center md:justify-between">
          <span>Shop records — 2011 to present</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="text-porcelain/55">XPEL Certified</span>
            <span className="text-porcelain/55">Icon Rocklear Elite</span>
            <span className="text-porcelain/55">Opti-Coat Pro</span>
            <span className="text-porcelain/55">Fully insured</span>
          </div>
        </div>
      </div>
    </section>
  );
}
