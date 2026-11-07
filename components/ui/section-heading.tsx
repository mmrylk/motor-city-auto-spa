import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  align?: "split" | "stack";
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
  titleClassName,
  align = "split"
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 bg-gold" aria-hidden="true" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <span className="mono text-[10px] tracking-[0.32em] text-ash-dim">{index}</span>
      </div>

      <div
        className={cn(
          "mt-8 md:mt-10",
          align === "split" && "grid items-end gap-8 lg:grid-cols-12"
        )}
      >
        <Reveal className={cn(align === "split" ? "lg:col-span-8" : "")}>
          <h2
            className={cn(
              "display text-display-md text-balance text-porcelain",
              titleClassName
            )}
          >
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal
            delay={0.12}
            className={cn(
              align === "split" ? "lg:col-span-4 lg:pb-2" : "mt-6 max-w-2xl"
            )}
          >
            <div className="prose-lux text-pretty">{description}</div>
          </Reveal>
        )}
      </div>

      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
