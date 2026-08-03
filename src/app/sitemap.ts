import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";
import { getSeedProducts } from "@/lib/products/seed-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const products = getSeedProducts().filter((product) => product.is_active);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/shop/`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/contact/`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/product/${product.slug}/`,
    lastModified: product.updated_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
