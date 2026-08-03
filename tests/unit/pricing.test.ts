import { describe, expect, it } from "vitest";
import {
  calculateShipping,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatPrice,
} from "@/lib/products/pricing";

describe("pricing", () => {
  it("formats cents as USD currency", () => {
    expect(formatPrice(4599)).toBe("$45.99");
  });

  it("calculates cart subtotal", () => {
    expect(
      calculateSubtotal([
        { unitPriceCents: 2000, quantity: 2 },
        { unitPriceCents: 1500, quantity: 1 },
      ]),
    ).toBe(5500);
  });

  it("calculates tax at 8%", () => {
    expect(calculateTax(10000)).toBe(800);
  });

  it("applies free shipping above threshold", () => {
    expect(calculateShipping(8000)).toBe(0);
    expect(calculateShipping(2000)).toBe(599);
  });

  it("sums total", () => {
    expect(calculateTotal(5000, 400, 599)).toBe(5999);
  });
});
