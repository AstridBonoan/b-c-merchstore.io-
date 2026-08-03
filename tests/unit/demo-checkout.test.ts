import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  formatCardNumber,
  isValidCardNumber,
  processDemoPayment,
} from "@/lib/checkout/demo-payment";
import { placeDemoOrder } from "@/lib/checkout/place-demo-order";
import { getSeedProductById } from "@/lib/products/seed-data";
import type { CartLine } from "@/types";

describe("demo payment helpers", () => {
  it("formats and validates Stripe test card numbers", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(isValidCardNumber("4242 4242 4242 4242")).toBe(true);
    expect(isValidCardNumber("4242424242424241")).toBe(false);
  });

  it("approves the Stripe success test card", async () => {
    const result = await processDemoPayment({
      cardName: "Test Shopper",
      cardNumber: "4242 4242 4242 4242",
      expiry: "12/34",
      cvc: "123",
    });
    expect(result.ok).toBe(true);
  });

  it("declines the Stripe decline test card", async () => {
    const result = await processDemoPayment({
      cardName: "Test Shopper",
      cardNumber: "4000 0000 0000 0002",
      expiry: "12/34",
      cvc: "123",
    });
    expect(result.ok).toBe(false);
  });
});

describe("placeDemoOrder", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
    });
    vi.stubGlobal("window", {
      dispatchEvent: () => true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates a paid order from cart lines", () => {
    const productId = "prod-classic-tee";
    const product = getSeedProductById(productId)!;
    const variant = product.variants![0];

    const line: CartLine = {
      productId,
      variantId: variant.id,
      quantity: 1,
      name: product.name,
      slug: product.slug,
      imageUrl: product.images?.[0]?.url ?? "",
      size: variant.size,
      color: variant.color,
      unitPriceCents: product.price_cents,
      maxQuantity: variant.inventory_quantity,
    };

    const result = placeDemoOrder({
      checkout: {
        email: "shopper@example.com",
        fullName: "Demo Shopper",
        phone: "",
        billingSameAsShipping: true,
        notes: "",
        shipping: {
          fullName: "Demo Shopper",
          line1: "1 Demo St",
          line2: "",
          city: "Austin",
          state: "TX",
          postalCode: "78701",
          country: "US",
          phone: "",
        },
        payment: {
          cardName: "Demo Shopper",
          cardNumber: "4242 4242 4242 4242",
          expiry: "12/34",
          cvc: "123",
        },
      },
      lines: [line],
      sessionId: "demo_abc123xyz",
      paymentIntentId: "pi_demo_test",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.order.status).toBe("paid");
      expect(result.order.email).toBe("shopper@example.com");
      expect(result.order.items?.length).toBe(1);
    }
  });
});
