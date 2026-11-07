import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, onDark = true }: { className?: string; onDark?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label="Motor City Auto Spa — home"
    >
      <svg
        viewBox="0 0 44 44"
        className="h-9 w-9 shrink-0 md:h-10 md:w-10"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 35.5 L12 7.5 L22 25.5 L32 7.5 L40 35.5"
          stroke={onDark ? "#F9FAFB" : "#0D0E10"}
          strokeWidth="2.2"
          strokeLinejoin="miter"
          className="transition-colors duration-500 group-hover:stroke-gold"
        />
        <path d="M3 40 H41" stroke="#E5A93C" strokeWidth="1.4" />
        <path d="M12 7.5 L22 25.5 L32 7.5" stroke="#E5A93C" strokeWidth="1" opacity="0.4" />
      </svg>
      <span className="flex flex-col">
        <span
          className={cn(
            "font-display text-[12px] font-bold uppercase leading-none tracking-[0.18em] md:text-[13px]",
            onDark ? "text-porcelain" : "text-carbon"
          )}
        >
          Motor City
        </span>
        <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.42em] text-gold md:text-[8px]">
          Auto Spa
        </span>
      </span>
    </Link>
  );
}
