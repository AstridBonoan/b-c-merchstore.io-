import { describe, expect, it } from "vitest";
import { canAddToCart, isInStock, validateQuantity } from "@/lib/products/inventory";
import { contactSchema, signInSchema } from "@/lib/validation/schemas";

describe("inventory", () => {
  it("detects stock", () => {
    expect(isInStock(3)).toBe(true);
    expect(isInStock(0)).toBe(false);
  });

  it("validates quantity against inventory", () => {
    expect(validateQuantity(2, 5).valid).toBe(true);
    expect(validateQuantity(6, 5).valid).toBe(false);
  });

  it("blocks add when inventory is exhausted", () => {
    expect(canAddToCart(2, 1, 2).allowed).toBe(false);
    expect(canAddToCart(5, 2, 1).allowed).toBe(true);
  });
});

describe("form validation schemas", () => {
  it("accepts valid contact payloads", () => {
    const result = contactSchema.safeParse({
      name: "Alex Rivera",
      email: "alex@example.com",
      subject: "Sizing question",
      message: "Do you restock the Classic Tee in XL?",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid sign-in emails", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "secret",
    });
    expect(result.success).toBe(false);
  });
});
