"use client";

import * as React from "react";
import { Check, Heart, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import type { Product, ProductSize } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/products/pricing";
import { canAddToCart, isInStock } from "@/lib/products/inventory";
import { useCartLine, useCartStore } from "@/lib/cart/store";
import { useWishlist } from "@/lib/wishlist/use-wishlist";
import { cn } from "@/lib/utils";

export interface ProductPurchasePanelProps {
  product: Product;
}

const SIZE_ORDER: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL", "ONE_SIZE"];

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const variants = React.useMemo(() => product.variants ?? [], [product.variants]);
  const primaryImage =
    product.images?.find((img) => img.is_primary) ?? product.images?.[0] ?? null;

  const colors = React.useMemo(
    () => Array.from(new Map(variants.map((v) => [v.color, v.color_hex])).entries()),
    [variants],
  );

  const [selectedColor, setSelectedColor] = React.useState<string | null>(
    colors[0]?.[0] ?? null,
  );

  const sizesForColor = React.useMemo(() => {
    const sizes = variants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
    return SIZE_ORDER.filter((size) => sizes.includes(size));
  }, [variants, selectedColor]);

  const [selectedSizeChoice, setSelectedSizeChoice] = React.useState<ProductSize | null>(
    sizesForColor[0] ?? null,
  );
  // A size chosen for one color may not exist for another (e.g. limited runs).
  // Derive the effective size during render instead of syncing via an effect.
  const selectedSize =
    selectedSizeChoice && sizesForColor.includes(selectedSizeChoice)
      ? selectedSizeChoice
      : sizesForColor[0] ?? null;
  const setSelectedSize = setSelectedSizeChoice;

  const activeVariant = React.useMemo(
    () =>
      variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize,
      ) ?? null,
    [variants, selectedColor, selectedSize],
  );

  const existingLine = useCartLine(product.id, activeVariant?.id ?? "");
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = React.useState(1);
  const [status, setStatus] = React.useState<"idle" | "added" | "error">("idle");
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const { isWishlisted, toggle: toggleWishlist } = useWishlist(product.id);

  // Reset transient purchase state whenever the selected variant changes.
  const [trackedVariantId, setTrackedVariantId] = React.useState(activeVariant?.id ?? null);
  if (trackedVariantId !== (activeVariant?.id ?? null)) {
    setTrackedVariantId(activeVariant?.id ?? null);
    setQuantity(1);
    setStatus("idle");
    setStatusMessage(null);
  }

  const variantInStock = activeVariant ? isInStock(activeVariant.inventory_quantity) : false;
  const hasDiscount =
    product.compare_at_cents != null && product.compare_at_cents > product.price_cents;
  const unitPriceCents = activeVariant?.price_cents ?? product.price_cents;
  const remainingUnderThreshold = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS - unitPriceCents * quantity,
  );

  function handleQuantityChange(next: number) {
    if (!activeVariant) return;
    const capped = Math.max(1, Math.min(next, activeVariant.inventory_quantity || 1));
    setQuantity(capped);
  }

  function handleAddToCart() {
    if (!activeVariant) {
      setStatus("error");
      setStatusMessage("Select a size and color to continue.");
      return;
    }

    const check = canAddToCart(
      activeVariant.inventory_quantity,
      quantity,
      existingLine?.quantity ?? 0,
    );

    if (!check.allowed) {
      setStatus("error");
      setStatusMessage(check.error ?? "This item can't be added right now.");
      return;
    }

    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      quantity,
      name: product.name,
      slug: product.slug,
      imageUrl: primaryImage?.url ?? "/images/placeholder.svg",
      size: activeVariant.size,
      color: activeVariant.color,
      unitPriceCents,
      maxQuantity: activeVariant.inventory_quantity,
    });

    setStatus("added");
    setStatusMessage(`Added ${quantity} to your bag.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {product.category ? (
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0d5c63]">
            {product.category.name}
          </span>
        ) : null}
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#0c0c0c] sm:text-4xl">
          {product.name}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-[#0c0c0c]">
            {formatPrice(unitPriceCents)}
          </span>
          {hasDiscount ? (
            <span className="text-base text-[#0c0c0c]/40 line-through">
              {formatPrice(product.compare_at_cents as number)}
            </span>
          ) : null}
          {product.is_new ? <Badge variant="secondary">New</Badge> : null}
        </div>
      </div>

      <p className="text-balance text-[15px] leading-relaxed text-[#0c0c0c]/70">
        {product.description}
      </p>

      {colors.length > 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-[#0c0c0c]">
            Color{selectedColor ? <span className="text-[#0c0c0c]/50"> — {selectedColor}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {colors.map(([color, hex]) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-pressed={selectedColor === color}
                aria-label={color}
                title={color}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full ring-1 ring-[#0c0c0c]/15 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5c63]",
                  selectedColor === color && "ring-2 ring-offset-2 ring-[#0d5c63]",
                )}
              >
                <span
                  className="size-6 rounded-full ring-1 ring-inset ring-[#0c0c0c]/10"
                  style={{ backgroundColor: hex }}
                />
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {sizesForColor.length > 0 && !(sizesForColor.length === 1 && sizesForColor[0] === "ONE_SIZE") ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-[#0c0c0c]">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizesForColor.map((size) => {
              const variant = variants.find(
                (v) => v.color === selectedColor && v.size === size,
              );
              const available = variant ? isInStock(variant.inventory_quantity) : false;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={cn(
                    "min-w-11 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5c63]/50 focus-visible:ring-offset-2",
                    selectedSize === size
                      ? "border-[#0c0c0c] bg-[#0c0c0c] text-[#f4f4f2]"
                      : "border-[#0c0c0c]/20 text-[#0c0c0c] hover:border-[#0c0c0c]/50",
                    !available && "cursor-not-allowed border-[#0c0c0c]/10 text-[#0c0c0c]/30 line-through hover:border-[#0c0c0c]/10",
                  )}
                >
                  {size === "ONE_SIZE" ? "One Size" : size}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-[#0c0c0c]" id="quantity-label">
          Quantity
        </span>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center rounded-md border border-[#0c0c0c]/20"
            role="group"
            aria-labelledby="quantity-label"
          >
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="flex size-10 items-center justify-center text-[#0c0c0c] transition-colors hover:bg-[#0c0c0c]/5 disabled:opacity-30"
            >
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={!activeVariant || quantity >= activeVariant.inventory_quantity}
              aria-label="Increase quantity"
              className="flex size-10 items-center justify-center text-[#0c0c0c] transition-colors hover:bg-[#0c0c0c]/5 disabled:opacity-30"
            >
              <Plus className="size-4" aria-hidden="true" />
            </button>
          </div>
          {activeVariant && activeVariant.inventory_quantity <= 8 && variantInStock ? (
            <span className="text-xs font-medium text-[#0d5c63]">
              Only {activeVariant.inventory_quantity} left
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={!activeVariant || !variantInStock}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          {activeVariant && !variantInStock ? "Sold out" : "Add to bag"}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={toggleWishlist}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("size-4", isWishlisted && "fill-[#0d5c63] text-[#0d5c63]")}
            aria-hidden="true"
          />
          {isWishlisted ? "Saved" : "Wishlist"}
        </Button>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={cn(
          "flex items-center gap-2 text-sm transition-opacity",
          statusMessage ? "opacity-100" : "opacity-0",
          status === "error" ? "text-red-700" : "text-[#0d5c63]",
        )}
      >
        {status === "added" ? <Check className="size-4" aria-hidden="true" /> : null}
        <span>{statusMessage ?? "\u00A0"}</span>
      </div>

      <div className="flex items-start gap-3 rounded-lg bg-[#0c0c0c]/[0.04] p-4 text-sm text-[#0c0c0c]/70">
        <Truck className="mt-0.5 size-4 shrink-0 text-[#0d5c63]" aria-hidden="true" />
        {remainingUnderThreshold > 0 ? (
          <span>
            Add {formatPrice(remainingUnderThreshold)} more for free shipping.
          </span>
        ) : (
          <span>This order qualifies for free shipping.</span>
        )}
      </div>
    </div>
  );
}
