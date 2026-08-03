import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { getBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order details",
  robots: { index: false, follow: false },
};

const SHOP_BTN =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5c63]/40 disabled:pointer-events-none disabled:opacity-50 bg-[#0c0c0c] text-[#f4f4f2] hover:bg-[#0c0c0c]/90 h-10 px-4 py-2 mt-6";

/**
 * Static order detail for GitHub Pages — no useSearchParams / RequireAuth /
 * storefront header. Filled from localStorage by an inline script.
 */
export default function OrderViewPage() {
  const basePath = getBasePath();
  const fillScript = `
(function () {
  try {
    var base = ${JSON.stringify(basePath)};
    var shopBtn = ${JSON.stringify(SHOP_BTN)};
    var params = new URLSearchParams(window.location.search);
    var id = (params.get("id") || "").trim();
    var root = document.getElementById("order-root");
    if (!root) return;

    function money(cents) {
      try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((Number(cents) || 0) / 100);
      } catch (e) {
        return "$" + ((Number(cents) || 0) / 100).toFixed(2);
      }
    }

    function esc(s) {
      return String(s == null ? "" : s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    function showMissing(title, detail) {
      root.innerHTML =
        '<div class="py-16 text-center">' +
        '<h1 class="font-display text-2xl font-semibold">' + esc(title) + "</h1>" +
        (detail
          ? '<p class="mt-2 text-sm text-[#0c0c0c]/60">' + esc(detail) + "</p>"
          : "") +
        '<a href="' + base + '/shop/" class="' + shopBtn + '">Continue shopping</a>' +
        "</div>";
    }

    if (!id) {
      showMissing("Missing order", "Open this page from your confirmation link.");
      return;
    }

    var orders = [];
    try {
      var raw = localStorage.getItem("bc-merch-orders");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) orders = parsed;
      }
    } catch (e) {}

    var order = null;
    for (var i = 0; i < orders.length; i++) {
      if (orders[i] && orders[i].id === id) {
        order = orders[i];
        break;
      }
    }

    if (!order) {
      showMissing(
        "Order not found",
        "This order isn't in this browser's saved demo orders."
      );
      return;
    }

    var items = Array.isArray(order.items) ? order.items : [];
    var itemsHtml = items
      .map(function (item) {
        return (
          '<li class="flex justify-between gap-4 px-5 py-4 text-sm">' +
          "<div>" +
          '<p class="font-medium">' +
          esc(item.product_name) +
          "</p>" +
          '<p class="mt-1 text-[#0c0c0c]/55">' +
          esc(item.color) +
          " / " +
          esc(item.size) +
          " · Qty " +
          esc(item.quantity) +
          "</p>" +
          "</div>" +
          '<p class="font-medium tabular-nums">' +
          money(item.line_total_cents) +
          "</p>" +
          "</li>"
        );
      })
      .join("");

    var ship = order.shipping_address;
    var shipHtml = ship
      ? esc(ship.full_name) +
        "<br/>" +
        esc(ship.line1) +
        "<br/>" +
        esc(ship.city) +
        ", " +
        esc(ship.state) +
        " " +
        esc(ship.postal_code)
      : "No shipping address on file.";

    var when = "";
    try {
      when = new Date(order.created_at).toLocaleString();
    } catch (e) {
      when = String(order.created_at || "");
    }

    root.innerHTML =
      '<div class="py-10 md:py-16">' +
      '<div class="mb-8 flex items-end justify-between gap-4">' +
      "<div>" +
      '<p class="text-xs font-medium uppercase tracking-[0.2em] text-[#0d5c63]">Order</p>' +
      '<h1 class="mt-2 font-display text-3xl font-bold tracking-tight">' +
      esc(order.id) +
      "</h1>" +
      '<p class="mt-1 text-sm capitalize text-[#0c0c0c]/60">' +
      esc(order.status) +
      " · " +
      esc(when) +
      "</p>" +
      "</div>" +
      '<a href="' +
      base +
      '/shop/" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-[#0c0c0c]/5 h-9 px-3">Back to shop</a>' +
      "</div>" +
      '<div class="grid gap-8 lg:grid-cols-[1fr_320px]">' +
      '<ul class="divide-y divide-[#0c0c0c]/10 overflow-hidden rounded-2xl border border-[#0c0c0c]/10 bg-white">' +
      (itemsHtml ||
        '<li class="px-5 py-4 text-sm text-[#0c0c0c]/55">No line items.</li>') +
      "</ul>" +
      '<aside class="space-y-6">' +
      '<div class="rounded-2xl border border-[#0c0c0c]/10 bg-white p-5 text-sm">' +
      '<h2 class="font-display text-base font-semibold">Totals</h2>' +
      '<dl class="mt-4 space-y-2">' +
      '<div class="flex justify-between"><dt class="text-[#0c0c0c]/55">Subtotal</dt><dd class="tabular-nums">' +
      money(order.subtotal_cents) +
      "</dd></div>" +
      '<div class="flex justify-between"><dt class="text-[#0c0c0c]/55">Shipping</dt><dd class="tabular-nums">' +
      money(order.shipping_cents) +
      "</dd></div>" +
      '<div class="flex justify-between"><dt class="text-[#0c0c0c]/55">Tax</dt><dd class="tabular-nums">' +
      money(order.tax_cents) +
      "</dd></div>" +
      '<div class="flex justify-between border-t border-[#0c0c0c]/10 pt-2 font-semibold"><dt>Total</dt><dd class="tabular-nums">' +
      money(order.total_cents) +
      "</dd></div>" +
      "</dl></div>" +
      '<div class="rounded-2xl border border-[#0c0c0c]/10 bg-white p-5 text-sm">' +
      '<h2 class="font-display text-base font-semibold">Shipping</h2>' +
      '<p class="mt-3 text-[#0c0c0c]/70">' +
      shipHtml +
      "</p></div>" +
      "</aside></div></div>";
  } catch (e) {
    var rootErr = document.getElementById("order-root");
    if (rootErr) {
      rootErr.innerHTML =
        '<div class="py-16 text-center"><h1 class="font-display text-2xl font-semibold">Unable to load order</h1></div>';
    }
  }
})();`;

  return (
    <Container className="min-h-[50vh]">
      <div id="order-root" className="py-16 text-center text-sm text-[#0c0c0c]/55">
        Loading order…
        <noscript>
          <p className="mt-4">Enable JavaScript to view this demo order.</p>
          <Link href="/shop/" className={cn(buttonVariants(), "mt-6 inline-flex")}>
            Continue shopping
          </Link>
        </noscript>
      </div>
      <script dangerouslySetInnerHTML={{ __html: fillScript }} />
    </Container>
  );
}
