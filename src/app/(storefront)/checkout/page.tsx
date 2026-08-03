import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for B&C Merch Store.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 md:mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0d5c63]">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Complete your order
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[#0c0c0c]/60">
          This GitHub Pages demo validates products locally and completes a safe
          demo checkout — no real card charges.
        </p>
      </div>
      <CheckoutForm />
    </Container>
  );
}
