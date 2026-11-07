import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CircleParking, Clock3, KeyRound, MapPin } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { StudioSelector } from "@/components/locations/studio-selector";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { LOCATIONS, SERVICES, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Locations — Two Royal Oak Studios",
  description:
    "Visit Motor City Auto Spa at 901 W 11 Mile Rd or 4325 Delemere Blvd in Royal Oak, Michigan. Mon–Fri 8–5, Sat 8:30–3. Call (248) 288-6772 for directions and availability.",
  alternates: { canonical: "/locations" },
  openGraph: {
    title: "Locations — Motor City Auto Spa",
    description:
      "Two Royal Oak studios: 901 W 11 Mile Rd and 4325 Delemere Blvd. Coating, film, correction and underbody restoration.",
    url: "/locations",
    images: ["/media/garage.webp"]
  }
};

const ROUTING: { service: string; studio: string; note: string }[] = [
  { service: "Icon Rocklear", studio: "11 Mile", note: "Two enclosed coating bays + IR cure" },
  { service: "XPEL PPF", studio: "11 Mile", note: "Positive-pressure film clean room" },
  { service: "Opti-Coat Pro", studio: "11 Mile", note: "Correction room + coating bay" },
  { service: "Paint Correction", studio: "11 Mile", note: "Controlled inspection lighting" },
  { service: "Window Tint", studio: "11 Mile", note: "Computer-cut plotter on site" },
  { service: "Dry Ice Blasting", studio: "Delemere", note: "Lift-equipped underbody bay" },
  { service: "Wet Sanding", studio: "Delemere", note: "Long-duration correction studio" },
  { service: "Interior Steam", studio: "Either", note: "Scheduled with your primary build" }
];

const ARRIVAL = [
  {
    icon: CircleParking,
    title: "Client parking",
    copy: "Marked bays at the front of both buildings. Pull in nose-first and leave the keys with you until the walkaround is complete."
  },
  {
    icon: KeyRound,
    title: "Check-in",
    copy: "Glass door, reception to the left. We photograph the car with you, note existing defects and confirm the build sheet before intake."
  },
  {
    icon: Clock3,
    title: "After hours",
    copy: "Drop-off outside studio hours is by appointment only. Vehicles are stored indoors and never left in an unsecured lot."
  }
];

