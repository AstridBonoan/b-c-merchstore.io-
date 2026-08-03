import { getFeaturedProducts } from "@/lib/products/queries";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { Reveal } from "@/components/motion/reveal";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8);
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Fan Favorites"
            title="Featured pieces"
            description="The core lineup — clean silhouettes and considered details built for daily rotation."
            cta={{ label: "Shop all", href: "/shop" }}
          />
        </Reveal>
        <ProductGrid products={products} priorityCount={4} />
      </Container>
    </section>
  );
}
