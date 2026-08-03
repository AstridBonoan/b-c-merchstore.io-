"use client";

import * as React from "react";
import type { ProductImage as ProductImageType } from "@/types";
import { ProductImage } from "@/components/products/product-image";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = React.useMemo(
    () => [...images].sort((a, b) => a.sort_order - b.sort_order),
    [images],
  );
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = sorted[activeIndex] ?? sorted[0];
  const initials = productName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (!active) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0c0c0c_0%,#0d5c63_55%,#0c0c0c_100%)]">
        <span className="font-display text-2xl font-bold text-[#f4f4f2]/85">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#0c0c0c]/[0.04]">
        <ProductImage
          key={active.id}
          src={active.url}
          alt={active.alt}
          fallbackLabel={initials}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="animate-fade-in object-cover"
        />
      </div>
      {sorted.length > 1 ? (
        <div className="flex gap-3" role="tablist" aria-label={`${productName} images`}>
          {sorted.map((img, index) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`View image ${index + 1} of ${sorted.length}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5c63]/50 focus-visible:ring-offset-2",
                index === activeIndex
                  ? "ring-2 ring-[#0d5c63]"
                  : "opacity-60 ring-1 ring-[#0c0c0c]/10 hover:opacity-100",
              )}
            >
              <ProductImage
                src={img.url}
                alt=""
                fallbackLabel={initials}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
