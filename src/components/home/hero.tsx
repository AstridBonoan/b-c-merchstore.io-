import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-[#0c0c0c] text-[#f4f4f2] sm:min-h-[calc(100svh-5rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(13,92,99,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(13,92,99,0.2),_transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(#f4f4f2_1px,transparent_1px),linear-gradient(90deg,#f4f4f2_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <Container className="relative flex w-full flex-col gap-8 pb-16 pt-32 sm:pb-20 sm:pt-40">
        <span className="animate-fade-up text-xs font-semibold uppercase tracking-[0.32em] text-[#0d5c63]">
          Fall Collection — Now Live
        </span>
        <h1 className="animate-fade-up animate-delay-100 sr-only">B&C Merch Store</h1>
        <div className="animate-fade-up animate-delay-100 w-full max-w-3xl">
          <Image
            src="/images/brand/bc-logo.png"
            alt="B&C"
            width={960}
            height={320}
            priority
            className="h-auto w-full"
          />
        </div>
        <div className="animate-fade-up animate-delay-200 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-lg text-[#f4f4f2]/75 sm:text-xl">
            Wear the brand. Build the culture.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "bg-[#0d5c63] text-[#f4f4f2] hover:bg-[#0d5c63]/90",
              })}
            >
              Shop the Collection
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "border-[#f4f4f2]/30 bg-transparent text-[#f4f4f2] hover:bg-[#f4f4f2]/10",
              })}
            >
              Our story
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