export default function LocationsPage() {
  return (
    <>
      <PageHero
        index="03 / 04"
        eyebrow="Royal Oak, Michigan"
        title={
          <>
            Two studios.
            <br />
            <span className="text-outline">One standard.</span>
          </>
        }
        description={
          <>
            <p>
              A coating and film laboratory on 11 Mile. A heavy-service and underbody facility on
              Delemere. Four miles apart, both indoors, both running the same inspection protocol.
            </p>
            <p className="mt-4">
              Choose the room that matches the work — or book the 11 Mile studio and we will route
              the vehicle internally.
            </p>
          </>
        }
        image="/media/garage.webp"
        imageAlt="Motor City Auto Spa studio interior with a vehicle in an installation bay"
        breadcrumb="Locations"
        meta={[
          { label: "Studios", value: "2 in Royal Oak" },
          { label: "Hours", value: "Mon–Fri 8–5" },
          { label: "Saturday", value: "8:30–3" }
        ]}
      />

      <section className="section-tight relative overflow-hidden border-b border-line bg-slate-deep">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
        <div className="shell relative">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { value: "02", label: "Royal Oak studios", note: "11 Mile & Delemere" },
              { value: "4.1", label: "Miles apart", note: "Internal vehicle routing" },
              { value: "100%", label: "Indoor storage", note: "For the duration of the build" }
            ].map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.07}>
                <div className="border border-line bg-carbon/45 px-5 py-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-ash-dim">
                    0{index + 1}
                  </p>
                  <p className="display mt-4 text-4xl leading-none text-porcelain">{stat.value}</p>
                  <p className="mt-3 text-sm font-light text-porcelain/80">{stat.label}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
                    {stat.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10">
            <StudioSelector />
          </div>
        </div>
      </section>

      <section className="section relative overflow-hidden border-b border-line bg-carbon">
        <div className="pointer-events-none absolute inset-0 bg-radial-fade opacity-40" />
        <div className="shell relative">
          <SectionHeading
            index="Routing / 02"
            eyebrow="Studio routing"
            title={
              <>
                The right room
                <br />
                <span className="text-outline">for the work.</span>
              </>
            }
            description={
              <>
                <p>
                  Not every service belongs in every building. Coating and film need clean,
                  positive-pressure air. Dry ice and wet sanding need lifts, drainage and space.
                </p>
                <p className="mt-4">
                  If your build spans both, the vehicle moves once — internally, with our insurance
                  and our clock.
                </p>
              </>
            }
          />

          <div className="mt-10 overflow-hidden border border-line">
            <div className="hidden grid-cols-12 gap-4 border-b border-line bg-slate-deep px-5 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-ash md:grid">
              <span className="col-span-5">Service</span>
              <span className="col-span-3">Studio</span>
              <span className="col-span-4">Why</span>
            </div>
            {ROUTING.map((row, index) => (
              <div
                key={row.service}
                className="grid gap-2 border-b border-line px-5 py-4 last:border-b-0 md:grid-cols-12 md:items-center md:gap-4"
              >
                <div className="flex items-center gap-3 md:col-span-5">
                  <span className="font-mono text-[8px] tracking-[0.18em] text-ash-dim">
                    0{index + 1}
                  </span>
                  <span className="text-[13px] font-light text-porcelain">{row.service}</span>
                </div>
                <div className="md:col-span-3">
                  <span
                    className={`inline-flex border px-2 py-1 font-mono text-[7px] uppercase tracking-[0.16em] ${
                      row.studio === "Delemere"
                        ? "border-gold/40 text-gold"
                        : "border-line text-porcelain/70"
                    }`}
                  >
                    {row.studio}
                  </span>
                </div>
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-ash md:col-span-4">
                  {row.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-[11px] font-light leading-relaxed text-ash-dim">
              Service combinations are quoted as a single build. You do not pay two intake fees or
              two inspection fees when a vehicle moves between studios.
            </p>
            <Button href="/book" variant="gold">
              Book a build
            </Button>
          </div>
        </div>
      </section>

      <section className="section-tight relative overflow-hidden border-b border-line bg-slate-deep">
        <div className="shell relative">
          <div className="grid gap-6 md:grid-cols-3">
            {ARRIVAL.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.08}>
                <div className="group h-full border border-line bg-carbon/45 p-6 transition-colors hover:border-gold/30">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center border border-line text-gold transition-colors group-hover:border-gold/50 group-hover:bg-gold/5">
                      <item.icon className="h-4 w-4" strokeWidth={1.3} />
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.2em] text-ash-dim">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-light text-porcelain">{item.title}</h3>
                  <p className="mt-2 text-[12px] font-light leading-relaxed text-ash">{item.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {LOCATIONS.map((location) => (
              <div key={location.slug} className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
                    {location.index} / {location.shortName}
                  </p>
                  <a
                    href={location.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[12px] font-light leading-relaxed text-ash transition-colors hover:text-porcelain"
                  >
                    {location.address}, {location.city}, {location.state} {location.postalCode}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border border-line bg-carbon/45 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                Direct line
              </p>
              <p className="mt-2 text-lg font-light text-porcelain">{SITE.phone}</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                {SITE.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href={SITE.phoneHref} variant="gold" icon={false}>
                Call the studio
              </Button>
              <Button href="/book" variant="outline">
                Reserve a bay
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-line bg-carbon">
        <div className="shell relative py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                Planning a winter build?
              </p>
              <h2 className="display mt-3 text-display-xs">
                Salt is patient.
                <br />
                <span className="text-outline">We are faster.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-[12px] font-light leading-relaxed text-ash">
                Dry ice underbody restoration, cavity protection and a coating that survives a
                Michigan February. Book the Delemere studio before the first salting.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/book?service=dry-ice&location=delemere"
                  className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-gold"
                >
                  Book dry ice
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </Link>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                  {SERVICES.length} disciplines · 2 studios
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
