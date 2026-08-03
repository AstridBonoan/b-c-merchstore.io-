import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { CHECKOUT_SUCCESS_STORAGE_KEY } from "@/lib/checkout/success-storage";
import { getBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  const basePath = getBasePath();
  const fillScript = `
(function () {
  try {
    var key = ${JSON.stringify(CHECKOUT_SUCCESS_STORAGE_KEY)};
    var raw = sessionStorage.getItem(key);
    var base = ${JSON.stringify(basePath)};
    var orderEl = document.getElementById("cs-order");
    var refEl = document.getElementById("cs-ref");
    var emailEl = document.getElementById("cs-email");
    var totalEl = document.getElementById("cs-total");
    var msgEl = document.getElementById("cs-msg");
    var viewEl = document.getElementById("cs-view-order");
    if (!raw) return;
    var data = JSON.parse(raw);
    function money(cents) {
      try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((Number(cents) || 0) / 100);
      } catch (e) {
        return "$" + ((Number(cents) || 0) / 100).toFixed(2);
      }
    }
    if (orderEl && data.orderId) orderEl.textContent = String(data.orderId);
    if (refEl && data.sessionId) refEl.textContent = String(data.sessionId);
    if (emailEl && data.email) emailEl.textContent = String(data.email);
    if (totalEl && data.totalCents != null) totalEl.textContent = money(data.totalCents);
    if (msgEl) {
      msgEl.textContent = data.isDemo
        ? "Demo payment completed. Your order is saved in this browser — no real charge was made."
        : "Thank you — your order confirmation is ready.";
    }
    if (viewEl && data.orderId) {
      viewEl.setAttribute("href", base + "/order/?id=" + encodeURIComponent(String(data.orderId)));
    }
  } catch (e) {}
})();`;

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
        <p id="cs-msg" className="mt-3 text-sm text-[#0c0c0c]/65">
          Demo payment completed. Your order is saved in this browser — no real
          charge was made.
        </p>

        <dl className="mt-8 space-y-3 rounded-2xl border border-[#0c0c0c]/10 bg-white px-6 py-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Order</dt>
            <dd id="cs-order" className="truncate font-medium">
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Payment ref</dt>
            <dd id="cs-ref" className="truncate font-medium">
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Email</dt>
            <dd id="cs-email" className="font-medium">
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Total paid</dt>
            <dd id="cs-total" className="font-medium tabular-nums">
              —
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[#0c0c0c]/55">Status</dt>
            <dd className="font-medium capitalize">paid</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Plain <a> so the fill script can set ?id= and we avoid soft-routing. */}
          <a
            id="cs-view-order"
            href={`${basePath}/order/`}
            className={cn(buttonVariants())}
          >
            View order
          </a>
          <Link href="/shop/" className={cn(buttonVariants({ variant: "outline" }))}>
            Continue shopping
          </Link>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: fillScript }} />
    </Container>
  );
}
