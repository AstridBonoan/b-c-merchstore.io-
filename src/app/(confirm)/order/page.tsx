"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/products/pricing";
import { getPlacedOrderById, subscribePlacedOrders } from "@/lib/orders/local-orders";
import { getDemoOrderById } from "@/lib/orders/demo-orders";
import { useDemoSession } from "@/lib/auth/client-session";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

function useIsClient() {
  return React.useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}

function readOrderIdFromLocation(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("id")?.trim() ?? "";
}

function readOrder(orderId: string): Order | null {
  if (!orderId) return null;
  return getPlacedOrderById(orderId) ?? getDemoOrderById(orderId) ?? null;
}

/**
 * Post-checkout order detail without useSearchParams / RequireAuth soft-routing.
 * Safe for GitHub Pages static hosting under the minimal confirm layout.
 */
export default function OrderViewPage() {
  const isClient = useIsClient();
  const session = useDemoSession();
  const orderId = React.useSyncExternalStore(
    () => () => undefined,
    () => readOrderIdFromLocation(),
    () => "",
  );
  const order = React.useSyncExternalStore(
    subscribePlacedOrders,
    () => readOrder(orderId),
    () => (orderId ? getDemoOrderById(orderId) ?? null : null),
  );

  if (!isClient) {
    return (
      <Container className="py-16 text-center text-sm text-[#0c0c0c]/55">
        Loading order…
      </Container>
    );
  }

  if (!orderId) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Missing order</h1>
        <Link href="/shop/" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Continue shopping
        </Link>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-sm text-[#0c0c0c]/60">
          This order isn&apos;t in this browser&apos;s saved demo orders.
        </p>
        <Link href="/shop/" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Continue shopping
        </Link>
      </Container>
    );
  }

  const canView =
    !session ||
    session.role === "admin" ||
    session.email.toLowerCase() === order.email.toLowerCase();

  if (!canView) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Order unavailable</h1>
        <p className="mt-2 text-sm text-[#0c0c0c]/60">
          Sign in with {order.email} (or admin@bcmerch.store) to view this order.
        </p>
        <Link
          href={`/login/?next=${encodeURIComponent(`/order/?id=${order.id}`)}`}
          className={cn(buttonVariants(), "mt-6 inline-flex")}
        >
          Sign in
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0d5c63]">
            Order
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {order.id}
          </h1>
          <p className="mt-1 text-sm capitalize text-[#0c0c0c]/60">
            {order.status} · {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <Link href="/shop/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          Back to shop
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-[#0c0c0c]/10 overflow-hidden rounded-2xl border border-[#0c0c0c]/10 bg-white">
          {(order.items ?? []).map((item) => (
            <li key={item.id} className="flex justify-between gap-4 px-5 py-4 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="mt-1 text-[#0c0c0c]/55">
                  {item.color} / {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-medium tabular-nums">
                {formatPrice(item.line_total_cents)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#0c0c0c]/10 bg-white p-5 text-sm">
            <h2 className="font-display text-base font-semibold">Totals</h2>
            <dl className="mt-4 space-y-2">
              <div className="flex justify-between">
                <dt className="text-[#0c0c0c]/55">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#0c0c0c]/55">Shipping</dt>
                <dd className="tabular-nums">{formatPrice(order.shipping_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#0c0c0c]/55">Tax</dt>
                <dd className="tabular-nums">{formatPrice(order.tax_cents)}</dd>
              </div>
              <div className="flex justify-between border-t border-[#0c0c0c]/10 pt-2 font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(order.total_cents)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-[#0c0c0c]/10 bg-white p-5 text-sm">
            <h2 className="font-display text-base font-semibold">Shipping</h2>
            {order.shipping_address ? (
              <p className="mt-3 text-[#0c0c0c]/70">
                {order.shipping_address.full_name}
                <br />
                {order.shipping_address.line1}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
              </p>
            ) : (
              <p className="mt-3 text-[#0c0c0c]/55">No shipping address on file.</p>
            )}
          </div>
        </aside>
      </div>
    </Container>
  );
}
