import type { Metadata } from "next";
import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Container className="py-16 md:py-24">
      <CheckoutSuccessClient />
    </Container>
  );
}
