import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "gold" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
  ariaLabel?: string;
};

const variants: Record<Variant, string> = {
  gold: "bg-gold text-carbon hover:bg-gold-bright",
  outline:
    "border border-porcelain/20 text-porcelain hover:border-gold/80 hover:text-gold",
  ghost: "text-porcelain/80 hover:text-gold",
  dark: "border border-line bg-carbon/70 text-porcelain hover:border-gold/60 hover:text-gold"
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2.5 text-[9px] gap-2",
  md: "px-6 py-4 text-[10px] gap-3",
  lg: "px-8 py-5 text-[11px] gap-4"
};

export function Button({
  children,
  href,
  variant = "gold",
  size = "md",
  icon = true,
  className,
  type = "button",
  onClick,
  disabled,
  external,
  ariaLabel
}: ButtonProps) {
  const classes = cn(
    "group relative inline-flex select-none items-center justify-center overflow-hidden font-mono font-medium uppercase tracking-[0.22em] transition-colors duration-500 clip-notch-sm disabled:cursor-not-allowed disabled:opacity-40",
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 flex h-4 w-4 items-center justify-center overflow-hidden">
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-500 ease-lux group-hover:-translate-y-4 group-hover:translate-x-4"
            strokeWidth={1.6}
          />
          <ArrowUpRight
            className="absolute h-3.5 w-3.5 -translate-x-4 translate-y-4 transition-transform duration-500 ease-lux group-hover:translate-x-0 group-hover:translate-y-0"
            strokeWidth={1.6}
          />
        </span>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 -translate-x-[120%] skew-x-[-18deg] bg-white/25 transition-transform duration-700 ease-lux group-hover:translate-x-[120%]"
      />
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
