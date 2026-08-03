/** Pure pricing helpers — amounts are integer cents unless noted. */

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD_CENTS = 7500;
export const FLAT_SHIPPING_CENTS = 599;

export function formatPrice(
  cents: number,
  currency = "USD",
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function calculateSubtotal(
  lines: Array<{ unitPriceCents: number; quantity: number }>,
): number {
  return lines.reduce(
    (sum, line) => sum + line.unitPriceCents * line.quantity,
    0,
  );
}

export function calculateTax(
  subtotalCents: number,
  taxRate: number = TAX_RATE,
): number {
  if (subtotalCents <= 0) return 0;
  return Math.round(subtotalCents * taxRate);
}

export function calculateShipping(
  subtotalCents: number,
  options?: {
    freeShippingThresholdCents?: number;
    flatShippingCents?: number;
  },
): number {
  if (subtotalCents <= 0) return 0;
  const threshold =
    options?.freeShippingThresholdCents ?? FREE_SHIPPING_THRESHOLD_CENTS;
  const flat = options?.flatShippingCents ?? FLAT_SHIPPING_CENTS;
  return subtotalCents >= threshold ? 0 : flat;
}

export function calculateTotal(
  subtotalCents: number,
  taxCents: number,
  shippingCents: number,
): number {
  return Math.max(0, subtotalCents + taxCents + shippingCents);
}

export function centsFromDollars(dollars: number): number {
  return Math.round(dollars * 100);
}
