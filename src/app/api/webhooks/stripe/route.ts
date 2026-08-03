import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe/server";

/**
 * In-memory idempotency set for processed Stripe event IDs.
 * In production, persist processed event IDs in Supabase to survive restarts.
 */
const processedEvents = new Set<string>();

/**
 * Stripe webhook endpoint.
 * Verifies signatures, handles checkout.session.completed idempotently,
 * and is safe in demo mode when Stripe is not configured.
 */
export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || webhookSecret.includes("your-webhook")) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Stripe webhooks are not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { ok: false, error: "Missing stripe-signature header." },
      { status: 400 },
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  if (processedEvents.has(event.id)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Production: create/update order in Supabase, decrement inventory,
        // and mark the Stripe session as fulfilled.
        console.info("[stripe webhook] checkout.session.completed", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
          email: session.customer_email,
          amountTotal: session.amount_total,
        });
        break;
      }
      case "checkout.session.expired":
      case "payment_intent.payment_failed": {
        const obj = event.data.object as { id?: string };
        console.info(`[stripe webhook] ${event.type}`, { id: obj.id });
        break;
      }
      default:
        break;
    }

    processedEvents.add(event.id);
    return NextResponse.json({ ok: true, received: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Webhook handler failed." },
      { status: 500 },
    );
  }
}
