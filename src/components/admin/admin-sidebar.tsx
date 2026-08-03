"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Menu,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { DemoSession } from "@/lib/auth/session";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/customers", label: "Customers", icon: Users },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  onNavigate,
  variant = "dark",
}: {
  pathname: string;
  onNavigate?: () => void;
  variant?: "dark" | "light";
}) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item && item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active && "bg-[#0d5c63] text-white",
              !active &&
                variant === "dark" &&
                "text-[#f4f4f2]/70 hover:bg-white/10 hover:text-[#f4f4f2]",
              !active &&
                variant === "light" &&
                "text-[#0c0c0c]/70 hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c]",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({
  session,
  signOutAction,
  variant = "dark",
}: {
  session: DemoSession;
  signOutAction: () => Promise<void>;
  variant?: "dark" | "light";
}) {
  const dark = variant === "dark";
  return (
    <div
      className={cn(
        "mt-auto flex flex-col gap-3 border-t pt-4",
        dark ? "border-white/10" : "border-[#0c0c0c]/10",
      )}
    >
      <div className="min-w-0">
        <p className={cn("truncate text-sm font-medium", dark ? "text-[#f4f4f2]" : "text-[#0c0c0c]")}>
          {session.name}
        </p>
        <p className={cn("truncate text-xs", dark ? "text-[#f4f4f2]/50" : "text-[#0c0c0c]/50")}>
          {session.email}
        </p>
      </div>
      <Link
        href="/"
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
          dark
            ? "text-[#f4f4f2]/70 hover:bg-white/10 hover:text-[#f4f4f2]"
            : "text-[#0c0c0c]/70 hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c]",
        )}
      >
        <Home className="h-4 w-4" aria-hidden="true" />
        Back to store
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
            dark
              ? "text-[#f4f4f2]/70 hover:bg-white/10 hover:text-[#f4f4f2]"
              : "text-[#0c0c0c]/70 hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c]",
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );
}

export interface AdminSidebarProps {
  session: DemoSession;
  signOutAction: () => Promise<void>;
}

export function AdminSidebar({ session, signOutAction }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0c0c0c] px-4 py-6 md:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0d5c63] text-sm font-bold text-white">
            AC
          </span>
          <span className="text-sm font-semibold tracking-wide text-[#f4f4f2]">
            A&C Admin
          </span>
        </Link>
        <NavLinks pathname={pathname} />
        <SidebarFooter session={session} signOutAction={signOutAction} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-[#0c0c0c]/10 bg-[#0c0c0c] px-4 py-3 md:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0d5c63] text-sm font-bold text-white">
            AC
          </span>
          <span className="text-sm font-semibold tracking-wide text-[#f4f4f2]">
            A&C Admin
          </span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open admin menu"
          className="text-[#f4f4f2] hover:bg-white/10 hover:text-[#f4f4f2]"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="flex max-w-xs flex-col">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <Link
            href="/admin"
            className="mb-8 flex items-center gap-2 px-1"
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0d5c63] text-sm font-bold text-white">
              AC
            </span>
            <span className="text-sm font-semibold tracking-wide text-[#0c0c0c]">
              A&C Admin
            </span>
          </Link>
          <NavLinks
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            variant="light"
          />
          <SidebarFooter session={session} signOutAction={signOutAction} variant="light" />
        </SheetContent>
      </Sheet>
    </>
  );
}
