"use client";

import * as React from "react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import {
  readCheckoutSuccess,
  type CheckoutSuccessPayload,
} from "@/lib/checkout/success-storage";
import { formatPrice } from "@/lib/products/pricing";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

function readSuccess(): CheckoutSuccessPayload | null {
  if (typeof window === "undefined") return null;
  const saved = readCheckoutSuccess();
  if (saved) return saved;
  const id = new URLSearchParams(window.location.search).get("id")?.trim();
  if (!id) return null;
  return {
    sessionId: "—",
    orderId: id,
    email: "—",
    totalCents: 0,
    isDemo: true,
    savedAt: new Date().toISOString(),
  };
}

/**
 * Confirmation UI filled from sessionStorage after demo checkout.
 * Client mount (not an inline script) so React hydration cannot wipe values.
 */
export default function CheckoutSuccessPage() {
  const data = React.useSyncExternalStore(
    () => () => undefined,
    readSuccess,
    () => null,
  );

  React.useEffect(() => {
    if (!data?.orderId) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("id") === data.orderId) return;
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?id=${encodeURIComponent(data.orderId)}`,
    );
  }, [data?.orderId]);

  const orderHref = data?.orderId
    ? withBasePath(`/order/?id=${encodeURIComponent(data.orderId)}`)
    : withBasePath("/order/");

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-lg text-center">
        <svg
          className="mx-auto size-14 text-[#0d5c63]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Payment successful
        </h1>
        <p className="mt-3 text-sm text-[#0c0c0c]/65">
          {data?.isDemo === false
            ? "Thank you — your order confirmation is ready."
            : "Demo payment completed. Your order is saved in this browser — no real charge was made."}
        </p>

        <dl className="mt-8 space-y-3 rounded-2xl border border-[#0c0c0c]/10 bg-white px-6 py-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Order</dt>
            <dd className="truncate font-medium">{data?.orderId ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Payment ref</dt>
            <dd className="truncate font-medium">{data?.sessionId ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Email</dt>
            <dd className="font-medium">{data?.email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Total paid</dt>
            <dd className="font-medium tabular-nums">
              {data && data.totalCents > 0 ? formatPrice(data.totalCents) : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Status</dt>
            <dd className="font-medium capitalize">paid</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={orderHref}
            className={cn(buttonVariants())}
            onClick={(event) => {
              event.preventDefault();
              window.location.assign(orderHref);
            }}
          >
            View order
          </a>
          <a
            href={withBasePath("/shop/")}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Continue shopping
          </a>
        </div>
      </div>
    </Container>
  );
}
