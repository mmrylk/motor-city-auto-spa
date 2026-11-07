import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { confirmBooking } from "@/lib/bookings";
import { confirmServiceDeposit } from "@/lib/deposits";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ received: true, skipped: "stripe-not-configured" });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("[stripe-webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const reference = intent.metadata.reference;
        if (reference) {
          await confirmBooking(reference, {
            paymentStatus: "DEPOSIT_PAID",
            paymentIntentId: intent.id
          });
        }
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.kind === "service-deposit") {
          const depositReference = session.metadata.depositReference;
          if (depositReference && session.payment_status === "paid") {
            await confirmServiceDeposit(depositReference, session.id);
          }
          break;
        }
        const reference = session.metadata?.reference ?? session.client_reference_id;
        if (reference && session.payment_status === "paid") {
          await confirmBooking(reference, {
            paymentStatus: "DEPOSIT_PAID",
            checkoutId: session.id
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("[stripe-webhook] handler failed", error);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
