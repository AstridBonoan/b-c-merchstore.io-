import Stripe from "stripe";

let stripe: Stripe | null | undefined;

/**
 * Server-side Stripe SDK instance.
 * Returns null when STRIPE_SECRET_KEY is not configured.
 */
export function getStripeServer(): Stripe | null {
  if (stripe !== undefined) {
    return stripe;
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("your-secret")) {
    stripe = null;
    return stripe;
  }

  stripe = new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
    typescript: true,
  });
  return stripe;
}
