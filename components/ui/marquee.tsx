import { cn } from "@/lib/utils";

const DEFAULT_ITEMS = [
  "Icon Rocklear Composite",
  "XPEL Paint Protection Film",
  "Opti-Coat Pro Ceramic",
  "Dry Ice Underbody Blasting",
  "Multi-Stage Paint Correction",
  "Ceramic Window Film",
  "Factory-Trained Installers",
  "Royal Oak, Michigan"
];

export function Marquee({
  items = DEFAULT_ITEMS,
  className
}: {
  items?: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-line bg-slate-deep/60 py-4",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-carbon to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-carbon to-transparent" />
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {items.map((item) => (
              <div key={`${copy}-${item}`} className="flex items-center">
                <span className="px-6 font-mono text-[10px] uppercase tracking-[0.3em] text-ash transition-colors hover:text-porcelain md:px-8">
                  {item}
                </span>
                <span className="text-[7px] text-gold" aria-hidden="true">
                  ◆
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
