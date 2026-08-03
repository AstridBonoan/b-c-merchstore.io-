import { describe, expect, it } from "vitest";
import { getSeedProductBySlug } from "@/lib/products/seed-data";
import { productMatchesSearch } from "@/lib/products/search";

describe("productMatchesSearch", () => {
  it("matches shirts without returning shorts", () => {
    const tee = getSeedProductBySlug("bc-classic-tee");
    const short = getSeedProductBySlug("bc-weekend-short");

    expect(tee).toBeTruthy();
    expect(short).toBeTruthy();
    expect(productMatchesSearch(tee!, "shirt")).toBe(true);
    expect(productMatchesSearch(short!, "shirt")).toBe(false);
    expect(productMatchesSearch(short!, "short")).toBe(true);
  });

  it("matches hyphenated category tokens like t-shirts", () => {
    const tee = getSeedProductBySlug("bc-signature-tee");
    expect(tee).toBeTruthy();
    expect(productMatchesSearch(tee!, "shirt")).toBe(true);
    expect(productMatchesSearch(tee!, "t-shirt")).toBe(true);
  });
});
