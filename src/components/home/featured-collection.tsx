import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/products/queries";
import { formatPrice } from "@/lib/products/pricing";
import { Container } from "@/components/layout/container";
import { ProductImage } from "@/components/products/product-image";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export async function FeaturedCollection() {
  const [spotlight] = await getProducts({
    category: "hoodies",
    sort: "featured",
    limit: 1,
  });
  if (!spotlight) return null;

  const image = spotlight.images?.find((img) => img.is_primary) ?? spotlight.images?.[0];

  return (
    <section className="bg-[#0c0c0c] py-16 text-[#f4f4f2] sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-xl lg:order-2">
          {image ? (
            <ProductImage
              src={image.url}
              alt={image.alt}
              fallbackLabel="B&C"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          ) : null}
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-6 lg:order-1">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0d5c63]">
            Collection Spotlight
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Layer Up
          </h2>
          <p className="max-w-md text-[#f4f4f2]/70">
            Fleece-lined hoodies built for cool mornings and late studio nights — cut
            for movement, finished to hold up for years of wear.
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold">
              {formatPrice(spotlight.price_cents)}
            </span>
            <span className="text-sm text-[#f4f4f2]/50">{spotlight.name}</span>
          </div>
          <Link
            href="/shop?category=hoodies"
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "self-start bg-[#0d5c63] text-[#f4f4f2] hover:bg-[#0d5c63]/90",
            })}
          >
            Shop Hoodies
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
