"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, Loader2, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LOCATIONS, type Service } from "@/lib/site";
import { formatUSD } from "@/lib/utils";

type DepositModalProps = {
  service: Service;
  open: boolean;
  onClose: () => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function DepositModal({ service, open, onClose }: DepositModalProps) {
  const firstField = useRef<HTMLInputElement>(null);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locationSlug, setLocationSlug] = useState(LOCATIONS[0].slug);
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(() => firstField.current?.focus(), 120);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setState("idle");
      setMessage("");
      setReference("");
    }
  }, [open]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/service-deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug: service.slug, locationSlug, customerName, email, phone })
      });
      const data = (await response.json()) as {
        error?: string;
        url?: string;
        demo?: boolean;
        reference?: string;
        message?: string;
      };

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Unable to start the deposit checkout.");
        return;
      }

      if (data.url) {
        window.location.assign(data.url);
        return;
      }

      setState("success");
      setReference(data.reference ?? "");
      setMessage(data.message ?? "Deposit recorded.");
    } catch {
      setState("error");
      setMessage("Unable to reach the studio. Check your connection and try again.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Close deposit dialog"
            onClick={onClose}
            className="absolute inset-0 bg-carbon/80 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deposit-title"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.99 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto border border-line bg-slate-deep shadow-2xl clip-notch sm:max-h-[90vh]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="flex items-start justify-between gap-4 border-b border-line p-5 md:p-6">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
                  Reservation deposit
                </p>
                <h2 id="deposit-title" className="mt-2 text-xl font-light text-porcelain">
                  {service.shortName}
                </h2>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                  {service.category} · {service.duration}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ash transition-colors hover:border-gold/50 hover:text-gold"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>

            {state === "success" ? (
              <div className="p-6 md:p-8">
                <div className="flex h-12 w-12 items-center justify-center border border-gold/50 bg-gold/10 text-gold">
                  <Check className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 text-2xl font-light text-porcelain">
                  Deposit reservation recorded.
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-ash">{message}</p>
                {reference && (
                  <div className="mt-5 border border-line bg-carbon/50 px-4 py-3">
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                      Reference
                    </p>
                    <p className="mt-1 font-mono text-sm tracking-[0.12em] text-gold">{reference}</p>
                  </div>
                )}
                <p className="mt-5 text-[11px] font-light leading-relaxed text-ash-dim">
                  We will call within one business day to confirm the build plan and schedule the
                  drop-off. The $100 is credited in full against the final invoice.
                </p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Button href="/book" variant="gold" className="flex-1">
                    Choose a drop-off slot
                  </Button>
                  <Button onClick={onClose} variant="outline" icon={false} className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-5 md:p-6" noValidate>
                <div className="flex items-end justify-between gap-4 border border-gold/20 bg-gold/[0.04] px-4 py-3">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                      Due today
                    </p>
                    <p className="mt-1 font-display text-2xl text-gold">$100</p>
                  </div>
                  <p className="max-w-[15rem] text-right text-[10px] font-light leading-relaxed text-ash">
                    Credited in full against the final invoice. Refundable up to 72 hours before the
                    appointment.
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                      Full name
                    </span>
                    <input
                      ref={firstField}
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      className="form-field"
                      placeholder="First and last name"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                        Email
                      </span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="form-field"
                        placeholder="you@domain.com"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                        Phone
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="form-field"
                        placeholder="(248) 000-0000"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                      Preferred studio
                    </span>
                    <select
                      value={locationSlug}
                      onChange={(event) => setLocationSlug(event.target.value as typeof locationSlug)}
                      className="form-field"
                    >
                      {LOCATIONS.map((location) => (
                        <option key={location.slug} value={location.slug}>
                          {location.shortName} — {location.address}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {state === "error" && (
                  <p className="mt-4 border border-[#a8473a]/40 bg-[#a8473a]/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[#e0a196]">
                    {message}
                  </p>
                )}

                <div className="mt-5 flex items-start gap-2 text-[10px] font-light leading-relaxed text-ash-dim">
                  <Lock className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.5} />
                  Secure checkout powered by Stripe. Card details never touch our servers. Deposit
                  is applied to the final invoice and transferable once with 48 hours&apos; notice.
                </div>

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="group mt-5 flex w-full items-center justify-center gap-3 bg-gold px-6 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-carbon transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-50 clip-notch-sm"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                      Opening secure checkout
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" strokeWidth={1.5} />
                      Reserve with {formatUSD(100)}
                    </>
                  )}
                </button>

                <p className="mt-3 text-center font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                  No card charged in demo mode · Stripe Checkout in production
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
