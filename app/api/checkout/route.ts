import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAvailability } from "@/lib/availability";
import { attachCheckoutSession, attachPaymentIntent, cancelBookingRecord, createBookingRecord, SlotTakenError } from "@/lib/bookings";
import { buildQuote } from "@/lib/pricing";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe/server";
import { locationBySlug, serviceBySlug } from "@/lib/site";
import { absoluteUrl, formatSlot } from "@/lib/utils";
import { checkoutRequestSchema, firstZodError } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limited = rateLimit(`checkout:${clientKey(request)}`, 6, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter ?? 60) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
  }

  const data = parsed.data;
  const availability = await getAvailability(data.date, data.locationSlug);
  const slot = availability.slots.find((entry) => entry.value === data.time);
  if (!slot?.available) {
    return NextResponse.json(
      { error: "That time is no longer available. Please select another slot." },
      { status: 409 }
    );
  }

  const quote = buildQuote(data.serviceSlug, data.vehicleType, data.addOns);
  const service = serviceBySlug(data.serviceSlug);
  const location = locationBySlug(data.locationSlug);
  const origin = request.headers.get("origin") ?? absoluteUrl();

  let reference: string;
  try {
    const created = await createBookingRecord({
      serviceSlug: data.serviceSlug,
      vehicleType: data.vehicleType,
      locationSlug: data.locationSlug,
      date: data.date,
      time: data.time,
      addOns: data.addOns,
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      vehicleYear: data.vehicleYear,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      notes: data.notes
    });
    reference = created.reference;
  } catch (error) {
    if (error instanceof SlotTakenError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[checkout] booking create failed", error);
    return NextResponse.json({ error: "Unable to hold that slot. Please try again." }, { status: 500 });
  }

  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({
      demo: true,
      reference,
      amount: quote.depositCents,
      url: `/book/success?ref=${reference}&demo=1`
    });
  }

  const description = `${service.name} · ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel} · ${location.shortName} · ${data.date} ${formatSlot(data.time)}`;

  try {
    if (data.mode === "checkout-session") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: data.email,
        client_reference_id: reference,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: quote.depositCents,
              product_data: {
                name: `${service.shortName} — Reservation Deposit`,
                description
              }
            }
          }
        ],
        metadata: {
          reference,
          serviceSlug: data.serviceSlug,
          locationSlug: data.locationSlug,
          date: data.date,
          time: data.time
        },
        success_url: `${origin}/book/success?ref=${reference}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/book?canceled=1&service=${data.serviceSlug}`
      });

      await attachCheckoutSession(reference, session.id);

      return NextResponse.json({ reference, url: session.url, amount: quote.depositCents });
    }

    const intent = await stripe.paymentIntents.create({
      amount: quote.depositCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      receipt_email: data.email,
      description,
      metadata: {
        reference,
        serviceSlug: data.serviceSlug,
        locationSlug: data.locationSlug,
        date: data.date,
        time: data.time
      }
    });

    await attachPaymentIntent(reference, intent.id);

    return NextResponse.json({
      reference,
      clientSecret: intent.client_secret,
      amount: quote.depositCents
    });
  } catch (error) {
    await cancelBookingRecord(reference).catch(() => undefined);
    console.error("[checkout] stripe failed", error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: "Payment session could not be created. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
