import Image from "next/image";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** Use transparent asset on light backgrounds (nav). Default keeps black plate for dark sections. */
  variant?: "dark" | "light";
};

/** B&C logo with GitHub Pages basePath-aware src. */
export function BrandLogo({
  className,
  width = 160,
  height = 54,
  priority = false,
  variant = "dark",
}: BrandLogoProps) {
  const src =
    variant === "light"
      ? "/images/brand/bc-logo-transparent.png"
      : "/images/brand/bc-logo.png";

  return (
    <Image
      src={withBasePath(src)}
      alt="B&C"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn("h-auto w-auto", className)}
    />
  );
}
