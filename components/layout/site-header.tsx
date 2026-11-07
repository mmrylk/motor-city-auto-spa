"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LOCATIONS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", index: "01" },
  { href: "/services", label: "Services", index: "02" },
  { href: "/locations", label: "Locations", index: "03" },
  { href: "/book", label: "Booking", index: "04" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || pathname !== "/";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "border-b border-line bg-carbon/80 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    "link-line group flex items-baseline gap-1.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors duration-300",
                    active ? "text-gold" : "text-porcelain/65 hover:text-porcelain"
                  )}
                >
                  <span className="text-[7px] text-ash-dim group-hover:text-gold/70">{item.index}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <a
              href={SITE.phoneHref}
              className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-gold xl:block"
            >
              {SITE.phone}
            </a>
            <div className="hidden md:block">
              <Button href="/book" size="sm" variant="gold">
                Reserve
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group flex h-11 items-center gap-3 border border-line px-3 text-porcelain transition-colors hover:border-gold/50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Open navigation menu"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.24em]">Menu</span>
              <Menu className="h-4 w-4 text-gold" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[80] overflow-y-auto bg-carbon/95 backdrop-blur-3xl"
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />
            <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[140px]" />

            <div className="relative flex min-h-full flex-col">
              <div className="shell flex h-[var(--header-h)] items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-11 w-11 items-center justify-center border border-line text-porcelain transition-colors hover:border-gold/60 hover:text-gold"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" strokeWidth={1.4} />
                </button>
              </div>

              <div className="shell flex flex-1 flex-col justify-center py-10">
                <nav aria-label="Mobile primary">
                  <ul className="space-y-1">
                    {NAV.map((item, index) => {
                      const active =
                        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                      return (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.7,
                            delay: 0.08 + index * 0.06,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                          className="border-b border-line"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="group flex items-center justify-between py-4"
                          >
                            <span className="flex items-baseline gap-4">
                              <span className="font-mono text-[9px] tracking-[0.3em] text-gold">
                                {item.index}
                              </span>
                              <span
                                className={cn(
                                  "display text-display-xs transition-colors",
                                  active ? "text-gold" : "text-porcelain group-hover:text-gold"
                                )}
                              >
                                {item.label}
                              </span>
                            </span>
                            <ArrowUpRight
                              className="h-5 w-5 text-ash transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
                              strokeWidth={1.2}
                            />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mt-10 grid gap-8 sm:grid-cols-2"
                >
                  <div>
                    <p className="eyebrow mb-3">Studios</p>
                    {LOCATIONS.map((location) => (
                      <a
                        key={location.slug}
                        href={location.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mb-3 block text-sm font-light leading-relaxed text-porcelain/75 transition-colors hover:text-gold"
                      >
                        {location.address}
                        <br />
                        {location.city}, {location.state} {location.postalCode}
                      </a>
                    ))}
                  </div>
                  <div>
                    <p className="eyebrow mb-3">Direct</p>
                    <a
                      href={SITE.phoneHref}
                      className="block text-lg font-light tracking-wide text-porcelain transition-colors hover:text-gold"
                    >
                      {SITE.phone}
                    </a>
                    <a
                      href={SITE.emailHref}
                      className="mt-1 block text-sm font-light text-ash transition-colors hover:text-gold"
                    >
                      {SITE.email}
                    </a>
                    <p className="mt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ash-dim">
                      Mon–Fri 8–5 · Sat 8:30–3
                      <br />
                      Sunday closed
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="mt-10"
                >
                  <Button href="/book" variant="gold" size="lg" className="w-full sm:w-auto">
                    Reserve a bay
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
