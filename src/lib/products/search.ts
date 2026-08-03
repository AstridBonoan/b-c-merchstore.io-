/** Token-aware product search matching for demo/static filtering. */

type SearchableProduct = {
  name: string;
  description: string;
  slug: string;
  tags?: string[] | null;
  category?: { name?: string | null; slug?: string | null } | null;
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function fieldMatchesQuery(field: string, query: string): boolean {
  const normalizedField = normalizeText(field);
  const normalizedQuery = normalizeText(query);
  if (!normalizedField || !normalizedQuery) return false;

  // Multi-word queries stay phrase-oriented on the normalized field.
  if (normalizedQuery.includes(" ")) {
    return normalizedField.includes(normalizedQuery);
  }

  // Match whole tokens so "shirt" hits "shirts" / "t-shirt" but not "short".
  return normalizedField
    .split(/\s+/)
    .some(
      (token) =>
        token === normalizedQuery || token.startsWith(normalizedQuery),
    );
}

export function productMatchesSearch(
  product: SearchableProduct,
  search: string,
): boolean {
  const q = search.trim();
  if (!q) return true;

  const fields = [
    product.name,
    product.description,
    product.slug,
    ...(product.tags ?? []),
    product.category?.name ?? "",
    product.category?.slug ?? "",
  ];

  return fields.some((field) => fieldMatchesQuery(field, q));
}
