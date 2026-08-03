"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import { useOrderById } from "@/lib/orders/use-orders";
import { cn } from "@/lib/utils";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "—";
  const orderId = searchParams.get("order_id");
  const email = searchParams.get("email");
  const totalRaw = searchParams.get("total");
  const totalCents = totalRaw ? Number(totalRaw) : null;
  const isDemo = searchParams.get("demo") === "1";
  const order = useOrderById(orderId ?? "");

  return (
    <div className="mx-auto max-w-lg text-center">
      <CheckCircle2 className="mx-auto size-14 text-[#0d5c63]" aria-hidden="true" />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
        Payment successful
      </h1>
      <p className="mt-3 text-sm text-[#0c0c0c]/65">
        {isDemo
          ? "Demo payment completed. Your order is saved in this browser — no real charge was made."
          : "Thank you — your order confirmation is ready."}
      </p>

      <dl className="mt-8 space-y-3 rounded-2xl border border-[#0c0c0c]/10 bg-white px-6 py-5 text-left text-sm">
        {orderId || order ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Order</dt>
            <dd className="truncate font-medium">{order?.id ?? orderId}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-[#0c0c0c]/55">Payment ref</dt>
          <dd className="truncate font-medium">{sessionId}</dd>
        </div>
        {email ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Email</dt>
            <dd className="font-medium">{email}</dd>
          </div>
        ) : null}
        {(order?.total_cents ?? totalCents) != null &&
        Number.isFinite(order?.total_cents ?? totalCents) ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Total paid</dt>
            <dd className="font-medium tabular-nums">
              {formatPrice(order?.total_cents ?? totalCents!)}
            </dd>
          </div>
        ) : null}
        {order?.status ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Status</dt>
            <dd className="font-medium capitalize">{order.status}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {orderId ? (
          <Link
            href={`/account/orders/view/?id=${encodeURIComponent(orderId)}`}
            className={cn(buttonVariants())}
          >
            View order
          </Link>
        ) : (
          <Link href="/account/orders/" className={cn(buttonVariants())}>
            View orders
          </Link>
        )}
        <Link href="/shop/" className={cn(buttonVariants({ variant: "outline" }))}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
