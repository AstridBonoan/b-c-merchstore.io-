"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

/** Route-level recovery UI if something in the success tree throws. */
export default function CheckoutSuccessError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Payment received
        </h1>
        <p className="mt-3 text-sm text-[#0c0c0c]/65">
          Your demo checkout finished, but this confirmation view had trouble
          loading. Your order should still be in Order history.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={reset} className={cn(buttonVariants())}>
            Try again
          </button>
          <Link
            href="/account/orders/"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            View orders
          </Link>
        </div>
      </div>
    </Container>
  );
}
