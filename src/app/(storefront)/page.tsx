import { Hero } from "@/components/home/hero";
import { PromoBanner } from "@/components/home/promo-banner";
import { FeaturedProducts } from "@/components/home/featured-products";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { NewArrivals } from "@/components/home/new-arrivals";
import { BestSellers } from "@/components/home/best-sellers";
import { BrandStatement } from "@/components/home/brand-statement";
import { Newsletter } from "@/components/home/newsletter";

export default function Home() {
  return (
    <>
      <PromoBanner />
      <Hero />
      <FeaturedProducts />
      <FeaturedCollection />
      <NewArrivals />
      <BestSellers />
      <BrandStatement />
      <Newsletter />
    </>
  );
}
