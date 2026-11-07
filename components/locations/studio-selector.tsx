"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Crosshair,
  MapPin,
  Navigation,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudioMap } from "@/components/locations/studio-map";
import {
  HOURS,
  LOCATIONS,
  SITE,
  locationBySlug,
  type LocationSlug
} from "@/lib/site";
import { cn, haversineMiles } from "@/lib/utils";

function useOpenState() {
  const [state, setState] = useState<"checking" | "open" | "closed">("checking");

  useEffect(() => {
    const now = new Date();
    const dayIndex = (now.getDay() + 6) % 7;
    const today = HOURS[dayIndex];
    if (!today.open || !today.close) {
      setState("closed");
      return;
    }
    const [openHour, openMinute] = today.open.split(":").map(Number);
    const [closeHour, closeMinute] = today.close.split(":").map(Number);
    const minutes = now.getHours() * 60 + now.getMinutes();
    setState(
      minutes >= openHour * 60 + openMinute && minutes < closeHour * 60 + closeMinute
        ? "open"
        : "closed"
    );
  }, []);

  return state;
}

export function StudioSelector({ compact = false }: { compact?: boolean }) {
  const [activeSlug, setActiveSlug] = useState<LocationSlug>(LOCATIONS[0].slug);
  const [geo, setGeo] = useState<{ slug: LocationSlug; miles: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error">("idle");
  const openState = useOpenState();

  const active = locationBySlug(activeSlug);

  const findNearest = () => {
    if (!("geolocation" in navigator)) {
      setGeoState("error");
      return;
    }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const results = LOCATIONS.map((location) => ({
          slug: location.slug,
          miles: haversineMiles(
            { latitude: position.coords.latitude, longitude: position.coords.longitude },
            { latitude: location.latitude, longitude: location.longitude }
          )
        })).sort((a, b) => a.miles - b.miles);
        setActiveSlug(results[0].slug);
        setGeo(results[0]);
        setGeoState("idle");
      },
      () => setGeoState("error"),
      { timeout: 9000, maximumAge: 60_000 }
    );
  };

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {LOCATIONS.map((location) => {
          const selected = location.slug === activeSlug;
          return (
            <button
              key={location.slug}
              type="button"
              onClick={() => setActiveSlug(location.slug)}
              className={cn(
                "group flex items-center justify-between gap-4 border p-4 text-left transition-all duration-300 md:p-5",
                selected
                  ? "border-gold/55 bg-gold/[0.05]"
                  : "border-line bg-carbon/40 hover:border-porcelain/20"
              )}
              aria-pressed={selected}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center border font-mono text-[9px] tracking-[0.16em]",
                    selected ? "border-gold/50 text-gold" : "border-line text-ash-dim"
                  )}
                >
                  {location.index}
                </span>
                <span>
                  <span className="block text-sm font-medium text-porcelain">
                    {location.shortName}
                  </span>
                  <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                    {location.address}
                  </span>
                </span>
              </span>
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  selected ? "border-gold bg-gold" : "border-line group-hover:border-gold/40"
                )}
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-carbon" />}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <StudioMap
            activeSlug={activeSlug}
            onSelect={setActiveSlug}
            className={cn(
              "h-[340px] border border-line sm:h-[420px]",
              compact ? "lg:h-[470px]" : "lg:h-[560px]"
            )}
          />
        </div>

        <div className="lg:col-span-5">
          <div className="flex h-full flex-col border border-line bg-carbon/50">
            <div className="border-b border-line p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                  Studio {active.index} / Royal Oak
                </p>
                <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      openState === "open"
                        ? "animate-pulse-gold bg-gold"
                        : openState === "closed"
                          ? "bg-[#a8473a]"
                          : "bg-ash-dim"
                    )}
                  />
                  {openState === "open"
                    ? "Open now"
                    : openState === "closed"
                      ? "Closed now"
                      : "Checking hours"}
                </span>
              </div>
              <h3 className="display mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-porcelain">
                {active.shortName}
              </h3>
              <p className="prose-lux mt-3 text-[12px] leading-relaxed">{active.character}</p>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <div>
                  <a
                    href={active.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-light leading-relaxed text-porcelain transition-colors hover:text-gold"
                  >
                    {active.address}
                    <br />
                    {active.city}, {active.state} {active.postalCode}
                  </a>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
                    Detroit Metro — free client parking
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <a
                  href={active.phoneHref}
                  className="text-sm font-light text-porcelain transition-colors hover:text-gold"
                >
                  {active.phone}
                </a>
              </div>

              <div className="border-t border-line pt-4">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                    Studio hours
                  </p>
                </div>
                <div className="mt-3 space-y-1.5">
                  {[
                    { label: "Monday — Friday", value: "8:00 AM — 5:00 PM" },
                    { label: "Saturday", value: "8:30 AM — 3:00 PM" },
                    { label: "Sunday", value: "Closed" }
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.12em]"
                    >
                      <span className="text-ash">{row.label}</span>
                      <span className={row.value === "Closed" ? "text-gold/70" : "text-porcelain/75"}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {!compact && (
                <div className="border-t border-line pt-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                    Capabilities on site
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {active.capabilities.map((capability) => (
                      <span
                        key={capability}
                        className="border border-line px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-porcelain/65"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!compact && (
                <div className="border-t border-line pt-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                    Arrival
                  </p>
                  <p className="mt-2 text-[11px] font-light leading-relaxed text-ash">
                    Pull into the marked client bay and check in at the glass door. Keys stay with
                    you until the inspection walkaround is complete. Vehicles are stored indoors
                    for the duration of the build.
                  </p>
                </div>
              )}

              <div className="grid gap-2 pt-1 sm:grid-cols-2">
                <Button href={`/book?location=${active.slug}`} variant="gold" size="sm">
                  Reserve this bay
                </Button>
                <Button
                  href={active.directionsUrl}
                  variant="outline"
                  size="sm"
                  external
                  icon={false}
                >
                  <Navigation className="mr-2 h-3 w-3" strokeWidth={1.5} />
                  Directions
                </Button>
              </div>

              <button
                type="button"
                onClick={findNearest}
                disabled={geoState === "loading"}
                className="group flex w-full items-center justify-between gap-3 border border-line px-3 py-2.5 text-left transition-colors hover:border-gold/40 disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  <Crosshair className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                    {geoState === "loading"
                      ? "Locating nearest studio…"
                      : geo
                        ? `Nearest: ${locationBySlug(geo.slug).shortName} — ${geo.miles.toFixed(1)} mi`
                        : "Find my nearest studio"}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 text-ash-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  strokeWidth={1.4}
                />
              </button>
              {geoState === "error" && (
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#d98a7d]">
                  Location unavailable — both studios are within four miles of downtown Royal Oak.
                </p>
              )}

              {compact && (
                <Link
                  href="/locations"
                  className="link-line inline-block font-mono text-[8px] uppercase tracking-[0.2em] text-gold"
                >
                  Full studio details &amp; hours
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border border-line bg-carbon/40 px-4 py-3">
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash-dim">
          Both studios: Mon–Fri 8–5 · Sat 8:30–3 · Sun closed
        </p>
        <a
          href={SITE.phoneHref}
          className="font-mono text-[8px] uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright"
        >
          {SITE.phone}
        </a>
      </div>
    </div>
  );
}
