import Link from "next/link";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0d5c63]">
        404
      </span>
      <h1 className="font-display text-3xl font-bold tracking-tight text-[#0c0c0c] sm:text-4xl">
        We couldn&rsquo;t find that piece
      </h1>
      <p className="max-w-md text-sm text-[#0c0c0c]/60">
        It may have sold out or moved. Explore the full catalog to find your next
        favorite.
      </p>
      <Link href="/shop" className={buttonVariants({ size: "lg" })}>
        Back to shop
      </Link>
    </Container>
  );
}
