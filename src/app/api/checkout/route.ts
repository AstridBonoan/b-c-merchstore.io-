import { NextResponse } from "next/server";
import { z } from "zod";
import { getSeedProductById } from "@/lib/products/seed-data";
import { canAddToCart } from "@/lib/products/inventory";
import { createCheckoutSession } from "@/lib/stripe/checkout";
import { getSiteUrl } from "@/lib/utils";

export const runtime = "nodejs";

const bodySchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  shipping: z
    .object({
      fullName: z.string().optional(),
      line1: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  lines: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

/**
 * Creates a Stripe Checkout Session for non-static deployments.
 * Unavailable on GitHub Pages (static export) — the client falls back to demo payment.
 */
export async function POST(request: Request) {
  if (
    process.env.STATIC_EXPORT === "true" ||
    process.env.GITHUB_PAGES === "true"
  ) {
    return NextResponse.json(
      { error: "Stripe checkout API is unavailable on static hosting." },
      { status: 404 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout payload.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const checkoutLines = [];
  for (const line of parsed.data.lines) {
    const product = getSeedProductById(line.productId);
    const variant = product?.variants?.find((v) => v.id === line.variantId);
    if (!product?.is_active || !variant?.is_active) {
      return NextResponse.json(
        { error: "One or more products are unavailable." },
        { status: 400 },
      );
    }
    const stock = canAddToCart(variant.inventory_quantity, line.quantity);
    if (!stock.allowed) {
      return NextResponse.json(
        { error: stock.error ?? "Insufficient inventory." },
        { status: 400 },
      );
    }
    const image =
      product.images?.find((img) => img.is_primary) ?? product.images?.[0];
    checkoutLines.push({
      productId: product.id,
      variantId: variant.id,
      name: `${product.name} (${variant.color}/${variant.size})`,
      description: product.description.slice(0, 200),
      imageUrl: image?.url,
      unitPriceCents: variant.price_cents ?? product.price_cents,
      quantity: line.quantity,
    });
  }

  const siteUrl = getSiteUrl();
  const result = await createCheckoutSession({
    lines: checkoutLines,
    customerEmail: parsed.data.email,
    successUrl: `${siteUrl}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/checkout/cancel/`,
    metadata: {
      customer_name: parsed.data.fullName ?? "",
      notes: parsed.data.notes ?? "",
    },
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }

  return NextResponse.json({ sessionId: result.sessionId, url: result.url });
}
