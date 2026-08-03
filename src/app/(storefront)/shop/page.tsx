import { Suspense } from "react";
import type { Metadata } from "next";
import type { ProductFilters as ProductFiltersType, ProductSize, ProductSortOption } from "@/types";
import { filterProducts, getCategories, getProducts } from "@/lib/products/queries";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full A&C Merch Store catalog — tees, hoodies, hats, and accessories built for everyday rotation.",
};

const SIZE_ORDER: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "ONE_SIZE"];

function parseList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.flatMap((v) => v.split(",")).filter(Boolean);
}

function parseNumber(value: string | string[] | undefined): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters: ProductFiltersType = {
    search: typeof params.search === "string" ? params.search : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    sizes: parseList(params.sizes) as ProductSize[],
    colors: parseList(params.colors),
    inStockOnly: params.inStock === "true",
    sort: (typeof params.sort === "string" ? params.sort : "featured") as ProductSortOption,
    limit: 48,
  };

  const [{ products, total }, categories, catalog] = await Promise.all([
    filterProducts(filters),
    getCategories(),
    getProducts({ limit: 100 }),
  ]);

  const sizesInCatalog = new Set(
    catalog.flatMap((p) => (p.variants ?? []).map((v) => v.size)),
  );
  const availableSizes = SIZE_ORDER.filter((size) => sizesInCatalog.has(size));

  const colorMap = new Map<string, string>();
  for (const product of catalog) {
    for (const variant of product.variants ?? []) {
      if (!colorMap.has(variant.color)) colorMap.set(variant.color, variant.color_hex);
    }
  }
  const availableColors = Array.from(colorMap.entries()).map(([name, hex]) => ({
    name,
    hex,
  }));

  return (
    <div className="py-10 sm:py-14">
      <Container className="flex flex-col gap-2 pb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0c0c0c] sm:text-4xl">
          Shop All
        </h1>
        <p className="text-sm text-[#0c0c0c]/60">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </Container>
      <Container className="grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start lg:gap-14">
        <Suspense fallback={null}>
          <ProductFilters
            categories={categories}
            availableSizes={availableSizes}
            availableColors={availableColors}
          />
        </Suspense>
        <ProductGrid
          products={products}
          priorityCount={4}
          emptyMessage="No products match these filters. Try clearing a few."
        />
      </Container>
    </div>
  );
}
