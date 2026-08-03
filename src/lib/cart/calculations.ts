import type { CartLine, CartSummary } from "@/types";
import {
  calculateShipping,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "@/lib/products/pricing";

export function calculateLineTotal(line: CartLine): number {
  return line.unitPriceCents * line.quantity;
}

export function calculateCartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function summarizeCart(
  lines: CartLine[],
  options?: {
    taxRate?: number;
    freeShippingThresholdCents?: number;
    flatShippingCents?: number;
  },
): CartSummary {
  const subtotalCents = calculateSubtotal(lines);
  const taxCents = calculateTax(subtotalCents, options?.taxRate);
  const shippingCents = calculateShipping(subtotalCents, {
    freeShippingThresholdCents: options?.freeShippingThresholdCents,
    flatShippingCents: options?.flatShippingCents,
  });
  const totalCents = calculateTotal(subtotalCents, taxCents, shippingCents);

  return {
    itemCount: calculateCartItemCount(lines),
    subtotalCents,
    taxCents,
    shippingCents,
    totalCents,
  };
}

export function findCartLine(
  lines: CartLine[],
  productId: string,
  variantId: string,
): CartLine | undefined {
  return lines.find(
    (line) => line.productId === productId && line.variantId === variantId,
  );
}

export function upsertCartLine(
  lines: CartLine[],
  next: CartLine,
): CartLine[] {
  const index = lines.findIndex(
    (line) =>
      line.productId === next.productId && line.variantId === next.variantId,
  );
  if (index === -1) {
    return [...lines, next];
  }
  const updated = [...lines];
  updated[index] = {
    ...updated[index],
    ...next,
    quantity: Math.min(
      updated[index].quantity + next.quantity,
      next.maxQuantity,
    ),
  };
  return updated;
}

export function updateCartLineQuantity(
  lines: CartLine[],
  productId: string,
  variantId: string,
  quantity: number,
): CartLine[] {
  if (quantity <= 0) {
    return lines.filter(
      (line) =>
        !(line.productId === productId && line.variantId === variantId),
    );
  }
  return lines.map((line) =>
    line.productId === productId && line.variantId === variantId
      ? { ...line, quantity: Math.min(quantity, line.maxQuantity) }
      : line,
  );
}

export function removeCartLine(
  lines: CartLine[],
  productId: string,
  variantId: string,
): CartLine[] {
  return lines.filter(
    (line) =>
      !(line.productId === productId && line.variantId === variantId),
  );
}
