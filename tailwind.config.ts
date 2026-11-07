import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#0D0E10",
        slate: "#141619",
        "slate-deep": "#0A0B0D",
        olive: "#3B413A",
        "olive-light": "#4A5248",
        gold: "#E5A93C",
        "gold-bright": "#FFC65C",
        porcelain: "#F9FAFB",
        ash: "#8A8F8B",
        "ash-dim": "#5A5F5B",
        line: "rgba(249,250,251,0.09)"
      },
      fontFamily: {
        display: ["var(--font-syne)", "Arial Black", "sans-serif"],
        sans: ["var(--font-space)", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["var(--font-plex)", "SFMono-Regular", "Consolas", "monospace"]
      },
      fontSize: {
        "display-xs": ["clamp(2.1rem, 4vw, 3.4rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-sm": ["clamp(2.6rem, 5vw, 4.6rem)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(3.2rem, 7vw, 6.4rem)", { lineHeight: "0.88", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(4rem, 10vw, 9.5rem)", { lineHeight: "0.82", letterSpacing: "-0.05em" }],
        "display-xl": ["clamp(5rem, 14vw, 14rem)", { lineHeight: "0.78", letterSpacing: "-0.055em" }]
      },
      spacing: {
        gutter: "clamp(1.25rem, 4vw, 4rem)",
        section: "clamp(5.5rem, 12vw, 11rem)"
      },
      maxWidth: {
        shell: "1560px"
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "1px",
        md: "2px",
        lg: "3px"
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.16, 1, 0.3, 1)",
        sharp: "cubic-bezier(0.7, 0, 0.2, 1)"
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "0.7" },
          "90%": { opacity: "0.7" },
          "100%": { transform: "translateY(100%)", opacity: "0" }
        },
        pulseGold: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.35)" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)" },
          "100%": { transform: "translateX(220%) skewX(-18deg)" }
        }
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        scan: "scan 5s linear infinite",
        "pulse-gold": "pulseGold 3.4s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        sheen: "sheen 1.1s cubic-bezier(0.16,1,0.3,1) forwards"
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(to right, rgba(249,250,251,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(249,250,251,0.045) 1px, transparent 1px)",
        "radial-gold": "radial-gradient(circle at center, rgba(229,169,60,0.22), transparent 68%)",
        "fade-bottom": "linear-gradient(to bottom, transparent, #0D0E10)"
      },
      boxShadow: {
        gold: "0 0 0 1px rgba(229,169,60,0.35), 0 18px 60px -18px rgba(229,169,60,0.35)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), 0 40px 90px -40px rgba(0,0,0,0.9)"
      }
    }
  },
  plugins: []
};

export default config;
