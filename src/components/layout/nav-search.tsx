"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { withBasePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

type NavSearchProps = {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
};

function buildShopSearchHref(
  query: string,
  currentParams: URLSearchParams,
  preserveFilters: boolean,
) {
  const params = preserveFilters
    ? new URLSearchParams(currentParams.toString())
    : new URLSearchParams();

  const q = query.trim();
  if (q) params.set("search", q);
  else params.delete("search");

  const qs = params.toString();
  return qs ? `/shop/?${qs}` : "/shop/";
}

function NavSearchForm({
  className,
  inputClassName,
  autoFocus,
  onNavigate,
}: NavSearchProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputId = React.useId();
  const onShop =
    pathname === "/shop" ||
    pathname === "/shop/" ||
    pathname.startsWith("/shop/");

  const urlSearch = searchParams.get("search") ?? "";
  const [value, setValue] = React.useState(urlSearch);
  const [prevUrlSearch, setPrevUrlSearch] = React.useState(urlSearch);

  // Keep the field aligned with the URL when search changes from elsewhere.
  if (urlSearch !== prevUrlSearch) {
    setPrevUrlSearch(urlSearch);
    setValue(urlSearch);
  }

  function goToResults(rawQuery: string) {
    const href = buildShopSearchHref(rawQuery, searchParams, onShop);
    // Full navigation so query changes always apply on static GitHub Pages,
    // including when already on /shop with a previous search.
    window.location.assign(withBasePath(href));
    onNavigate?.();
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToResults(value);
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn("relative flex min-w-0 items-center", className)}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <input
        id={inputId}
        type="search"
        name="search"
        value={value}
        autoFocus={autoFocus}
        autoComplete="off"
        placeholder="Search merch…"
        onChange={(event) => setValue(event.target.value)}
        className={cn(
          "h-10 w-full rounded-md border border-[#0c0c0c]/15 bg-white py-2 pl-3 pr-10 text-sm text-[#0c0c0c] outline-none transition-colors placeholder:text-[#0c0c0c]/40 focus-visible:border-[#0d5c63]/50 focus-visible:ring-2 focus-visible:ring-[#0d5c63]/30",
          inputClassName,
        )}
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 inline-flex size-8 items-center justify-center rounded-md text-[#0c0c0c]/55 transition-colors hover:bg-[#0c0c0c]/5 hover:text-[#0c0c0c]"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
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
