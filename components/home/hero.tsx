"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HeroMedia } from "@/components/home/hero-media";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  // Гарантируем мгновенный запуск и инициализацию медиафона при первом монтировании
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const line = {
    hidden: { y: "112%" },
    show: { y: "0%", transition: { duration: 1.15, ease: EASE } }
  };

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-carbon">
      {/* Рендерим медиафон только после монтирования, либо передаем триггер, 
          чтобы WebGL/анимация не застревали на холодном старте */}
      {isMounted && <HeroMedia />}

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="shell flex flex-1 flex-col pb-8 pt-[calc(var(--header-h)+26px)]">
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="flex items-start justify-between gap-6"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="eyebrow text-porcelain/75">Royal Oak, Michigan</span>
            </div>
            <div className="hidden text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.24em] text-ash sm:block">
              42.4897° N / 83.1546° W
              <br />
              <span className="text-gold">Est. 2011</span> — Detroit Metro
            </div>
          </motion.div>

          <div className="mt-auto pt-20 md:pt-24">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
              className="mb-5 flex flex-wrap items-center gap-4"
            >
              <span className="h-px w-10 bg-gold" />
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-gold md:text-[10px]">
                Uncompromising automotive perfection
              </p>
            </motion.div>

            <h1 className="display-tight text-[clamp(3.2rem,10.8vw,10.8rem)] text-porcelain">
              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block"
                  variants={line}
                  initial={reduced ? false : "hidden"}
                  animate="show"
                >
                  Motor City
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block text-outline"
                  variants={line}
                  initial={reduced ? false : "hidden"}
                  animate="show"
                  transition={{ duration: 1.15, delay: 0.12, ease: EASE }}
                >
                  Auto Spa<span className="text-gold" style={{ WebkitTextStroke: "0" }}>.</span>
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: EASE }}
              className="mt-8 grid gap-8 border-t border-white/10 pt-7 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-5">
                <p className="max-w-md text-xl font-light leading-snug text-porcelain md:text-2xl">
                  Detroit built the car.
                  <br />
                  <span className="text-gold">We make it permanent.</span>
                </p>
              </div>
              <div className="lg:col-span-4">
                <p className="prose-lux max-w-md text-pretty text-[13px] leading-relaxed md:text-sm">
                  Icon Rocklear composite coating, XPEL clear bra and dry-ice underbody
                  restoration — executed in two Royal Oak studios to a standard the industry
                  still has not caught up to.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-3 lg:flex-col lg:items-stretch">
                <Button href="/book" variant="gold" size="lg" className="w-full">
                  Build your protection
                </Button>
                <Button href="/services" variant="outline" size="lg" className="w-full">
                  Explore services
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/10 pt-5 sm:grid-cols-4"
          >
            {[
              "Factory-trained XPEL",
              "Icon Rocklear Elite",
              "Opti-Coat Pro Certified",
              "10-year warranty"
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-1 w-1 bg-gold" aria-hidden="true" />
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-porcelain/55 md:text-[9px]">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-28 right-6 z-10 hidden flex-col items-center gap-4 xl:flex">
        <span
          className="font-mono text-[8px] uppercase tracking-[0.34em] text-ash"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to inspect
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-4 animate-scan bg-gold" />
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-gold" strokeWidth={1.2} />
      </div>
    </section>
  );
}