import type {
  Category,
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductSortOption,
} from "@/types";
import { isDemoMode } from "@/lib/utils";
import {
  getSeedCategories,
  getSeedProductBySlug,
  getSeedProducts,
} from "@/lib/products/seed-data";
import { productMatchesSearch } from "@/lib/products/search";

function sortProducts(products: Product[], sort: ProductSortOption = "featured"): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    case "price-asc":
      return sorted.sort((a, b) => a.price_cents - b.price_cents);
    case "price-desc":
      return sorted.sort((a, b) => b.price_cents - a.price_cents);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }
}

function matchesFilters(product: Product, filters: ProductFilters): boolean {
  if (!product.is_active) return false;

  if (filters.search && !productMatchesSearch(product, filters.search)) {
    return false;
  }

  if (filters.category) {
    const cat = filters.category.toLowerCase();
    const match =
      product.category?.slug === cat ||
      product.category_id === filters.category;
    if (!match) return false;
  }

  if (filters.minPrice != null && product.price_cents < filters.minPrice) {
    return false;
  }
  if (filters.maxPrice != null && product.price_cents > filters.maxPrice) {
    return false;
  }

  if (filters.sizes?.length) {
    const sizes = new Set(product.variants?.map((v) => v.size) ?? []);
    if (!filters.sizes.some((s) => sizes.has(s))) return false;
  }

  if (filters.colors?.length) {
    const colors = new Set(
      (product.variants ?? []).map((v) => v.color.toLowerCase()),
    );
    if (!filters.colors.some((c) => colors.has(c.toLowerCase()))) return false;
  }

  if (filters.inStockOnly) {
    const stock = (product.variants ?? []).some(
      (v) => v.is_active && v.inventory_quantity > 0,
    );
    if (!stock) return false;
  }

  if (filters.featured && !product.is_featured) return false;

  return true;
}

function paginate(
  products: Product[],
  page = 1,
  limit = 12,
): PaginatedProducts {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(limit, 48));
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));
  const start = (safePage - 1) * safeLimit;
  return {
    products: products.slice(start, start + safeLimit),
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
  };
}

async function queryFromSupabase(
  filters: ProductFilters = {},
): Promise<PaginatedProducts> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  if (!supabase) {
    return filterProductsDemo(filters);
  }

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `,
      { count: "exact" },
    )
    .eq("is_active", true);

  if (filters.category) {
    query = query.eq("categories.slug", filters.category);
  }
  if (filters.minPrice != null) {
    query = query.gte("price_cents", filters.minPrice);
  }
  if (filters.maxPrice != null) {
    query = query.lte("price_cents", filters.maxPrice);
  }
  if (filters.featured) {
    query = query.eq("is_featured", true);
  }
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
    );
  }

  switch (filters.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "price-asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "name-asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error || !data) {
    console.error("Supabase product query failed, falling back to demo data:", error?.message);
    return filterProductsDemo(filters);
  }

  let products = data as Product[];

  // Client-side refine for size/color/stock (joined filters are limited in PostgREST)
  products = products.filter((p) => matchesFilters(p, {
    ...filters,
    search: undefined,
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    featured: undefined,
  }));

  const total = count ?? products.length;
  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function filterProductsDemo(filters: ProductFilters = {}): PaginatedProducts {
  const filtered = sortProducts(
    getSeedProducts().filter((p) => matchesFilters(p, filters)),
    filters.sort,
  );
  return paginate(filtered, filters.page, filters.limit);
}

export async function filterProducts(
  filters: ProductFilters = {},
): Promise<PaginatedProducts> {
  if (isDemoMode()) {
    return filterProductsDemo(filters);
  }
  return queryFromSupabase(filters);
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  const result = await filterProducts({ ...filters, limit: filters.limit ?? 48 });
  return result.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDemoMode()) {
    return getSeedProductBySlug(slug) ?? null;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  if (!supabase) {
    return getSeedProductBySlug(slug) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return getSeedProductBySlug(slug) ?? null;
  }
  return data as Product;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return getProducts({ featured: true, sort: "featured", limit });
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return getProducts({ sort: "newest", limit });
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  if (isDemoMode()) {
    return sortProducts(
      getSeedProducts().filter((p) => p.is_active && p.is_bestseller),
      "featured",
    ).slice(0, limit);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  if (!supabase) {
    return sortProducts(
      getSeedProducts().filter((p) => p.is_active && p.is_bestseller),
      "featured",
    ).slice(0, limit);
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)
    `,
    )
    .eq("is_active", true)
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return sortProducts(
      getSeedProducts().filter((p) => p.is_active && p.is_bestseller),
      "featured",
    ).slice(0, limit);
  }
  return data as Product[];
}

export async function getCategories(): Promise<Category[]> {
  if (isDemoMode()) {
    return getSeedCategories();
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  if (!supabase) {
    return getSeedCategories();
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return getSeedCategories();
  }
  return data as Category[];
}
