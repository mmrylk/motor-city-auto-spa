"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function HeroMedia() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }
    const play = () => video.play().catch(() => undefined);
    play();
    document.addEventListener("visibilitychange", play);
    const handleCanPlay = () => {
      requestAnimationFrame(() => setReady(true));
    };
    video.addEventListener("canplay", handleCanPlay);
    return () => {
      document.removeEventListener("visibilitychange", play);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [reduced]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-carbon">
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y, scale }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/media/hero-poster.jpg')" }}
        />
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/hero-poster.jpg"
          onCanPlay={() => {}}
          suppressHydrationWarning
          tabIndex={-1}
          disablePictureInPicture
          aria-hidden="true"
        >
          <source src="/media/hero-loop.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* cinematic grade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_40%,transparent_0%,rgba(13,14,16,0.35)_55%,#0D0E10_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-carbon/80 via-carbon/25 to-carbon" />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/85 via-transparent to-carbon/30" />
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(255,255,255,0.6) 3px, transparent 4px)"
        }}
      />
      <div className="absolute inset-0 vignette-overlay" />
    </div>
  );
}
