"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import {
  getPlacedOrderById,
  subscribePlacedOrders,
} from "@/lib/orders/local-orders";
import { getDemoOrderById } from "@/lib/orders/demo-orders";
import {
  readCheckoutSuccess,
  type CheckoutSuccessPayload,
} from "@/lib/checkout/success-storage";
import { cn } from "@/lib/utils";

function useIsClient() {
  return React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

/**
 * Confirmation UI for static GitHub Pages.
 * Confirmation details are stored in sessionStorage before redirect because
 * Next can drop query strings during hydration on project-page hosting.
 */
export function CheckoutSuccessClient() {
  const isClient = useIsClient();
  const confirmation = React.useSyncExternalStore(
    () => () => undefined,
    () => readCheckoutSuccess(),
    () => null,
  );

  const orderId = confirmation?.orderId ?? "";
  const order = React.useSyncExternalStore(
    subscribePlacedOrders,
    () =>
      orderId
        ? (getPlacedOrderById(orderId) ?? getDemoOrderById(orderId) ?? null)
        : null,
    () => null,
  );

  if (!isClient) {
    return (
      <div className="mx-auto max-w-lg text-center text-sm text-[#0c0c0c]/55">
        Loading confirmation…
      </div>
    );
  }

  if (!confirmation) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Confirmation unavailable
        </h1>
        <p className="mt-3 text-sm text-[#0c0c0c]/65">
          We couldn&apos;t find a recent checkout confirmation in this browser
          tab. If you just paid, your order may still be in Order history.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/account/orders/" className={cn(buttonVariants())}>
            View orders
          </Link>
          <Link href="/shop/" className={cn(buttonVariants({ variant: "outline" }))}>
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return <SuccessDetails confirmation={confirmation} orderStatus={order?.status} />;
}

function SuccessDetails({
  confirmation,
  orderStatus,
}: {
  confirmation: CheckoutSuccessPayload;
  orderStatus?: string | null;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <CheckCircle2 className="mx-auto size-14 text-[#0d5c63]" aria-hidden="true" />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
        Payment successful
      </h1>
      <p className="mt-3 text-sm text-[#0c0c0c]/65">
        {confirmation.isDemo
          ? "Demo payment completed. Your order is saved in this browser — no real charge was made."
          : "Thank you — your order confirmation is ready."}
      </p>

      <dl className="mt-8 space-y-3 rounded-2xl border border-[#0c0c0c]/10 bg-white px-6 py-5 text-left text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[#0c0c0c]/55">Order</dt>
          <dd className="truncate font-medium">{confirmation.orderId}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#0c0c0c]/55">Payment ref</dt>
          <dd className="truncate font-medium">{confirmation.sessionId}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#0c0c0c]/55">Email</dt>
          <dd className="font-medium">{confirmation.email}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[#0c0c0c]/55">Total paid</dt>
          <dd className="font-medium tabular-nums">
            {formatPrice(confirmation.totalCents)}
          </dd>
        </div>
        {orderStatus ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Status</dt>
            <dd className="font-medium capitalize">{orderStatus}</dd>
          </div>
        ) : (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Status</dt>
            <dd className="font-medium capitalize">paid</dd>
          </div>
        )}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={`/account/orders/view/?id=${encodeURIComponent(confirmation.orderId)}`}
          className={cn(buttonVariants())}
        >
          View order
        </Link>
        <Link href="/shop/" className={cn(buttonVariants({ variant: "outline" }))}>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
