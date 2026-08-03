import type { CartLine } from "@/types";
import { getSiteUrl } from "@/lib/utils";
import { getStripeServer } from "@/lib/stripe/server";
import { summarizeCart } from "@/lib/cart/calculations";

export type CheckoutLineInput = {
  productId: string;
  variantId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  unitPriceCents: number;
  quantity: number;
};

export type CreateCheckoutSessionParams = {
  lines: CheckoutLineInput[];
  customerEmail: string;
  userId?: string | null;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
};

export type CreateCheckoutSessionResult =
  | { ok: true; sessionId: string; url: string }
  | { ok: false; error: string };

/**
 * Creates a Stripe Checkout Session from validated cart lines.
 * Call only after server-side price/inventory validation.
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CreateCheckoutSessionResult> {
  const stripe = getStripeServer();
  if (!stripe) {
    return {
      ok: false,
      error: "Stripe is not configured. Set STRIPE_SECRET_KEY to enable checkout.",
    };
  }

  if (!params.lines.length) {
    return { ok: false, error: "Cart is empty." };
  }

  const siteUrl = getSiteUrl();
  const summary = summarizeCart(
    params.lines.map(
      (line): CartLine => ({
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity,
        name: line.name,
        slug: line.productId,
        imageUrl: line.imageUrl ?? "",
        size: "ONE_SIZE",
        color: "",
        unitPriceCents: line.unitPriceCents,
        maxQuantity: line.quantity,
      }),
    ),
  );

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: params.customerEmail,
      line_items: params.lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: line.unitPriceCents,
          product_data: {
            name: line.name,
            description: line.description,
            images: line.imageUrl ? [line.imageUrl] : undefined,
            metadata: {
              product_id: line.productId,
              variant_id: line.variantId,
            },
          },
        },
      })),
      success_url:
        params.successUrl ??
        `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl ?? `${siteUrl}/cart`,
      metadata: {
        user_id: params.userId ?? "",
        subtotal_cents: String(summary.subtotalCents),
        ...params.metadata,
      },
    });

    if (!session.id || !session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }

    return { ok: true, sessionId: session.id, url: session.url };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";
    return { ok: false, error: message };
  }
}
