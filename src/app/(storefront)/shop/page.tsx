import type { Metadata } from "next";
import { ShopPageClient } from "@/components/products/shop-page-client";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full B&C Merch Store catalog — tees, hoodies, hats, and accessories built for everyday rotation.",
};

export default function ShopPage() {
  return <ShopPageClient />;
}
