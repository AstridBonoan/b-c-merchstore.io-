import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products/queries";
import { getSeedProducts } from "@/lib/products/seed-data";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { RelatedProducts } from "@/components/products/related-products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getSeedProducts()
    .filter((product) => product.is_active)
    .map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const image = product.images?.find((img) => img.is_primary) ?? product.images?.[0];

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: image ? [{ url: image.url, alt: image.alt }] : undefined,
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-10 sm:py-14">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images ?? []} productName={product.name} />
        <ProductPurchasePanel product={product} />
      </Container>
      <RelatedProducts product={product} />
    </div>
  );
}
