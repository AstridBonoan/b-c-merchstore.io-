"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart/cart-sheet";
import { useCartStore } from "@/lib/cart/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [lastPathname, setLastPathname] = React.useState(pathname);
  const itemCount = useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
  const toggleCart = useCartStore((state) => state.toggleOpen);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-300",
          scrolled
            ? "border-[#0c0c0c]/10 bg-[#f4f4f2]/85 backdrop-blur-md"
            : "border-transparent bg-[#f4f4f2]",
        )}
      >
        <Container className="flex h-16 items-center justify-between sm:h-20">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-[#0c0c0c] px-2 py-1.5"
            aria-label="B&C Merch Store home"
          >
            <BrandLogo width={120} height={40} priority className="h-6 w-auto sm:h-7" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-[#0d5c63]",
                    active ? "text-[#0c0c0c]" : "text-[#0c0c0c]/70",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/shop"
              aria-label="Search products"
              className="hidden size-10 items-center justify-center rounded-md text-[#0c0c0c]/80 transition-colors hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c] sm:inline-flex"
            >
              <Search className="size-[18px]" aria-hidden="true" />
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden size-10 items-center justify-center rounded-md text-[#0c0c0c]/80 transition-colors hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c] sm:inline-flex"
            >
              <User className="size-[18px]" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={toggleCart}
              aria-label={`Open bag${itemCount > 0 ? `, ${itemCount} items` : ""}`}
              className="relative inline-flex size-10 items-center justify-center rounded-md text-[#0c0c0c]/80 transition-colors hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c]"
            >
              <ShoppingBag className="size-[18px]" aria-hidden="true" />
              {itemCount > 0 ? (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[#0d5c63] text-[10px] font-semibold text-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="inline-flex size-10 items-center justify-center rounded-md text-[#0c0c0c]/80 transition-colors hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c] md:hidden"
            >
              <Menu className="size-[18px]" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex w-full max-w-xs flex-col gap-8">
          <SheetHeader className="flex-row items-center justify-between space-y-0">
            <SheetTitle className="sr-only">B&C menu</SheetTitle>
            <BrandLogo
              width={100}
              height={34}
              className="h-7 w-auto rounded-sm bg-[#0c0c0c]"
            />
          </SheetHeader>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[#0c0c0c] transition-colors hover:bg-[#0c0c0c]/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-[#0c0c0c] transition-colors hover:bg-[#0c0c0c]/5"
            >
              Account
            </Link>
          </nav>
          <Button
            variant="outline"
            className="mt-auto"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-4" aria-hidden="true" />
            Close menu
          </Button>
        </SheetContent>
      </Sheet>

      <CartSheet />
    </>
  );
}
