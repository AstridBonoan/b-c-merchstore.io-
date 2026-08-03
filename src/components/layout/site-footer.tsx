import Link from "next/link";
import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const SHOP_LINKS = [
  { href: "/shop?category=t-shirts", label: "T-Shirts" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=hats", label: "Hats" },
  { href: "/shop?category=accessories", label: "Accessories" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/shop", label: "Shop All" },
];

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", mark: "IG" },
  { href: "https://twitter.com", label: "Twitter / X", mark: "X" },
  { href: "https://youtube.com", label: "YouTube", mark: "YT" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c0c0c] text-[#f4f4f2]">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">
            B&amp;C
          </Link>
          <p className="max-w-xs text-sm text-[#f4f4f2]/60">
            Wear the brand. Build the culture. Premium streetwear essentials made for
            everyday rotation.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {SOCIAL_LINKS.map(({ href, label, mark }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-[#f4f4f2]/15 text-[11px] font-semibold tracking-wide text-[#f4f4f2]/70 transition-colors hover:border-[#f4f4f2]/40 hover:text-[#f4f4f2]"
              >
                {mark}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Shop">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4f4f2]/50">
            Shop
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#f4f4f2]/75 transition-colors hover:text-[#f4f4f2]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4f4f2]/50">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {COMPANY_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-[#f4f4f2]/75 transition-colors hover:text-[#f4f4f2]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4f4f2]/50">
            Stay in the loop
          </h3>
          <p className="text-sm text-[#f4f4f2]/60">
            New drops, restocks, and studio notes — no spam, unsubscribe anytime.
          </p>
          <NewsletterForm variant="compact" />
        </div>
      </Container>

      <div className="border-t border-[#f4f4f2]/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-[#f4f4f2]/50 sm:flex-row">
          <p>&copy; {year} B&amp;C Merch Store. All rights reserved.</p>
          <p>
            Built by{" "}
            <a
              href="https://bandcsoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#f4f4f2]/70 underline-offset-4 transition-colors hover:text-[#f4f4f2] hover:underline"
            >
              B&amp;C Software &amp; Web
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
