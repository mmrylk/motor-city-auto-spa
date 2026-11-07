import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarPlus,
  Check,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/booking/print-button";
import { confirmBooking, getBookingView } from "@/lib/bookings";
import { confirmServiceDeposit, getServiceDeposit } from "@/lib/deposits";
import { buildQuote } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe/server";
import {
  SITE,
  locationBySlug,
  serviceBySlug,
  type VehicleType
} from "@/lib/site";
import { formatLongDate, formatSlot, formatUSD, parseISODate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reservation Confirmed",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function paramValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : "";
}

function calendarStamp(dateISO: string, time: string, addHours = 0) {
  const value = parseISODate(dateISO);
  const [hour, minute] = time.split(":").map(Number);
  value.setHours(hour, minute + addHours * 60, 0, 0);
  const pad = (input: number) => String(input).padStart(2, "0");
  return `${value.getFullYear()}${pad(value.getMonth() + 1)}${pad(value.getDate())}T${pad(
    value.getHours()
  )}${pad(value.getMinutes())}00`;
}

function googleCalendarUrl(input: {
  serviceName: string;
  date: string;
  time: string;
  location: string;
  reference: string;
}) {
  const start = calendarStamp(input.date, input.time);
  const end = calendarStamp(input.date, input.time, 2);
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: `${input.serviceName} — Motor City Auto Spa`,
    dates: `${start}/${end}`,
    details: `Reservation ${input.reference}. Arrive at the studio for the inspection walkaround. The $100 deposit is credited to the final invoice.`,
    location: input.location
  });
  return `https://calendar.google.com/calendar/render?${query.toString()}`;
}

