import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmBooking, getBookingView } from "@/lib/bookings";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { getStripe } from "@/lib/stripe/server";

export const dynamic = "force-dynamic";

const schema = z.object({
  reference: z.string().trim().min(4).max(40),
  paymentIntentId: z.string().trim().max(120).optional()
});

export async function POST(request: Request) {
  const limited = rateLimit(`confirm:${clientKey(request)}`, 12, 60_000);
  if (!limited.success) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid confirmation request." }, { status: 400 });
  }

  const stripe = getStripe();
  if (stripe) {
    if (!parsed.data.paymentIntentId) {
      return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });
    }
    try {
      const intent = await stripe.paymentIntents.retrieve(parsed.data.paymentIntentId);
      if (intent.status !== "succeeded") {
        return NextResponse.json({ error: "Payment has not completed." }, { status: 402 });
      }
      if (intent.metadata.reference !== parsed.data.reference) {
        return NextResponse.json({ error: "Payment reference mismatch." }, { status: 400 });
      }
      await confirmBooking(parsed.data.reference, {
        paymentStatus: "DEPOSIT_PAID",
        paymentIntentId: intent.id
      });
    } catch (error) {
      console.error("[confirm] stripe verification failed", error);
      return NextResponse.json({ error: "Unable to verify payment." }, { status: 502 });
    }
  } else {
    await confirmBooking(parsed.data.reference, { paymentStatus: "DEPOSIT_PAID" });
  }

  const booking = await getBookingView(parsed.data.reference);
  if (!booking) {
    return NextResponse.json({ error: "Reservation not found." }, { status: 404 });
  }

  return NextResponse.json({ booking });
}
