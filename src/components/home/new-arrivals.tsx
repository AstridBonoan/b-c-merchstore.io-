import { getNewArrivals } from "@/lib/products/queries";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { Reveal } from "@/components/motion/reveal";

export async function NewArrivals() {
  const products = await getNewArrivals(4);
  if (products.length === 0) return null;

  return (
    <section className="border-t border-[#0c0c0c]/10 bg-[#0c0c0c]/[0.03] py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow="Just Dropped"
            title="New arrivals"
            description="Fresh off the line. Limited runs — once they're gone, they're gone."
            cta={{ label: "Shop new arrivals", href: "/shop?sort=newest" }}
          />
        </Reveal>
        <ProductGrid products={products} />
      </Container>
    </section>
  );
}