export default async function BookingSuccessPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const demo = paramValue(params.demo) === "1";
  const sessionId = paramValue(params.session_id);
  let reference = paramValue(params.ref);

  const stripe = getStripe();

  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        if (session.metadata?.kind === "service-deposit") {
          const depositReference = session.metadata.depositReference;
          if (depositReference) {
            await confirmServiceDeposit(depositReference, session.id);
            reference = reference || depositReference;
          }
        } else {
          const bookingReference =
            session.metadata?.reference ?? session.client_reference_id ?? "";
          if (bookingReference) {
            await confirmBooking(bookingReference, {
              paymentStatus: "DEPOSIT_PAID",
              checkoutId: session.id
            });
            reference = reference || bookingReference;
          }
        }
      }
    } catch (error) {
      console.error("[success] unable to verify checkout session", error);
    }
  }

  let booking = reference ? await getBookingView(reference) : null;

  if (booking && demo) {
    await confirmBooking(reference, { paymentStatus: "DEPOSIT_PAID" });
    booking = await getBookingView(reference);
  }

  const deposit = !booking && reference ? await getServiceDeposit(reference) : null;

  if (deposit && demo) {
    await confirmServiceDeposit(reference);
  }

  const confirmedBooking = booking;
  const confirmedDeposit = deposit;
  const found = Boolean(confirmedBooking || confirmedDeposit);

  if (!found) {
    return (
      <section className="relative min-h-[80vh] overflow-hidden bg-carbon pt-[calc(var(--header-h)+4rem)]">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-25" />
        <div className="shell relative max-w-3xl py-16">
          <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-gold">
            Reservation lookup
          </p>
          <h1 className="display mt-4 text-display-sm">
            We could not find
            <br />
            <span className="text-outline">that reservation.</span>
          </h1>
          <p className="prose-lux mt-5 max-w-xl">
            The reference may have expired, or the payment was not completed. Call the studio with
            the name on the booking and we will locate it manually.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={SITE.phoneHref} variant="gold" icon={false}>
              Call {SITE.phone}
            </Button>
            <Button href="/book" variant="outline">
              Start a new booking
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
            <a href={SITE.emailHref} className="transition-colors hover:text-gold">
              {SITE.email}
            </a>
            <Link href="/" className="transition-colors hover:text-gold">
              Return home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const bookingQuote = confirmedBooking
    ? buildQuote(
        confirmedBooking.serviceSlug,
        confirmedBooking.vehicleType as VehicleType,
        confirmedBooking.addOns
      )
    : null;
  const depositService = confirmedDeposit ? serviceBySlug(confirmedDeposit.serviceSlug) : null;
  const depositLocation = confirmedDeposit ? locationBySlug(confirmedDeposit.locationSlug) : null;

  return (
    <section className="relative min-h-screen overflow-hidden bg-carbon pt-[calc(var(--header-h)+3rem)]">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[560px] w-[560px] rounded-full bg-gold/[0.06] blur-[150px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-olive/20 blur-[130px]" />

      <div className="shell relative max-w-6xl py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 border border-gold/40 bg-gold/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-gold">
            <Check className="h-3 w-3" strokeWidth={2.5} />
            {confirmedBooking
              ? confirmedBooking.paymentStatus === "DEPOSIT_PAID"
                ? "Deposit paid"
                : "Reservation held"
              : "Deposit recorded"}
          </span>
          {demo && (
            <span className="border border-line px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-ash">
              Demo mode — no card charged
            </span>
          )}
        </div>

        <h1 className="display mt-6 text-[clamp(2.8rem,7.5vw,7rem)] text-porcelain">
          {confirmedBooking ? "The bay is held." : "Deposit recorded."}
        </h1>
        <p className="prose-lux mt-5 max-w-2xl text-pretty">
          {confirmedBooking
            ? "Your slot is reserved and the deposit is credited to the final invoice. We will call within one business day to confirm the build plan and answer any questions before drop-off."
            : "Your service deposit is recorded. We will call within one business day to schedule the drop-off and issue a written build sheet."}
        </p>

        <div className="mt-8 inline-flex flex-col gap-1 border border-gold/25 bg-gold/[0.04] px-4 py-3">
          <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-ash-dim">
            Reservation reference
          </span>
          <span className="font-mono text-lg tracking-[0.14em] text-gold">
            {confirmedBooking?.reference ?? confirmedDeposit?.reference}
          </span>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="border border-line bg-slate-deep/70">
              <div className="border-b border-line px-5 py-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                  {confirmedBooking ? "Build details" : "Deposit details"}
                </p>
              </div>
              <div className="p-5">
                {confirmedBooking ? (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-light text-porcelain">
                          {confirmedBooking.serviceName}
                        </h2>
                        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                          {confirmedBooking.vehicleYear} {confirmedBooking.vehicleMake}{" "}
                          {confirmedBooking.vehicleModel}
                        </p>
                      </div>
                      <span className="border border-line px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-porcelain/70">
                        {confirmedBooking.vehicleType}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                        <div>
                          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                            Studio
                          </p>
                          <p className="mt-1 text-[12px] font-light leading-relaxed text-porcelain/85">
                            {confirmedBooking.locationName}
                            <br />
                            {confirmedBooking.locationAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                        <div>
                          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                            Drop-off
                          </p>
                          <p className="mt-1 text-[12px] font-light leading-relaxed text-porcelain/85">
                            {formatLongDate(confirmedBooking.date)}
                            <br />
                            {confirmedBooking.timeLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    {confirmedBooking.addOns.length > 0 && (
                      <div className="mt-5 border-t border-line pt-4">
                        <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                          Additions
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {confirmedBooking.addOns.map((addOn) => (
                            <span
                              key={addOn}
                              className="border border-line px-2 py-1 font-mono text-[7px] uppercase tracking-[0.12em] text-porcelain/65"
                            >
                              {addOn.replaceAll("-", " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                      <div>
                        <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                          Estimated build
                        </p>
                        <p className="mt-1 font-display text-2xl text-porcelain">
                          {formatUSD(bookingQuote?.total ?? 0)}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                          Deposit paid
                        </p>
                        <p className="mt-1 font-display text-2xl text-gold">
                          {formatUSD(confirmedBooking.depositAmount, { cents: true })}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-light text-porcelain">
                          {depositService?.name}
                        </h2>
                        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-ash">
                          {depositService?.category}
                        </p>
                      </div>
                      <span className="border border-line px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-porcelain/70">
                        Deposit
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                        <div>
                          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                            Preferred studio
                          </p>
                          <p className="mt-1 text-[12px] font-light leading-relaxed text-porcelain/85">
                            {depositLocation?.shortName}
                            <br />
                            {depositLocation?.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                        <div>
                          <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-ash-dim">
                            Deposit
                          </p>
                          <p className="mt-1 text-[12px] font-light leading-relaxed text-porcelain/85">
                            {formatUSD(confirmedDeposit?.amountCents ?? 10000, { cents: true })}
                            <br />
                            Credited to final invoice
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-line pt-4">
                      <p className="text-[12px] font-light leading-relaxed text-ash">
                        The next step is a scheduling call. Have your preferred drop-off week and any
                        paint concerns ready — we will issue the build sheet before the car arrives.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border border-line bg-carbon/45 p-5">
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold">
                What happens next
              </p>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    title: "Confirmation call",
                    copy: "Within one business day. We confirm the build, the drop-off window and the expected collection date."
                  },
                  {
                    title: "Arrival inspection",
                    copy: "We photograph the car with you, note existing defects and map paint depth before intake."
                  },
                  {
                    title: "Build & handover",
                    copy: "One technician owns the work. You inspect the result under the same lights we used to build it."
                  }
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-gold/30 font-mono text-[8px] text-gold">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-[12px] font-medium text-porcelain">{item.title}</p>
                      <p className="mt-1 text-[11px] font-light leading-relaxed text-ash">
                        {item.copy}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 border-t border-line pt-4">
                <a
                  href={SITE.phoneHref}
                  className="flex items-center gap-2 text-sm font-light text-porcelain transition-colors hover:text-gold"
                >
                  <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                  {SITE.phone}
                </a>
                <a
                  href={SITE.emailHref}
                  className="mt-2 block break-all font-mono text-[8px] uppercase tracking-[0.14em] text-ash transition-colors hover:text-gold"
                >
                  {SITE.email}
                </a>
              </div>
            </div>

            <div className="mt-3 grid gap-2">
              {confirmedBooking && (
                <a
                  href={googleCalendarUrl({
                    serviceName: confirmedBooking.serviceName,
                    date: confirmedBooking.date,
                    time: confirmedBooking.time,
                    location: confirmedBooking.locationAddress,
                    reference: confirmedBooking.reference
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-gold/50 bg-gold/10 px-4 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/15"
                >
                  <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.4} />
                  Add drop-off to calendar
                </a>
              )}
              <PrintButton />
              <div className="grid grid-cols-2 gap-2">
                <Button href="/book" variant="outline" size="sm" icon={false}>
                  Book another
                </Button>
                <Button href="/" variant="ghost" size="sm" icon={false}>
                  Return home
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[10px] font-light leading-relaxed text-ash-dim">
            Keep this reference for any changes. Deposits are transferable once with 48 hours&apos;
            notice and refundable up to 72 hours before the appointment.
          </p>
          <Link
            href="/terms"
            className="group inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-gold"
          >
            Deposit terms
            <ArrowUpRight
              className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
