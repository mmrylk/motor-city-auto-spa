import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) {
    cached = new Stripe(key, {
      appInfo: { name: "Motor City Auto Spa", version: "1.0.0" },
      typescript: true
    });
  }
  return cached;
}

export const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
export const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
