"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/products/pricing";
import { useCartStore, useCartSummary } from "@/lib/cart/store";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

type Props = {
  defaultEmail?: string;
  defaultName?: string;
};

export function CheckoutForm({ defaultEmail = "", defaultName = "" }: Props) {
  const router = useRouter();
  const lines = useCartStore((state) => state.lines);
  const clearCart = useCartStore((state) => state.clearCart);
  const summary = useCartSummary();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: defaultEmail,
      fullName: defaultName,
      phone: "",
      billingSameAsShipping: true,
      notes: "",
      shipping: {
        fullName: defaultName,
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "US",
        phone: "",
      },
    },
  });

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#0c0c0c]/15 bg-white/50 px-6 py-16 text-center">
        <h2 className="font-display text-xl font-semibold">Nothing to checkout</h2>
        <p className="mt-2 text-sm text-[#0c0c0c]/60">
          Add products to your bag before continuing.
        </p>
        <Link href="/shop" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Browse shop
        </Link>
      </div>
    );
  }

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      // GitHub Pages static demo: validate against seed catalog in the browser.
      // No API routes / Stripe secrets are available on static hosting.
      const { getSeedProductById } = await import("@/lib/products/seed-data");
      const { canAddToCart } = await import("@/lib/products/inventory");
      const { summarizeCart } = await import("@/lib/cart/calculations");
      const { nanoid } = await import("nanoid");

      const validatedLines = [];
      for (const line of lines) {
        const product = getSeedProductById(line.productId);
        const variant = product?.variants?.find((v) => v.id === line.variantId);
        if (!product?.is_active || !variant?.is_active) {
          setServerError("One or more products are unavailable.");
          return;
        }
        const stock = canAddToCart(variant.inventory_quantity, line.quantity);
        if (!stock.allowed) {
          setServerError(stock.error ?? "Insufficient inventory.");
          return;
        }
        validatedLines.push({
          ...line,
          // Prefer canonical seed price over client snapshot.
          unitPriceCents: variant.price_cents ?? product.price_cents,
        });
      }

      const summary = summarizeCart(validatedLines);
      const params = new URLSearchParams({
        session_id: `demo_${nanoid()}`,
        email: data.email,
        total: String(summary.totalCents),
        demo: "1",
      });

      clearCart();
      // Next.js router applies basePath automatically for GitHub Pages.
      router.push(`/checkout/success/?${params.toString()}`);
    } catch {
      setServerError("Unable to complete demo checkout. Please try again.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start"
      noValidate
    >
      <div className="space-y-8 rounded-2xl border border-[#0c0c0c]/10 bg-white p-6 md:p-8">
        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
              {errors.email ? (
                <p className="text-xs text-red-700">{errors.email.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" autoComplete="name" {...register("fullName")} />
              {errors.fullName ? (
                <p className="text-xs text-red-700">{errors.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Shipping</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shipping.fullName">Recipient name</Label>
              <Input
                id="shipping.fullName"
                autoComplete="shipping name"
                {...register("shipping.fullName")}
              />
              {errors.shipping?.fullName ? (
                <p className="text-xs text-red-700">{errors.shipping.fullName.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shipping.line1">Address</Label>
              <Input
                id="shipping.line1"
                autoComplete="shipping address-line1"
                {...register("shipping.line1")}
              />
              {errors.shipping?.line1 ? (
                <p className="text-xs text-red-700">{errors.shipping.line1.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shipping.line2">Apartment, suite (optional)</Label>
              <Input
                id="shipping.line2"
                autoComplete="shipping address-line2"
                {...register("shipping.line2")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.city">City</Label>
              <Input
                id="shipping.city"
                autoComplete="shipping address-level2"
                {...register("shipping.city")}
              />
              {errors.shipping?.city ? (
                <p className="text-xs text-red-700">{errors.shipping.city.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.state">State</Label>
              <Input
                id="shipping.state"
                autoComplete="shipping address-level1"
                {...register("shipping.state")}
              />
              {errors.shipping?.state ? (
                <p className="text-xs text-red-700">{errors.shipping.state.message}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.postalCode">Postal code</Label>
              <Input
                id="shipping.postalCode"
                autoComplete="shipping postal-code"
                {...register("shipping.postalCode")}
              />
              {errors.shipping?.postalCode ? (
                <p className="text-xs text-red-700">
                  {errors.shipping.postalCode.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shipping.country">Country</Label>
              <Input
                id="shipping.country"
                autoComplete="shipping country"
                {...register("shipping.country")}
              />
            </div>
          </div>
        </section>

        <section className="space-y-1.5">
          <Label htmlFor="notes">Order notes (optional)</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
        </section>

        {serverError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        ) : null}
      </div>

      <aside className="sticky top-24 space-y-6 rounded-2xl border border-[#0c0c0c]/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <ul className="space-y-3 text-sm">
          {lines.map((line) => (
            <li
              key={`${line.productId}-${line.variantId}`}
              className="flex justify-between gap-3"
            >
              <span className="text-[#0c0c0c]/70">
                {line.name}{" "}
                <span className="text-[#0c0c0c]/45">
                  ({line.color}/{line.size}) × {line.quantity}
                </span>
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {formatPrice(line.unitPriceCents * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-[#0c0c0c]/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#0c0c0c]/60">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(summary.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#0c0c0c]/60">Shipping</dt>
            <dd className="tabular-nums">
              {summary.shippingCents === 0
                ? "Free"
                : formatPrice(summary.shippingCents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#0c0c0c]/60">Tax</dt>
            <dd className="tabular-nums">{formatPrice(summary.taxCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-[#0c0c0c]/10 pt-2 text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(summary.totalCents)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing…
            </>
          ) : (
            "Pay with Stripe"
          )}
        </Button>
        <p className="text-center text-xs text-[#0c0c0c]/50">
          Demo/test mode supported. No real charges without live Stripe keys.
        </p>
      </aside>
    </form>
  );
}
