"use client";

import { LOCATIONS, locationBySlug, type LocationSlug } from "@/lib/site";
import { cn } from "@/lib/utils";

const PIN_POSITIONS: Record<LocationSlug, { x: number; y: number; labelY: number }> = {
  "eleven-mile": { x: 428, y: 330, labelY: 296 },
  delemere: { x: 612, y: 205, labelY: 171 }
};

function TacticalMap({
  activeSlug,
  onSelect
}: {
  activeSlug: LocationSlug;
  onSelect?: (slug: LocationSlug) => void;
}) {
  return (
    <svg
      viewBox="0 0 800 520"
      className="h-full w-full"
      role="img"
      aria-label="Stylized map of Royal Oak, Michigan showing the 11 Mile and Delemere studios"
    >
      <title>Motor City Auto Spa studio map — Royal Oak, Michigan</title>
      <defs>
        <pattern id="mcas-map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(249,250,251,0.035)" strokeWidth="1" />
        </pattern>
        <radialGradient id="mcas-map-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3B413A" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#0A0B0D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mcas-road-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E5A93C" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <rect width="800" height="520" fill="#090B0C" />
      <rect width="800" height="520" fill="url(#mcas-map-grid)" />
      <rect width="800" height="520" fill="url(#mcas-map-glow)" />

      {/* city blocks */}
      <g fill="#101411" stroke="#1A1F1A" strokeWidth="1">
        <path d="M40 40h150v90H40z" />
        <path d="M215 35h95v110h-95z" />
        <path d="M340 30h110v95H340z" />
        <path d="M480 30h80v80h-80z" />
        <path d="M600 35h150v100H600z" />
        <path d="M30 165h120v80H30z" />
        <path d="M185 170h100v95H185z" />
        <path d="M320 160h110v90H320z" />
        <path d="M465 145h85v80h-85z" />
        <path d="M585 165h160v80H585z" />
        <path d="M40 285h120v85H40z" />
        <path d="M195 290h95v80h-95z" />
        <path d="M330 285h90v80h-90z" />
        <path d="M465 280h80v90h-80z" />
        <path d="M585 285h165v85H585z" />
        <path d="M30 405h130v75H30z" />
        <path d="M200 405h100v70H200z" />
        <path d="M340 405h110v70H340z" />
        <path d="M490 405h75v70h-75z" />
        <path d="M605 405h160v70H605z" />
      </g>

      {/* parks */}
      <g fill="#151F17" stroke="#243026" strokeWidth="1">
        <path d="M45 180h95v55H45z" opacity="0.85" />
        <path d="M600 300h120v65H600z" opacity="0.85" />
        <path d="M205 40h55v45h-55z" opacity="0.7" />
      </g>

      {/* I-696 */}
      <path d="M-20 402 L820 122" stroke="#222822" strokeWidth="18" fill="none" />
      <path d="M-20 402 L820 122" stroke="#0C0E0D" strokeWidth="12" fill="none" />
      <path
        d="M-20 402 L820 122"
        stroke="#E5A93C"
        strokeWidth="1"
        strokeDasharray="8 12"
        opacity="0.3"
        fill="none"
      />

      {/* Woodward */}
      <path d="M292 -20 L470 540" stroke="#242A24" strokeWidth="12" fill="none" />
      <path d="M292 -20 L470 540" stroke="#0D0F0E" strokeWidth="8" fill="none" />
      <path
        d="M292 -20 L470 540"
        stroke="#E5A93C"
        strokeWidth="1"
        strokeDasharray="4 14"
        opacity="0.3"
        fill="none"
      />

      {/* mile roads */}
      <g stroke="#202620" strokeWidth="8" fill="none">
        <path d="M-20 190 L820 190" />
        <path d="M-20 330 L820 330" />
        <path d="M-20 455 L820 455" />
      </g>
      <g stroke="#0D0F0E" strokeWidth="5" fill="none">
        <path d="M-20 190 L820 190" />
        <path d="M-20 330 L820 330" />
        <path d="M-20 455 L820 455" />
      </g>

      {/* secondary roads */}
      <g stroke="#1B211B" strokeWidth="4" fill="none">
        <path d="M120 -20 L150 540" />
        <path d="M225 -20 L235 540" />
        <path d="M555 -20 L540 540" />
        <path d="M612 -20 L600 540" />
        <path d="M700 -20 L690 540" />
        <path d="M-20 95 L820 95" />
        <path d="M-20 270 L820 270" />
        <path d="M-20 395 L820 395" />
      </g>

      {/* road labels */}
      <g
        fontFamily="var(--font-plex), monospace"
        fontSize="9"
        letterSpacing="2.4"
        fill="#5A5F5B"
      >
        <text x="20" y="184">
          12 MILE RD
        </text>
        <text x="20" y="324">
          11 MILE RD
        </text>
        <text x="20" y="449">
          10 MILE RD
        </text>
        <text x="560" y="458">
          DELEMERE BLVD
        </text>
        <text x="300" y="495" transform="rotate(-12 300 495)">
          WOODWARD AVE
        </text>
        <text x="600" y="118" transform="rotate(-18 600 118)">
          I-696
        </text>
      </g>

      {/* city labels */}
      <g
        fontFamily="var(--font-plex), monospace"
        fontSize="10"
        letterSpacing="4"
        fill="#3F453F"
      >
        <text x="420" y="270">
          ROYAL OAK
        </text>
        <text x="330" y="500">
          FERNDALE
        </text>
        <text x="90" y="150">
          CLAWSON
        </text>
        <text x="610" y="440">
          MADISON HEIGHTS
        </text>
      </g>

      {/* pins */}
      {LOCATIONS.map((location) => {
        const pin = PIN_POSITIONS[location.slug];
        const active = location.slug === activeSlug;
        return (
          <g
            key={location.slug}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={onSelect ? `Show ${location.shortName}` : undefined}
            onClick={() => onSelect?.(location.slug)}
            onKeyDown={(event) => {
              if (onSelect && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                onSelect(location.slug);
              }
            }}
            className={cn(onSelect && "cursor-pointer")}
          >
            {active && (
              <circle
                cx={pin.x}
                cy={pin.y}
                r="18"
                fill="rgba(229,169,60,0.08)"
                stroke="rgba(229,169,60,0.35)"
                strokeWidth="1"
                className="animate-ping"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}
            <circle
              cx={pin.x}
              cy={pin.y}
              r={active ? 8 : 5}
              fill={active ? "#E5A93C" : "#5A5F5B"}
              stroke={active ? "#0D0E10" : "#0D0E10"}
              strokeWidth="2"
            />
            <path
              d={`M${pin.x} ${pin.y + 8} L${pin.x - 5} ${pin.y + 18} L${pin.x + 5} ${pin.y + 18} Z`}
              fill={active ? "#E5A93C" : "#5A5F5B"}
            />
            <g transform={`translate(${pin.x} ${pin.labelY})`}>
              <rect
                x="-48"
                y="-14"
                width="96"
                height="20"
                fill={active ? "rgba(13,14,16,0.92)" : "rgba(13,14,16,0.7)"}
                stroke={active ? "rgba(229,169,60,0.5)" : "rgba(249,250,251,0.12)"}
                strokeWidth="1"
              />
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fontFamily="var(--font-plex), monospace"
                fontSize="8"
                letterSpacing="1.6"
                fill={active ? "#E5A93C" : "#8A8F8B"}
              >
                {location.index} / {location.shortName.toUpperCase()}
              </text>
            </g>
          </g>
        );
      })}

      {/* compass */}
      <g transform="translate(745 455)" opacity="0.65">
        <circle r="20" fill="none" stroke="rgba(249,250,251,0.14)" strokeWidth="1" />
        <path d="M0 -14 L4 4 L0 1 L-4 4 Z" fill="#E5A93C" />
        <text
          x="0"
          y="-24"
          textAnchor="middle"
          fontFamily="var(--font-plex), monospace"
          fontSize="8"
          fill="#8A8F8B"
        >
          N
        </text>
      </g>

      {/* scale */}
      <g transform="translate(35 475)" opacity="0.65">
        <path d="M0 0h80" stroke="#8A8F8B" strokeWidth="1" />
        <path d="M0 -4v8M40 -4v8M80 -4v8" stroke="#8A8F8B" strokeWidth="1" />
        <text
          x="0"
          y="16"
          fontFamily="var(--font-plex), monospace"
          fontSize="7"
          letterSpacing="1.4"
          fill="#5A5F5B"
        >
          0.5 MI
        </text>
      </g>
    </svg>
  );
}

export function StudioMap({
  activeSlug,
  onSelect,
  className
}: {
  activeSlug: LocationSlug;
  onSelect?: (slug: LocationSlug) => void;
  className?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const active = locationBySlug(activeSlug);

  return (
    <div className={cn("relative overflow-hidden bg-[#090B0C]", className)}>
      {apiKey ? (
        <>
          <iframe
            title={`Google Map of ${active.shortName}`}
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
              active.mapsQuery
            )}&zoom=15&maptype=roadmap`}
            className="absolute inset-0 h-full w-full border-0 opacity-80 [filter:invert(92%)_hue-rotate(180deg)_contrast(0.82)_saturate(0.35)]"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-carbon/30" />
        </>
      ) : (
        <TacticalMap activeSlug={activeSlug} onSelect={onSelect} />
      )}

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 border border-white/10 bg-carbon/70 px-3 py-2 backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse-gold rounded-full bg-gold" />
        <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-porcelain/70">
          Royal Oak studio grid
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-2 border border-white/10 bg-carbon/75 px-4 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-gold">
            {active.index} / {active.shortName}
          </p>
          <p className="mt-1 text-[12px] font-light text-porcelain/80">
            {active.address}, {active.city}, {active.state} {active.postalCode}
          </p>
        </div>
        <a
          href={active.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto font-mono text-[8px] uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-bright"
        >
          Open directions →
        </a>
      </div>
    </div>
  );
}
