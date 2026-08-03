import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    email?: string;
    total?: string;
    demo?: string;
  }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id ?? "—";
  const email = params.email;
  const totalCents = params.total ? Number(params.total) : null;
  const isDemo = params.demo === "1";

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <CheckCircle2
          className="mx-auto size-14 text-[#0d5c63]"
          aria-hidden="true"
        />
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Order confirmed
        </h1>
        <p className="mt-3 text-sm text-[#0c0c0c]/65">
          {isDemo
            ? "Demo checkout completed successfully. No real payment was processed."
            : "Thank you — your payment was received and your order is being prepared."}
        </p>

        <dl className="mt-8 space-y-3 rounded-2xl border border-[#0c0c0c]/10 bg-white px-6 py-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Reference</dt>
            <dd className="truncate font-medium">{sessionId}</dd>
          </div>
          {email ? (
            <div className="flex justify-between gap-4">
              <dt className="text-[#0c0c0c]/55">Email</dt>
              <dd className="font-medium">{email}</dd>
            </div>
          ) : null}
          {totalCents != null && Number.isFinite(totalCents) ? (
            <div className="flex justify-between gap-4">
              <dt className="text-[#0c0c0c]/55">Total</dt>
              <dd className="font-medium tabular-nums">
                {formatPrice(totalCents)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/account/orders" className={cn(buttonVariants())}>
            View orders
          </Link>
          <Link
            href="/shop"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}
