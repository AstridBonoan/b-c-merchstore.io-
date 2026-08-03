import Image from "next/image";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
};

/** B&C logo with GitHub Pages basePath-aware src. */
export function BrandLogo({
  className,
  width = 160,
  height = 54,
  priority = false,
}: BrandLogoProps) {
  return (
    <Image
      src={withBasePath("/images/brand/bc-logo.png")}
      alt="B&C"
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={cn("h-auto w-auto", className)}
    />
  );
}
