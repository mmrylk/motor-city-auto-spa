import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQS } from "@/lib/site";

export function FaqSection() {
  return (
    <section className="section relative overflow-hidden border-t border-line bg-carbon">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
      <div className="shell relative">
        <SectionHeading
          index="FAQ / 05"
          eyebrow="Before you book"
          title={
            <>
              The questions
              <br />
              <span className="text-outline">worth asking.</span>
            </>
          }
          description={
            <>
              <p>
                Deposits, cure times, film versus coating, and what happens when Michigan winter
                meets a freshly protected car. If your question is not here, call the studio.
              </p>
              <p className="mt-4">
                We would rather answer it now than have you discover it after the build.
              </p>
            </>
          }
        />

        <div className="mt-10 border-t border-line lg:max-w-4xl">
          {FAQS.map((faq, index) => (
            <details key={faq.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-start gap-4 py-5 md:gap-6 [&::-webkit-details-marker]:hidden">
                <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-gold">
                  0{index + 1}
                </span>
                <span className="flex-1 text-[15px] font-light leading-snug text-porcelain transition-colors group-hover:text-gold md:text-base">
                  {faq.q}
                </span>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-line text-ash transition-colors group-hover:border-gold/50 group-hover:text-gold group-open:border-gold/50 group-open:bg-gold/10 group-open:text-gold">
                  <Plus
                    className="h-3 w-3 transition-transform duration-300 group-open:rotate-45"
                    strokeWidth={1.6}
                  />
                </span>
              </summary>
              <div className="pb-6 pl-9 pr-10 md:pl-11">
                <p className="max-w-2xl text-[13px] font-light leading-relaxed text-ash">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[11px] font-light leading-relaxed text-ash-dim">
            Still uncertain? A 20-minute inspection at either studio ends with a written
            recommendation and a measured paint-depth map — no obligation.
          </p>
          <a
            href="tel:+12482886772"
            className="link-line font-mono text-[9px] uppercase tracking-[0.22em] text-gold"
          >
            Call the studio — (248) 288-6772
          </a>
        </div>
      </div>
    </section>
  );
}
