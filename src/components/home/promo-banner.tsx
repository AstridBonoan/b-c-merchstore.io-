import { formatPrice, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/products/pricing";

export function PromoBanner() {
  return (
    <div className="border-b border-[#f4f4f2]/10 bg-[#0d5c63] py-2.5 text-center text-xs font-medium tracking-wide text-[#f4f4f2] sm:text-sm">
      Free shipping on orders over {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)} · 30-day returns
    </div>
  );
}
