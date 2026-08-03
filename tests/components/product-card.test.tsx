import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/products/product-card";
import { getSeedProducts } from "@/lib/products/seed-data";

describe("ProductCard", () => {
  it("renders product name and link", () => {
    const product = getSeedProducts()[0];
    expect(product).toBeTruthy();
    render(<ProductCard product={product!} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/product/${product!.slug}`,
    );
    expect(screen.getByText(product!.name)).toBeInTheDocument();
  });
});
