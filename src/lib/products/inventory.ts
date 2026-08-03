/** Inventory validation helpers (pure / testable). */

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY_PER_LINE = 20;

export function validateQuantity(
  quantity: number,
  availableInventory: number,
  maxPerLine: number = MAX_QUANTITY_PER_LINE,
): { valid: boolean; quantity: number; error?: string } {
  if (!Number.isFinite(quantity) || !Number.isInteger(quantity)) {
    return { valid: false, quantity: MIN_QUANTITY, error: "Quantity must be a whole number." };
  }
  if (quantity < MIN_QUANTITY) {
    return { valid: false, quantity: MIN_QUANTITY, error: "Quantity must be at least 1." };
  }
  if (availableInventory <= 0) {
    return { valid: false, quantity: 0, error: "This item is out of stock." };
  }
  const capped = Math.min(quantity, availableInventory, maxPerLine);
  if (quantity > availableInventory) {
    return {
      valid: false,
      quantity: capped,
      error: `Only ${availableInventory} left in stock.`,
    };
  }
  if (quantity > maxPerLine) {
    return {
      valid: false,
      quantity: capped,
      error: `You can add up to ${maxPerLine} of this item.`,
    };
  }
  return { valid: true, quantity };
}

export function isInStock(inventoryQuantity: number): boolean {
  return inventoryQuantity > 0;
}

export function canAddToCart(
  inventoryQuantity: number,
  requestedQuantity: number,
  alreadyInCart = 0,
  maxPerLine: number = MAX_QUANTITY_PER_LINE,
): { allowed: boolean; error?: string; maxAddable: number } {
  if (!isInStock(inventoryQuantity)) {
    return { allowed: false, error: "This item is out of stock.", maxAddable: 0 };
  }
  const remaining = inventoryQuantity - alreadyInCart;
  if (remaining <= 0) {
    return {
      allowed: false,
      error: "You already have the maximum available quantity in your cart.",
      maxAddable: 0,
    };
  }
  const maxAddable = Math.min(remaining, maxPerLine - alreadyInCart);
  if (maxAddable <= 0) {
    return {
      allowed: false,
      error: `You can add up to ${maxPerLine} of this item.`,
      maxAddable: 0,
    };
  }
  if (requestedQuantity > maxAddable) {
    return {
      allowed: false,
      error:
        remaining < requestedQuantity
          ? `Only ${remaining} more available.`
          : `You can add up to ${maxAddable} more of this item.`,
      maxAddable,
    };
  }
  return { allowed: true, maxAddable };
}
