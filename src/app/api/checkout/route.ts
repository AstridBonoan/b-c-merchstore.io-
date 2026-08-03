import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeedProductById } from "@/lib/products/seed-data";
import { canAddToCart } from "@/lib/products/inventory";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { getStripeServer } from "@/lib/stripe/server";
import { checkoutSchema } from "@/lib/validation/schemas";
import { getSiteUrl, isDemoMode } from "@/lib/utils";
import { summarizeCart } from "@/lib/cart/calculations";
import type { CartLine } from "@/types";

const requestSchema = z.object({
  customer: checkoutSchema,
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        variantId: z.string().min(1),
        quantity: z.number().int().positive().max(20),
      }),
    )
    .min(1, "Cart is empty."),
});

/**
 * Validates cart lines against canonical product data (never trusts client prices),
 * then creates a Stripe Checkout Session — or a demo success redirect when Stripe
 * is not configured.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Invalid checkout payload.",
      },
      { status: 400 },
    );
  }

  const validatedLines: CartLine[] = [];

  for (const line of parsed.data.lines) {
    const product = getSeedProductById(line.productId);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { ok: false, error: "One or more products are unavailable." },
        { status: 400 },
      );
    }

    const variant = product.variants?.find((v) => v.id === line.variantId);
    if (!variant || !variant.is_active) {
      return NextResponse.json(
        { ok: false, error: `Invalid variant for ${product.name}.` },
        { status: 400 },
      );
    }

    const stockCheck = canAddToCart(variant.inventory_quantity, line.quantity);
    if (!stockCheck.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error:
            stockCheck.error ??
            `${product.name} (${variant.color}/${variant.size}) is out of stock.`,
        },
        { status: 400 },
      );
    }

    const unitPriceCents = variant.price_cents ?? product.price_cents;
    const primaryImage =
      product.images?.find((img) => img.is_primary)?.url ??
      product.images?.[0]?.url ??
      "";

    validatedLines.push({
      productId: product.id,
      variantId: variant.id,
      quantity: line.quantity,
      name: product.name,
      slug: product.slug,
      imageUrl: primaryImage,
      size: variant.size,
      color: variant.color,
      unitPriceCents,
      maxQuantity: variant.inventory_quantity,
    });
  }

  const summary = summarizeCart(validatedLines);
  const siteUrl = getSiteUrl();
  const stripe = getStripeServer();

  // Demo / portfolio path — no Stripe secret configured
  if (!stripe || isDemoMode()) {
    const demoSessionId = `demo_${Date.now()}`;
    const params = new URLSearchParams({
      session_id: demoSessionId,
      email: parsed.data.customer.email,
      total: String(summary.totalCents),
      demo: "1",
    });
    return NextResponse.json({
      ok: true,
      demo: true,
      sessionId: demoSessionId,
      url: `${siteUrl}/checkout/success?${params.toString()}`,
    });
  }

  const result = await createCheckoutSession({
    lines: validatedLines.map((line) => ({
      productId: line.productId,
      variantId: line.variantId,
      name: `${line.name} — ${line.color} / ${line.size}`,
      imageUrl: line.imageUrl.startsWith("http")
        ? line.imageUrl
        : undefined,
      unitPriceCents: line.unitPriceCents,
      quantity: line.quantity,
    })),
    customerEmail: parsed.data.customer.email,
    metadata: {
      shipping_name: parsed.data.customer.shipping.fullName,
      shipping_city: parsed.data.customer.shipping.city,
      shipping_postal: parsed.data.customer.shipping.postalCode,
    },
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    demo: false,
    sessionId: result.sessionId,
    url: result.url,
  });
}
