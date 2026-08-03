"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type NavSearchProps = {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

function NavSearchForm({
  className,
  inputClassName,
  autoFocus,
  onNavigate,
}: NavSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputId = React.useId();
  const onShop =
    pathname === "/shop" ||
    pathname === "/shop/" ||
    pathname.startsWith("/shop/");

  const urlSearch = searchParams.get("search") ?? "";

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("search") ?? "").trim();
    const params = new URLSearchParams(onShop ? searchParams.toString() : "");
    if (q) params.set("search", q);
    else params.delete("search");

    const query = params.toString();
    router.push(query ? `/shop/?${query}` : "/shop/");
    onNavigate?.();
  }

  return (
    <form
      key={urlSearch}
      role="search"
      onSubmit={submit}
      className={cn("relative flex min-w-0 items-center", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3 size-4 text-[#0c0c0c]/40"
        aria-hidden="true"
      />
      <input
        id={inputId}
        type="search"
        name="search"
        defaultValue={urlSearch}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Search merch…"
        className={cn(
          "h-10 w-full rounded-md border border-[#0c0c0c]/15 bg-white pl-9 pr-3 text-sm text-[#0c0c0c] outline-none transition-colors placeholder:text-[#0c0c0c]/40 focus-visible:border-[#0d5c63]/50 focus-visible:ring-2 focus-visible:ring-[#0d5c63]/30",
          inputClassName,
        )}
      />
    </form>
  );
}

/** Header/mobile search that navigates to `/shop/?search=…` results. */
export function NavSearch(props: NavSearchProps) {
  return (
    <React.Suspense
      fallback={
        <div
          className={cn(
            "h-10 w-full max-w-xs animate-pulse rounded-md bg-[#0c0c0c]/5",
            props.className,
          )}
          aria-hidden="true"
        />
      }
    >
      <NavSearchForm {...props} />
    </React.Suspense>
  );
}
