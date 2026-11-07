"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  User
} from "lucide-react";
import { getStripePromise } from "@/lib/stripe/client";
import {
  ADD_ONS,
  LOCATIONS,
  SERVICES,
  VEHICLE_TYPES,
  locationBySlug,
  serviceBySlug,
  type LocationSlug,
  type VehicleType
} from "@/lib/site";
import { buildQuote } from "@/lib/pricing";
import type { AvailabilityResult } from "@/lib/availability";
import { cn, formatLongDate, formatSlot, formatUSD, toISODate } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { id: 1, label: "Build" },
  { id: 2, label: "Time" },
  { id: 3, label: "Details" },
  { id: 4, label: "Deposit" }
];

type Customer = {
  name: string;
  email: string;
  phone: string;
  year: string;
  make: string;
  model: string;
  notes: string;
};

const EMPTY_CUSTOMER: Customer = {
  name: "",
  email: "",
  phone: "",
  year: "",
  make: "",
  model: "",
  notes: ""
};

const appearance: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: "#E5A93C",
    colorBackground: "#0D0E10",
    colorText: "#F9FAFB",
    colorTextSecondary: "#8A8F8B",
    colorDanger: "#D98A7D",
    fontFamily: "var(--font-space), system-ui, sans-serif",
    borderRadius: "2px",
    spacingUnit: "4px"
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(249,250,251,0.14)",
      backgroundColor: "rgba(10,11,13,0.7)",
      boxShadow: "none"
    },
    ".Input:focus": {
      border: "1px solid rgba(229,169,60,0.7)",
      boxShadow: "none"
    },
    ".Label": {
      fontSize: "10px",
      textTransform: "uppercase",
      letterSpacing: "0.14em"
    },
    ".Tab": {
      border: "1px solid rgba(249,250,251,0.12)",
      backgroundColor: "rgba(10,11,13,0.5)",
      boxShadow: "none"
    },
    ".Tab--selected": {
      border: "1px solid rgba(229,169,60,0.6)",
      backgroundColor: "rgba(229,169,60,0.08)"
    }
  }
};

