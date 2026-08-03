"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";

export interface ProductImageProps extends Omit<ImageProps, "onError" | "src"> {
  src: string;
  /** Short label (e.g. initials) shown on the gradient fallback when the image 404s. */
  fallbackLabel?: string;
}

/**
 * Wraps next/image with a branded gradient fallback for the seed catalog's
 * placeholder image paths, so the storefront never shows a broken-image icon.
 */
export function ProductImage({
  src,
  fallbackLabel = "B&C",
  className,
  alt,
  ...props
}: ProductImageProps) {
  const [errored, setErrored] = React.useState(false);

  if (errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 flex size-full items-center justify-center bg-[linear-gradient(135deg,#0c0c0c_0%,#0d5c63_55%,#0c0c0c_100%)]"
      >
        <span className="font-display text-lg font-bold tracking-wide text-[#f4f4f2]/85">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
      {...props}
    />
  );
}
