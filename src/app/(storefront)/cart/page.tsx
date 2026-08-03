import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your A&C Merch Store bag before checkout.",
};

export default function CartPage() {
  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 md:mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0d5c63]">
          Bag
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Your cart
        </h1>
      </div>
      <CartView />
    </Container>
  );
}
