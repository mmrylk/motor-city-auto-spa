import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { Button } from "@/components/ui/button";
import { HOURS, LOCATIONS, SERVICES, SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-slate-deep">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-[120px]" />

      <div className="shell relative pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">The next step</p>
            <h2 className="display mt-5 text-display-sm text-balance">
              Bring us the car
              <br />
              <span className="text-outline">you care about.</span>
            </h2>
            <p className="prose-lux mt-6 max-w-md">
              Two Royal Oak studios. One standard. Tell us what you drive and we will build the
              correct protection plan around it — not a menu.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/book" variant="gold">
                Reserve a bay
              </Button>
              <Button href={SITE.phoneHref} variant="outline" icon={false}>
                {SITE.phone}
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Motor City Auto Spa on Instagram"
                className="flex h-10 w-10 items-center justify-center border border-line text-ash transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.4} />
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Motor City Auto Spa on Facebook"
                className="flex h-10 w-10 items-center justify-center border border-line text-ash transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Facebook className="h-4 w-4" strokeWidth={1.4} />
              </a>
              <a
                href={SITE.emailHref}
                aria-label="Email Motor City Auto Spa"
                className="flex h-10 w-10 items-center justify-center border border-line text-ash transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Mail className="h-4 w-4" strokeWidth={1.4} />
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="eyebrow mb-5">Studios</p>
              <ul className="space-y-6">
                {LOCATIONS.map((location) => (
                  <li key={location.slug}>
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold">
                      {location.index} / {location.shortName}
                    </p>
                    <a
                      href={location.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-2 block text-sm font-light leading-relaxed text-porcelain/75 transition-colors hover:text-porcelain"
                    >
                      {location.address}
                      <br />
                      {location.city}, {location.state} {location.postalCode}
                      <ArrowUpRight className="ml-1 inline h-3 w-3 text-ash transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-5">Services</p>
              <ul className="space-y-3">
                {SERVICES.slice(0, 6).map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/services#${service.slug}`}
                      className="text-sm font-light text-porcelain/65 transition-colors hover:text-gold"
                    >
                      {service.shortName}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/services"
                    className="link-line mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.22em] text-gold"
                  >
                    All services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-5">Direct</p>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 text-sm font-light text-porcelain transition-colors hover:text-gold"
              >
                <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="mt-3 flex items-center gap-2 break-all text-sm font-light text-ash transition-colors hover:text-gold"
              >
                <Mail className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                {SITE.email}
              </a>
              <div className="mt-5 flex items-start gap-2 text-sm font-light leading-relaxed text-ash">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={1.4} />
                <span>
                  Royal Oak, Michigan
                  <br />
                  Detroit Metro
                </span>
              </div>

              <div className="mt-6 border-t border-line pt-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ash-dim">
                  Studio hours
                </p>
                <div className="mt-2 space-y-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ash">
                  <p className="flex justify-between gap-4">
                    <span>Mon — Fri</span>
                    <span className="text-porcelain/70">8:00 — 17:00</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>Saturday</span>
                    <span className="text-porcelain/70">8:30 — 15:00</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span>Sunday</span>
                    <span className="text-gold/70">Closed</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line py-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="eyebrow mb-2">Stay sharp</p>
            <p className="max-w-sm text-sm font-light leading-relaxed text-ash">
              Coating care protocol, Michigan winter prep and first access to new film releases.
              Four emails a year. Nothing else.
            </p>
          </div>
          <div className="md:col-span-7 md:flex md:justify-end">
            <NewsletterForm />
          </div>
        </div>

        <div className="relative border-t border-line pt-10">
          <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Motor City Auto Spa</p>
              <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-ash">
                Precision detailing, composite coating and paint protection. Established in Royal
                Oak, Michigan.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[9px] uppercase tracking-[0.22em] text-ash">
              <Link href="/services" className="hover:text-gold">
                Services
              </Link>
              <Link href="/locations" className="hover:text-gold">
                Locations
              </Link>
              <Link href="/book" className="hover:text-gold">
                Booking
              </Link>
              <Link href="/privacy" className="hover:text-gold">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gold">
                Terms
              </Link>
            </div>
          </div>

          <div className="relative select-none overflow-hidden">
            <div className="display whitespace-nowrap text-[clamp(2.4rem,10vw,10.5rem)] leading-[0.8] tracking-[-0.055em] text-outline">
              MOTOR CITY <span className="gold-gradient">AUTO SPA</span>
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-deep to-transparent" />
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[9px] uppercase tracking-[0.18em] text-ash-dim md:flex-row md:items-center md:justify-between">
            <p>
              © {year} {SITE.legalName}. All rights reserved.
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
              Royal Oak · Michigan · USA
            </p>
            <a
              href={SITE.phoneHref}
              className="flex items-center gap-2 text-ash transition-colors hover:text-gold"
            >
              <Phone className="h-3 w-3" strokeWidth={1.5} />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
