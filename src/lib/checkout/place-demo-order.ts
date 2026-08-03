import type { AddressSnapshot, CartLine, Order, OrderItem } from "@/types";
import type { CheckoutInput } from "@/lib/validation/schemas";
import { summarizeCart } from "@/lib/cart/calculations";
import { getSeedProductById } from "@/lib/products/seed-data";
import { canAddToCart } from "@/lib/products/inventory";
import { savePlacedOrder } from "@/lib/orders/local-orders";

export type ValidatedCheckoutLine = CartLine & { unitPriceCents: number };

export type PlaceDemoOrderResult =
  | { ok: true; order: Order }
  | { ok: false; error: string };

function toAddress(
  shipping: CheckoutInput["shipping"],
  fallbackName: string,
): AddressSnapshot {
  return {
    full_name: shipping.fullName || fallbackName,
    line1: shipping.line1,
    line2: shipping.line2 || null,
    city: shipping.city,
    state: shipping.state,
    postal_code: shipping.postalCode,
    country: shipping.country,
    phone: shipping.phone || null,
  };
}

export function validateCheckoutLines(
  lines: CartLine[],
): { ok: true; lines: ValidatedCheckoutLine[] } | { ok: false; error: string } {
  const validated: ValidatedCheckoutLine[] = [];

  for (const line of lines) {
    const product = getSeedProductById(line.productId);
    const variant = product?.variants?.find((v) => v.id === line.variantId);
    if (!product?.is_active || !variant?.is_active) {
      return { ok: false, error: "One or more products are unavailable." };
    }
    const stock = canAddToCart(variant.inventory_quantity, line.quantity);
    if (!stock.allowed) {
      return { ok: false, error: stock.error ?? "Insufficient inventory." };
    }
    validated.push({
      ...line,
      unitPriceCents: variant.price_cents ?? product.price_cents,
    });
  }

  if (!validated.length) {
    return { ok: false, error: "Cart is empty." };
  }

  return { ok: true, lines: validated };
}

export function placeDemoOrder(params: {
  checkout: CheckoutInput;
  lines: CartLine[];
  sessionId: string;
  paymentIntentId?: string;
}): PlaceDemoOrderResult {
  const validated = validateCheckoutLines(params.lines);
  if (!validated.ok) return validated;

  const summary = summarizeCart(validated.lines);
  const now = new Date().toISOString();
  const orderId = `ord-${params.sessionId.replace(/^demo_/, "").slice(0, 12)}`;
  const shipping = toAddress(params.checkout.shipping, params.checkout.fullName);
  const billing =
    params.checkout.billingSameAsShipping || !params.checkout.billing
      ? shipping
      : toAddress(params.checkout.billing, params.checkout.fullName);

  const items: OrderItem[] = validated.lines.map((line, index) => {
    const product = getSeedProductById(line.productId);
    const variant = product?.variants?.find((v) => v.id === line.variantId);
    return {
      id: `${orderId}-item-${index + 1}`,
      order_id: orderId,
      product_id: line.productId,
      variant_id: line.variantId,
      product_name: line.name,
      product_slug: line.slug,
      sku: variant?.sku ?? "DEMO",
      size: line.size,
      color: line.color,
      quantity: line.quantity,
      unit_price_cents: line.unitPriceCents,
      line_total_cents: line.unitPriceCents * line.quantity,
      image_url: line.imageUrl || null,
      created_at: now,
    };
  });

  const order: Order = {
    id: orderId,
    user_id: null,
    email: params.checkout.email.trim().toLowerCase(),
    status: "paid",
    subtotal_cents: summary.subtotalCents,
    tax_cents: summary.taxCents,
    shipping_cents: summary.shippingCents,
    total_cents: summary.totalCents,
    currency: "USD",
    stripe_checkout_session_id: params.sessionId,
    stripe_payment_intent_id: params.paymentIntentId ?? `pi_demo_${orderId}`,
    shipping_address: shipping,
    billing_address: billing,
    notes: params.checkout.notes?.trim() || null,
    created_at: now,
    updated_at: now,
    items,
  };

  savePlacedOrder(order);
  return { ok: true, order };
}
