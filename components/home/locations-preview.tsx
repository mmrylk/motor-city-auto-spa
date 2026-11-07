import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { StudioSelector } from "@/components/locations/studio-selector";
import { LOCATIONS } from "@/lib/site";

export function LocationsPreview() {
  return (
    <section className="section relative overflow-hidden border-t border-line bg-slate-deep">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[460px] w-[460px] rounded-full bg-gold/[0.05] blur-[130px]" />

      <div className="shell relative">
        <SectionHeading
          index="09 / 10"
          eyebrow="Royal Oak"
          title={
            <>
              Two rooms.
              <br />
              <span className="text-outline">One standard.</span>
            </>
          }
          description={
            <>
              <p>
                A coating and film laboratory on 11 Mile. A heavy-service and underbody facility on
                Delemere. Choose the room that matches the work.
              </p>
              <p className="mt-4">
                Both are within four miles of downtown Royal Oak, both are indoors, and both run the
                same inspection protocol.
              </p>
            </>
          }
        />

        <div className="mt-12">
          <StudioSelector compact />
        </div>

        <div className="mt-6 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
          {LOCATIONS.map((location) => (
            <div key={location.slug} className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={1.4} />
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
                  {location.index} / {location.shortName}
                </p>
                <p className="mt-1 text-[12px] font-light leading-relaxed text-ash">
                  {location.address}
                  <br />
                  {location.city}, {location.state} {location.postalCode}
                </p>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={1.4} />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
                Studio hours
              </p>
              <p className="mt-1 text-[12px] font-light leading-relaxed text-ash">
                Mon–Fri 8:00–17:00
                <br />
                Sat 8:30–15:00 · Sun closed
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[11px] font-light leading-relaxed text-ash-dim">
            Not sure which studio handles your service? Book the 11 Mile studio — we will route the
            vehicle internally if the work belongs on Delemere.
          </p>
          <Link
            href="/locations"
            className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold"
          >
            Full studio guide
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.4}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
