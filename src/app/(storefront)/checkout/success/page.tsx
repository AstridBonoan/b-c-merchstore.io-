import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutSuccessClient } from "@/components/checkout/checkout-success-client";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Container className="py-16 md:py-24">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg text-center text-sm text-[#0c0c0c]/55">
            Loading confirmation…
          </div>
        }
      >
        <CheckoutSuccessClient />
      </Suspense>
    </Container>
  );
}
