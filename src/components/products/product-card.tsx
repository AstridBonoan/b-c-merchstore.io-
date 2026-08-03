import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/products/pricing";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/products/product-image";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const images = product.images ?? [];
  const primaryImage = images.find((img) => img.is_primary) ?? images[0];
  const secondaryImage = images.find((img) => img.id !== primaryImage?.id);
  const variants = product.variants ?? [];
  const hasDiscount =
    product.compare_at_cents != null && product.compare_at_cents > product.price_cents;
  const inStock = variants.some((v) => v.is_active && v.inventory_quantity > 0);
  const colors = Array.from(
    new Map(variants.map((v) => [v.color, v.color_hex])).entries(),
  );
  const initials = product.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5c63]/50 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#0c0c0c]/[0.04]">
        {primaryImage ? (
          <ProductImage
            src={primaryImage.url}
            alt={primaryImage.alt}
            fallbackLabel={initials}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 23vw, (min-width: 768px) 30vw, 45vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]",
              secondaryImage && "group-hover:opacity-0",
            )}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#0c0c0c_0%,#0d5c63_55%,#0c0c0c_100%)]">
            <span className="font-display text-lg font-bold text-[#f4f4f2]/85">
              {initials}
            </span>
          </div>
        )}
        {secondaryImage ? (
          <ProductImage
            src={secondaryImage.url}
            alt={secondaryImage.alt}
            fallbackLabel={initials}
            fill
            sizes="(min-width: 1280px) 23vw, (min-width: 768px) 30vw, 45vw"
            className="absolute inset-0 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:opacity-100"
          />
        ) : null}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_new ? <Badge variant="secondary">New</Badge> : null}
          {hasDiscount ? <Badge>Sale</Badge> : null}
        </div>
        {!inStock ? (
          <div className="absolute inset-0 flex items-end bg-[#0c0c0c]/10 p-3">
            <Badge variant="muted">Sold out</Badge>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <h3 className="text-sm font-semibold leading-snug text-[#0c0c0c] transition-colors group-hover:text-[#0d5c63]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-[#0c0c0c]">
            {formatPrice(product.price_cents)}
          </span>
          {hasDiscount ? (
            <span className="text-[#0c0c0c]/40 line-through">
              {formatPrice(product.compare_at_cents as number)}
            </span>
          ) : null}
        </div>
        {colors.length > 1 ? (
          <div className="mt-0.5 flex items-center gap-1.5">
            {colors.slice(0, 5).map(([color, hex]) => (
              <span
                key={color}
                title={color}
                className="size-2.5 rounded-full ring-1 ring-[#0c0c0c]/15"
                style={{ backgroundColor: hex }}
              />
            ))}
            {colors.length > 5 ? (
              <span className="text-xs text-[#0c0c0c]/45">+{colors.length - 5}</span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