function PaymentForm({
  reference,
  onConfirmed
}: {
  reference: string;
  onConfirmed: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [state, setState] = useState<"idle" | "processing" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements || state === "processing") return;

    setState("processing");
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/success?ref=${reference}`
      },
      redirect: "if_required"
    });

    if (result.error) {
      setState("error");
      setMessage(result.error.message ?? "Payment could not be completed. Try another card.");
      return;
    }

    const intent = result.paymentIntent;
    if (intent?.status === "succeeded") {
      try {
        const response = await fetch("/api/bookings/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, paymentIntentId: intent.id })
        });
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          setState("error");
          setMessage(data.error ?? "Payment succeeded but confirmation failed. Call the studio.");
          return;
        }
        onConfirmed();
      } catch {
        setState("error");
        setMessage("Payment succeeded but confirmation failed. Call the studio with your reference.");
      }
      return;
    }

    setState("error");
    setMessage("Payment did not complete. Try another method or call the studio.");
  }

  return (
    <form onSubmit={onSubmit} className="mt-5">
      <div className="border border-line bg-carbon/50 p-4">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {state === "error" && (
        <p className="mt-4 border border-[#a8473a]/40 bg-[#a8473a]/10 px-3 py-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[#e0a196]">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || state === "processing"}
        className="mt-5 flex w-full items-center justify-center gap-3 bg-gold px-6 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-carbon transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-50 clip-notch-sm"
      >
        {state === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
            Processing deposit
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" strokeWidth={1.5} />
            Pay $100 deposit
          </>
        )}
      </button>

      <p className="mt-3 flex items-start gap-2 text-[10px] font-light leading-relaxed text-ash-dim">
        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.5} />
        Card details are handled by Stripe. The $100 is credited in full against the final invoice
        and refundable up to 72 hours before the appointment.
      </p>
    </form>
  );
}

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const stripePromise = getStripePromise();

  const paramService = params.get("service") ?? "";
  const paramVehicle = params.get("vehicle") ?? "";
  const paramAddons = params.get("addons") ?? "";
  const paramLocation = params.get("location") ?? "";

  const [step, setStep] = useState(1);
  const [serviceSlug, setServiceSlug] = useState(() =>
    SERVICES.some((service) => service.slug === paramService) ? paramService : "icon-rocklear"
  );
  const [vehicleType, setVehicleType] = useState<VehicleType>(() =>
    VEHICLE_TYPES.some((entry) => entry.value === paramVehicle)
      ? (paramVehicle as VehicleType)
      : "sedan"
  );
  const [addOns, setAddOns] = useState<string[]>(() =>
    paramAddons.split(",").filter((id) => ADD_ONS.some((addOn) => addOn.id === id))
  );
  const [locationSlug, setLocationSlug] = useState<LocationSlug>(() =>
    LOCATIONS.some((location) => location.slug === paramLocation)
      ? (paramLocation as LocationSlug)
      : "eleven-mile"
  );

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availability, setAvailability] = useState<AvailabilityResult | null>(null);
  const [availabilityState, setAvailabilityState] = useState<"idle" | "loading" | "error">("idle");

  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [reference, setReference] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = useMemo(() => {
    const value = new Date();
    value.setHours(12, 0, 0, 0);
    return value;
  }, []);
  const maxDate = useMemo(() => {
    const value = new Date(today);
    value.setDate(value.getDate() + 60);
    return value;
  }, [today]);
  const [monthCursor, setMonthCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const quote = useMemo(
    () => buildQuote(serviceSlug, vehicleType, addOns),
    [serviceSlug, vehicleType, addOns]
  );
  const service = serviceBySlug(serviceSlug);
  const location = locationBySlug(locationSlug);
  const vehicleLabel =
    VEHICLE_TYPES.find((entry) => entry.value === vehicleType)?.label ?? "Vehicle";

  const calendarDays = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const first = new Date(year, month, 1);
    const start = first.getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let index = 0; index < start; index += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) {
      cells.push(new Date(year, month, day, 12, 0, 0, 0));
    }
    return cells;
  }, [monthCursor]);

  const canPrevMonth =
    monthCursor.getTime() > new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const canNextMonth =
    monthCursor.getTime() < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1).getTime();

  const isDisabledDate = (value: Date) => {
    if (value.getDay() === 0) return true;
    if (value.getTime() < today.getTime()) return true;
    if (value.getTime() > maxDate.getTime()) return true;
    return false;
  };

  const detailsValid =
    customer.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()) &&
    customer.phone.replace(/\D/g, "").length >= 10 &&
    Number(customer.year) >= 1900 &&
    Number(customer.year) <= new Date().getFullYear() + 1 &&
    customer.make.trim().length > 0 &&
    customer.model.trim().length > 0;

  const maxReachable = !date || !time ? 2 : !detailsValid ? 3 : 4;

  useEffect(() => {
    if (!date) {
      setAvailability(null);
      return;
    }

    const controller = new AbortController();
    setAvailabilityState("loading");

    fetch(`/api/availability?date=${date}&location=${locationSlug}`, {
      signal: controller.signal,
      cache: "no-store"
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Availability request failed");
        return (await response.json()) as AvailabilityResult;
      })
      .then((data) => {
        setAvailability(data);
        setAvailabilityState("idle");
        setTime((current) =>
          data.slots.some((slot) => slot.value === current && slot.available) ? current : ""
        );
      })
      .catch((requestError: Error) => {
        if (requestError.name === "AbortError") return;
        setAvailabilityState("error");
        setAvailability(null);
      });

    return () => controller.abort();
  }, [date, locationSlug]);

  const goToStep = (target: number) => {
    if (target <= maxReachable && target >= 1) setStep(target);
  };

  const toggleAddOn = (id: string) => {
    setAddOns((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  };

  const updateCustomer = (field: keyof Customer, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  async function startCheckout() {
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          vehicleType,
          locationSlug,
          date,
          time,
          addOns,
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          vehicleYear: Number(customer.year),
          vehicleMake: customer.make,
          vehicleModel: customer.model,
          notes: customer.notes,
          mode: "payment-intent"
        })
      });

      const data = (await response.json()) as {
        error?: string;
        demo?: boolean;
        url?: string;
        reference?: string;
        clientSecret?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Unable to hold that slot. Please try again.");
        return;
      }

      if (data.demo) {
        router.push(data.url ?? `/book/success?ref=${data.reference}&demo=1`);
        return;
      }

      if (data.clientSecret && data.reference) {
        setReference(data.reference);
        setClientSecret(data.clientSecret);
        return;
      }

      setError("Payment session could not be created. Call the studio to reserve manually.");
    } catch {
      setError("Unable to reach the studio. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section relative overflow-hidden border-t border-line bg-carbon">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[480px] w-[480px] rounded-full bg-gold/[0.05] blur-[140px]" />

      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <div className="border border-line bg-slate-deep/70">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-4 py-4 md:px-6">
                <div className="flex items-center gap-3 md:gap-5">
                  {STEPS.map((entry) => {
                    const active = step === entry.id;
                    const complete = step > entry.id;
                    const reachable = entry.id <= maxReachable;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => goToStep(entry.id)}
                        disabled={!reachable}
                        className={cn(
                          "group flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] transition-colors disabled:cursor-not-allowed",
                          active
                            ? "text-gold"
                            : complete
                              ? "text-porcelain/65 hover:text-porcelain"
                              : "text-ash-dim",
                          !reachable && "opacity-40"
                        )}
                        aria-current={active ? "step" : undefined}
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center border text-[8px]",
                            active
                              ? "border-gold/60 bg-gold/10 text-gold"
                              : complete
                                ? "border-gold/30 text-gold/70"
                                : "border-line text-ash-dim"
                          )}
                        >
                          {complete ? <Check className="h-3 w-3" /> : `0${entry.id}`}
                        </span>
                        <span className="hidden sm:inline">{entry.label}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash-dim">
                  0{step} / 04
                </span>
              </div>

              <div className="relative min-h-[520px] p-5 md:p-7">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p className="eyebrow">Step 01 — Build</p>
                      <h2 className="mt-2 text-2xl font-light text-porcelain">
                        What are we doing to the car?
                      </h2>
                      <p className="mt-1.5 max-w-lg text-[12px] font-light leading-relaxed text-ash">
                        Select the primary discipline, vehicle class and any additions. The quote
                        updates live in the summary.
                      </p>

                      <div className="mt-6">
                        <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                          Primary service
                        </p>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {SERVICES.map((entry) => {
                            const active = serviceSlug === entry.slug;
                            return (
                              <button
                                key={entry.slug}
                                type="button"
                                onClick={() => setServiceSlug(entry.slug)}
                                className={cn(
                                  "flex items-center justify-between gap-3 border px-3 py-3 text-left transition-all duration-300",
                                  active
                                    ? "border-gold/60 bg-gold/[0.06]"
                                    : "border-line hover:border-porcelain/20"
                                )}
                                aria-pressed={active}
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  <span
                                    className={cn(
                                      "flex h-4 w-4 shrink-0 items-center justify-center border",
                                      active
                                        ? "border-gold bg-gold text-carbon"
                                        : "border-line"
                                    )}
                                  >
                                    {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                                  </span>
                                  <span className="min-w-0">
                                    <span className="block truncate text-[12px] font-medium text-porcelain">
                                      {entry.shortName}
                                    </span>
                                    <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.14em] text-ash">
                                      {entry.category}
                                    </span>
                                  </span>
                                </span>
                                <span className="shrink-0 font-mono text-[9px] text-porcelain/60">
                                  {formatUSD(entry.fromPrice)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                            Vehicle class
                          </p>
                          <div className="space-y-1.5">
                            {VEHICLE_TYPES.map((entry) => {
                              const active = vehicleType === entry.value;
                              return (
                                <button
                                  key={entry.value}
                                  type="button"
                                  onClick={() => setVehicleType(entry.value)}
                                  className={cn(
                                    "flex w-full items-center justify-between gap-2 border px-3 py-2.5 text-left transition-all duration-300",
                                    active
                                      ? "border-gold/60 bg-gold/[0.06]"
                                      : "border-line hover:border-porcelain/20"
                                  )}
                                  aria-pressed={active}
                                >
                                  <span>
                                    <span className="block text-[11px] font-medium text-porcelain">
                                      {entry.label}
                                    </span>
                                    <span className="mt-0.5 block text-[9px] font-light text-ash">
                                      {entry.note}
                                    </span>
                                  </span>
                                  <span
                                    className={cn(
                                      "h-3.5 w-3.5 shrink-0 rounded-full border",
                                      active ? "border-gold bg-gold" : "border-line"
                                    )}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                            Additions
                          </p>
                          <div className="space-y-1.5">
                            {ADD_ONS.map((addOn) => {
                              const active = addOns.includes(addOn.id);
                              return (
                                <button
                                  key={addOn.id}
                                  type="button"
                                  onClick={() => toggleAddOn(addOn.id)}
                                  className={cn(
                                    "flex w-full items-center justify-between gap-2 border px-3 py-2.5 text-left transition-all duration-300",
                                    active
                                      ? "border-gold/50 bg-gold/[0.05]"
                                      : "border-line hover:border-porcelain/20"
                                  )}
                                  aria-pressed={active}
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "flex h-3.5 w-3.5 items-center justify-center border",
                                        active
                                          ? "border-gold bg-gold text-carbon"
                                          : "border-line"
                                      )}
                                    >
                                      {active && <Check className="h-2 w-2" strokeWidth={3} />}
                                    </span>
                                    <span>
                                      <span className="block text-[11px] font-medium text-porcelain">
                                        {addOn.label}
                                      </span>
                                      <span className="mt-0.5 block text-[9px] font-light text-ash">
                                        {addOn.note}
                                      </span>
                                    </span>
                                  </span>
                                  <span className="shrink-0 font-mono text-[8px] text-gold">
                                    +{formatUSD(addOn.price)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                          Studio
                        </p>
                        <div className="grid gap-1.5 sm:grid-cols-2">
                          {LOCATIONS.map((entry) => {
                            const active = locationSlug === entry.slug;
                            return (
                              <button
                                key={entry.slug}
                                type="button"
                                onClick={() => setLocationSlug(entry.slug)}
                                className={cn(
                                  "flex items-start gap-2.5 border px-3 py-3 text-left transition-all duration-300",
                                  active
                                    ? "border-gold/60 bg-gold/[0.06]"
                                    : "border-line hover:border-porcelain/20"
                                )}
                                aria-pressed={active}
                              >
                                <MapPin
                                  className={cn(
                                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                                    active ? "text-gold" : "text-ash-dim"
                                  )}
                                  strokeWidth={1.4}
                                />
                                <span>
                                  <span className="block text-[11px] font-medium text-porcelain">
                                    {entry.shortName}
                                  </span>
                                  <span className="mt-0.5 block font-mono text-[7px] uppercase tracking-[0.12em] text-ash">
                                    {entry.address}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p className="eyebrow">Step 02 — Time</p>
                      <h2 className="mt-2 text-2xl font-light text-porcelain">
                        Choose a drop-off slot.
                      </h2>
                      <p className="mt-1.5 max-w-lg text-[12px] font-light leading-relaxed text-ash">
                        {location.shortName} · all times Eastern. Multi-day builds keep the bay for
                        the full duration — the drop-off slot is when the inspection begins.
                      </p>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="border border-line bg-carbon/40 p-4">
                          <div className="flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setMonthCursor(
                                  (current) =>
                                    new Date(current.getFullYear(), current.getMonth() - 1, 1)
                                )
                              }
                              disabled={!canPrevMonth}
                              className="flex h-7 w-7 items-center justify-center border border-line text-ash transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-30"
                              aria-label="Previous month"
                            >
                              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-porcelain">
                              {new Intl.DateTimeFormat("en-US", {
                                month: "long",
                                year: "numeric"
                              }).format(monthCursor)}
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                setMonthCursor(
                                  (current) =>
                                    new Date(current.getFullYear(), current.getMonth() + 1, 1)
                                )
                              }
                              disabled={!canNextMonth}
                              className="flex h-7 w-7 items-center justify-center border border-line text-ash transition-colors hover:border-gold/40 hover:text-gold disabled:opacity-30"
                              aria-label="Next month"
                            >
                              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                              <span
                                key={`${day}-${index}`}
                                className="font-mono text-[7px] uppercase tracking-[0.1em] text-ash-dim"
                              >
                                {day}
                              </span>
                            ))}
                            {calendarDays.map((value, index) => {
                              if (!value) return <span key={`empty-${index}`} />;
                              const iso = toISODate(value);
                              const disabled = isDisabledDate(value);
                              const selected = date === iso;
                              return (
                                <button
                                  key={iso}
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => {
                                    setDate(iso);
                                    setTime("");
                                  }}
                                  className={cn(
                                    "flex aspect-square items-center justify-center border font-mono text-[10px] transition-colors",
                                    selected
                                      ? "border-gold bg-gold text-carbon"
                                      : disabled
                                        ? "cursor-not-allowed border-transparent text-ash-dim/30"
                                        : "border-transparent text-porcelain/70 hover:border-gold/40 hover:text-gold"
                                  )}
                                  aria-pressed={selected}
                                  aria-label={formatLongDate(iso)}
                                >
                                  {value.getDate()}
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-line pt-2 font-mono text-[7px] uppercase tracking-[0.12em] text-ash-dim">
                            <span>Sun closed</span>
                            <span>60-day window</span>
                          </div>
                        </div>

                        <div className="border border-line bg-carbon/40 p-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                              {date ? formatLongDate(date) : "Select a date"}
                            </p>
                          </div>

                          <div className="mt-4">
                            {!date && (
                              <p className="border border-line px-3 py-4 text-[11px] font-light leading-relaxed text-ash-dim">
                                Choose a date on the calendar to see live drop-off availability.
                              </p>
                            )}

                            {date && availabilityState === "loading" && (
                              <div className="grid grid-cols-3 gap-1.5">
                                {Array.from({ length: 9 }).map((_, index) => (
                                  <span
                                    key={index}
                                    className="h-9 animate-pulse border border-line bg-carbon/60"
                                  />
                                ))}
                              </div>
                            )}

                            {date && availabilityState === "error" && (
                              <div className="border border-[#a8473a]/40 bg-[#a8473a]/10 px-3 py-3">
                                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#e0a196]">
                                  Availability unavailable.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const current = date;
                                    setDate("");
                                    window.setTimeout(() => setDate(current), 50);
                                  }}
                                  className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-gold"
                                >
                                  Retry
                                </button>
                              </div>
                            )}

                            {date && availabilityState === "idle" && availability?.closed && (
                              <p className="border border-line px-3 py-4 text-[11px] font-light leading-relaxed text-ash-dim">
                                The studio is closed on Sundays. Choose Monday through Saturday.
                              </p>
                            )}

                            {date && availabilityState === "idle" && availability && !availability.closed && (
                              <div className="grid grid-cols-3 gap-1.5">
                                {availability.slots.map((slot) => {
                                  const selected = time === slot.value;
                                  return (
                                    <button
                                      key={slot.value}
                                      type="button"
                                      disabled={!slot.available}
                                      onClick={() => setTime(slot.value)}
                                      className={cn(
                                        "border py-2.5 font-mono text-[9px] uppercase tracking-[0.08em] transition-colors",
                                        selected
                                          ? "border-gold bg-gold text-carbon"
                                          : slot.available
                                            ? "border-line text-porcelain/75 hover:border-gold/40 hover:text-gold"
                                            : "cursor-not-allowed border-line/50 text-ash-dim/35 line-through"
                                      )}
                                      aria-pressed={selected}
                                    >
                                      {slot.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex items-start gap-2 border-t border-line pt-3 text-[10px] font-light leading-relaxed text-ash-dim">
                            <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.5} />
                            Slots are held for 30 minutes while you complete the deposit. One vehicle
                            per slot.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p className="eyebrow">Step 03 — Details</p>
                      <h2 className="mt-2 text-2xl font-light text-porcelain">
                        Who is dropping off the car?
                      </h2>
                      <p className="mt-1.5 max-w-lg text-[12px] font-light leading-relaxed text-ash">
                        We use these details for the build sheet, the pre-inspection call and the
                        warranty registration. No marketing list.
                      </p>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <label className="block sm:col-span-2">
                          <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                            Full name
                          </span>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ash-dim" strokeWidth={1.4} />
                            <input
                              type="text"
                              autoComplete="name"
                              value={customer.name}
                              onChange={(event) => updateCustomer("name", event.target.value)}
                              className="form-field pl-9"
                              placeholder="First and last name"
                              required
                            />
                          </div>
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                            Email
                          </span>
                          <input
                            type="email"
                            autoComplete="email"
                            value={customer.email}
                            onChange={(event) => updateCustomer("email", event.target.value)}
                            className="form-field"
                            placeholder="you@domain.com"
                            required
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                            Phone
                          </span>
                          <input
                            type="tel"
                            autoComplete="tel"
                            value={customer.phone}
                            onChange={(event) => updateCustomer("phone", event.target.value)}
                            className="form-field"
                            placeholder="(248) 000-0000"
                            required
                          />
                        </label>

                        <div className="sm:col-span-2">
                          <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                            Vehicle
                          </p>
                          <div className="grid gap-3 sm:grid-cols-[100px_1fr_1fr]">
                            <label className="block">
                              <span className="mb-1.5 block font-mono text-[7px] uppercase tracking-[0.16em] text-ash-dim">
                                Year
                              </span>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={1900}
                                max={new Date().getFullYear() + 1}
                                value={customer.year}
                                onChange={(event) => updateCustomer("year", event.target.value)}
                                className="form-field"
                                placeholder="2024"
                                required
                              />
                            </label>
                            <label className="block">
                              <span className="mb-1.5 block font-mono text-[7px] uppercase tracking-[0.16em] text-ash-dim">
                                Make
                              </span>
                              <input
                                type="text"
                                autoComplete="off"
                                value={customer.make}
                                onChange={(event) => updateCustomer("make", event.target.value)}
                                className="form-field"
                                placeholder="Porsche"
                                required
                              />
                            </label>
                            <label className="block">
                              <span className="mb-1.5 block font-mono text-[7px] uppercase tracking-[0.16em] text-ash-dim">
                                Model
                              </span>
                              <input
                                type="text"
                                autoComplete="off"
                                value={customer.model}
                                onChange={(event) => updateCustomer("model", event.target.value)}
                                className="form-field"
                                placeholder="911 Turbo S"
                                required
                              />
                            </label>
                          </div>
                        </div>

                        <label className="block sm:col-span-2">
                          <span className="mb-1.5 block font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                            Notes for the build
                          </span>
                          <textarea
                            rows={4}
                            value={customer.notes}
                            onChange={(event) => updateCustomer("notes", event.target.value)}
                            className="form-field resize-none"
                            placeholder="Existing film, paint concerns, modifications, delivery constraints…"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex items-start gap-2 border border-line bg-carbon/40 px-3 py-2.5 text-[10px] font-light leading-relaxed text-ash-dim">
                        <Lock className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.5} />
                        Your details are used only to prepare and confirm this booking. We do not
                        sell or share customer data.
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -14 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p className="eyebrow">Step 04 — Deposit</p>
                      <h2 className="mt-2 text-2xl font-light text-porcelain">
                        Hold the bay with $100.
                      </h2>
                      <p className="mt-1.5 max-w-lg text-[12px] font-light leading-relaxed text-ash">
                        The deposit is credited in full against the final invoice. The balance is
                        due at collection, after the delivery inspection.
                      </p>

                      {!clientSecret ? (
                        <>
                          <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <div className="border border-gold/20 bg-gold/[0.04] p-4">
                              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                                Due today
                              </p>
                              <p className="mt-2 display text-4xl leading-none text-gold">$100</p>
                              <p className="mt-2 text-[10px] font-light leading-relaxed text-ash">
                                Credited to the final invoice. Refundable up to 72 hours before the
                                appointment.
                              </p>
                            </div>
                            <div className="border border-line bg-carbon/40 p-4">
                              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                                Balance after build
                              </p>
                              <p className="mt-2 display text-4xl leading-none text-porcelain">
                                {formatUSD(Math.max(0, quote.total - 100))}
                              </p>
                              <p className="mt-2 text-[10px] font-light leading-relaxed text-ash">
                                Final invoice may adjust after paint-depth inspection.
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 border border-line bg-carbon/40 p-4">
                            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
                              What happens next
                            </p>
                            <ol className="mt-3 space-y-2.5">
                              {[
                                "Stripe confirms the deposit and we issue a reference.",
                                "We call within one business day to confirm the build plan.",
                                "Drop off at the selected studio — inspection first, keys after.",
                                "Collect the car after cure and the delivery walkthrough."
                              ].map((item, index) => (
                                <li key={item} className="flex gap-3 text-[11px] font-light leading-relaxed text-ash">
                                  <span className="font-mono text-[8px] text-gold">0{index + 1}</span>
                                  {item}
                                </li>
                              ))}
                            </ol>
                          </div>

                          {error && (
                            <p className="mt-4 border border-[#a8473a]/40 bg-[#a8473a]/10 px-3 py-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[#e0a196]">
                              {error}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={startCheckout}
                            disabled={submitting}
                            className="mt-5 flex w-full items-center justify-center gap-3 bg-gold px-6 py-4 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-carbon transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-50 clip-notch-sm"
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.8} />
                                Holding your slot
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4" strokeWidth={1.5} />
                                Continue to secure deposit
                              </>
                            )}
                          </button>

                          <p className="mt-3 flex items-start gap-2 text-[10px] font-light leading-relaxed text-ash-dim">
                            <Lock className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.5} />
                            Secure checkout by Stripe. Card details never touch our servers. Demo
                            mode is active until production keys are configured.
                          </p>
                        </>
                      ) : (
                        <>
                          {stripePromise ? (
                            <Elements
                              stripe={stripePromise}
                              options={{ clientSecret, appearance }}
                            >
                              <PaymentForm
                                reference={reference}
                                onConfirmed={() =>
                                  router.push(`/book/success?ref=${reference}`)
                                }
                              />
                            </Elements>
                          ) : (
                            <p className="mt-6 border border-[#a8473a]/40 bg-[#a8473a]/10 px-3 py-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-[#e0a196]">
                              Stripe publishable key is missing. Add
                              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and reload.
                            </p>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-4 md:px-6">
                <button
                  type="button"
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                  disabled={step === 1}
                  className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ash transition-colors hover:text-porcelain disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Back
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep((current) => Math.min(4, current + 1))}
                    disabled={
                      (step === 2 && (!date || !time)) ||
                      (step === 3 && !detailsValid)
                    }
                    className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash-dim">
                    <ShieldCheck className="h-3 w-3 text-gold/70" strokeWidth={1.4} />
                    Stripe secured
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ash-dim">
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-gold" /> No booking fee
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-gold" /> Deposit credited
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-gold" /> 30-minute hold
              </span>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="glass relative overflow-hidden border-gold/20">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <span className="eyebrow text-gold">Build summary</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                    MCAS / Live
                  </span>
                </div>

                <div className="px-5 py-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
                    {vehicleLabel} / {service.category}
                  </p>
                  <h3 className="mt-1.5 text-lg font-light leading-tight text-porcelain">
                    {service.shortName}
                  </h3>

                  <div className="mt-5 flex items-end gap-1">
                    <span className="font-display text-2xl text-gold">$</span>
                    <span className="display text-5xl leading-none text-porcelain">
                      {formatUSD(quote.total).replace("$", "")}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                    Estimated build total
                  </p>

                  <div className="mt-5 space-y-2 border-t border-line pt-4 text-[11px] font-light">
                    <div className="flex items-center justify-between gap-3 text-ash">
                      <span>Base — {service.shortName}</span>
                      <span className="font-mono text-porcelain">{formatUSD(quote.base)}</span>
                    </div>
                    {quote.addOns.map((addOn) => (
                      <div key={addOn.id} className="flex items-center justify-between gap-3 text-ash">
                        <span>{addOn.label}</span>
                        <span className="font-mono text-porcelain">+{formatUSD(addOn.amount)}</span>
                      </div>
                    ))}
                    {quote.addOns.length === 0 && (
                      <div className="flex items-center justify-between gap-3 text-ash-dim">
                        <span>No add-ons</span>
                        <span className="font-mono">—</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 space-y-3 border-t border-line pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                        Studio
                      </span>
                      <span className="text-right text-[11px] font-light text-porcelain/80">
                        {location.shortName}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                        Drop-off
                      </span>
                      <span className="text-right text-[11px] font-light text-porcelain/80">
                        {date ? formatLongDate(date) : "Not selected"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                        Time
                      </span>
                      <span className="text-right text-[11px] font-light text-porcelain/80">
                        {time ? formatSlot(time) : "Not selected"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                        Deposit today
                      </p>
                      <p className="mt-1 font-mono text-sm text-gold">$100</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                        Balance
                      </p>
                      <p className="mt-1 font-mono text-sm text-porcelain/80">
                        {formatUSD(Math.max(0, quote.total - 100))}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-line pt-4">
                    <p className="flex items-start gap-2 text-[10px] font-light leading-relaxed text-ash-dim">
                      <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-gold/70" strokeWidth={1.5} />
                      Estimate only. Final build sheet issued after inspection. Deposit refundable
                      up to 72 hours before the appointment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border border-line bg-carbon/40 px-4 py-3">
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-ash-dim">
                  Prefer to talk it through?
                </span>
                <a
                  href="tel:+12482886772"
                  className="link-line font-mono text-[8px] uppercase tracking-[0.16em] text-gold"
                >
                  (248) 288-6772
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
