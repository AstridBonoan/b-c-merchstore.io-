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
import { cn } from "@/lib/utils";

type SuccessQuery = {
  sessionId: string;
  orderId: string | null;
  email: string | null;
  totalCents: number | null;
  isDemo: boolean;
};

function parseSuccessQuery(search: string): SuccessQuery {
  const params = new URLSearchParams(search);
  const totalRaw = params.get("total");
  const totalCents = totalRaw != null ? Number(totalRaw) : null;

  return {
    sessionId: params.get("session_id") ?? "—",
    orderId: params.get("order_id"),
    email: params.get("email"),
    totalCents:
      totalCents != null && Number.isFinite(totalCents) ? totalCents : null,
    isDemo: params.get("demo") === "1",
  };
}

/**
 * Confirmation UI for static GitHub Pages.
 * Reads query params from window.location (not useSearchParams) so the page
 * hydrates without Suspense / soft-router failures after checkout.
 */
export function CheckoutSuccessClient() {
  const search = React.useSyncExternalStore(
    () => () => undefined,
    () => window.location.search,
    () => "",
  );
  const query = React.useMemo(() => parseSuccessQuery(search), [search]);

  const order = React.useSyncExternalStore(
    subscribePlacedOrders,
    () =>
      query.orderId
        ? (getPlacedOrderById(query.orderId) ??
          getDemoOrderById(query.orderId) ??
          null)
        : null,
    () => (query.orderId ? (getDemoOrderById(query.orderId) ?? null) : null),
  );

  const totalCents = order?.total_cents ?? query.totalCents;
  const hasConfirmation = Boolean(query.sessionId && query.sessionId !== "—");

  if (!hasConfirmation && !search) {
    return (
      <div className="mx-auto max-w-lg text-center text-sm text-[#0c0c0c]/55">
        Loading confirmation…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <CheckCircle2 className="mx-auto size-14 text-[#0d5c63]" aria-hidden="true" />
      <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
        Payment successful
      </h1>
      <p className="mt-3 text-sm text-[#0c0c0c]/65">
        {query.isDemo
          ? "Demo payment completed. Your order is saved in this browser — no real charge was made."
          : "Thank you — your order confirmation is ready."}
      </p>

      <dl className="mt-8 space-y-3 rounded-2xl border border-[#0c0c0c]/10 bg-white px-6 py-5 text-left text-sm">
        {query.orderId || order ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Order</dt>
            <dd className="truncate font-medium">{order?.id ?? query.orderId}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-[#0c0c0c]/55">Payment ref</dt>
          <dd className="truncate font-medium">{query.sessionId}</dd>
        </div>
        {query.email ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Email</dt>
            <dd className="font-medium">{query.email}</dd>
          </div>
        ) : null}
        {totalCents != null ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Total paid</dt>
            <dd className="font-medium tabular-nums">{formatPrice(totalCents)}</dd>
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
        {query.orderId ? (
          <Link
            href={`/account/orders/view/?id=${encodeURIComponent(query.orderId)}`}
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
