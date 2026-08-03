import type { Metadata } from "next";
import Link from "next/link";
import { requireCustomerSession } from "@/lib/auth/session";
import { Container } from "@/components/layout/container";
import { WishlistView } from "@/components/wishlist/wishlist-view";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: false },
};

export default async function AccountWishlistPage() {
  await requireCustomerSession("/account/wishlist");

  return (
    <Container className="py-10 md:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#0d5c63]">
            Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Wishlist
          </h1>
        </div>
        <Link
          href="/account"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Back
        </Link>
      </div>
      <WishlistView />
    </Container>
  );
}
