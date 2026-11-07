import { NextResponse } from "next/server";
import { z } from "zod";
import {
  attachDepositSession,
  createServiceDeposit
} from "@/lib/deposits";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe/server";
import { SERVICES, locationBySlug, serviceBySlug } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

const schema = z.object({
  serviceSlug: z.string().trim().min(1),
  locationSlug: z.enum(["eleven-mile", "delemere"]).default("eleven-mile"),
  customerName: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(24)
    .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number")
});

export async function POST(request: Request) {
  const limited = rateLimit(`service-deposit:${clientKey(request)}`, 5, 60_000);
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  if (!SERVICES.some((service) => service.slug === data.serviceSlug)) {
    return NextResponse.json({ error: "Unknown service." }, { status: 400 });
  }

  const service = serviceBySlug(data.serviceSlug);
  const location = locationBySlug(data.locationSlug);

  const { reference } = await createServiceDeposit(data);
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json({
      demo: true,
      reference,
      amount: 10000,
      message:
        "Demo mode: no card was charged. In production this opens a secure Stripe Checkout for the $100 deposit."
    });
  }

  const origin = request.headers.get("origin") ?? absoluteUrl();

  try {
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
            unit_amount: 10000,
            product_data: {
              name: `${service.shortName} — Reservation Deposit`,
              description: `${location.shortName} · credited in full against the final invoice`
            }
          }
        }
      ],
      metadata: {
        kind: "service-deposit",
        depositReference: reference,
        serviceSlug: data.serviceSlug,
        locationSlug: data.locationSlug
      },
      success_url: `${origin}/services?deposit=success&ref=${reference}`,
      cancel_url: `${origin}/services?deposit=canceled&service=${data.serviceSlug}`
    });

    await attachDepositSession(reference, session.id);

    return NextResponse.json({ reference, url: session.url, amount: 10000 });
  } catch (error) {
    console.error("[service-deposit] stripe failed", error);
    return NextResponse.json(
      { error: "Unable to start the deposit checkout. Please try again." },
      { status: 502 }
    );
  }
}
