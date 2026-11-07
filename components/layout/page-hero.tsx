import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  image: string;
  imageAlt: string;
  breadcrumb: string;
  meta?: { label: string; value: string }[];
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  index,
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  breadcrumb,
  meta,
  className,
  children
}: PageHeroProps) {
  return (
    <section className={cn("relative isolate overflow-hidden bg-carbon", className)}>
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon/80 via-carbon/55 to-carbon" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon via-carbon/40 to-transparent" />
        <div className="absolute inset-0 vignette-overlay" />
      </div>

      <div className="shell relative flex min-h-[62vh] flex-col pb-12 pt-[calc(var(--header-h)+2.5rem)] md:min-h-[68vh] md:pb-16">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-ash"
        >
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <ChevronRight className="h-2.5 w-2.5 text-ash-dim" strokeWidth={1.5} />
          <span className="text-porcelain/70">{breadcrumb}</span>
        </nav>

        <div className="mt-auto pt-20">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-gold" />
            <span className="eyebrow">{eyebrow}</span>
            <span className="ml-auto hidden font-mono text-[9px] tracking-[0.24em] text-ash-dim sm:block">
              {index}
            </span>
          </div>

          <h1 className="display mt-5 text-[clamp(3rem,9vw,8.5rem)] text-porcelain">{title}</h1>

          <div className="mt-7 grid gap-7 border-t border-white/10 pt-6 lg:grid-cols-12 lg:items-start">
            <div className="prose-lux max-w-2xl text-pretty lg:col-span-6">{description}</div>
            {meta && meta.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:col-span-5 lg:justify-self-end">
                {meta.map((entry) => (
                  <div key={entry.label}>
                    <p className="font-mono text-[7px] uppercase tracking-[0.22em] text-ash-dim">
                      {entry.label}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-porcelain/85">
                      {entry.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {children && <div className="mt-7">{children}</div>}
        </div>
      </div>
    </section>
  );
}
