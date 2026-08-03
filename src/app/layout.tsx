import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "A&C Merch Store — Wear the brand. Build the culture.",
    template: "%s | A&C Merch Store",
  },
  description:
    "A&C Merch Store is premium streetwear built for everyday wear — clean tees, heavyweight hoodies, and considered accessories designed to build the culture.",
  keywords: [
    "A&C Merch Store",
    "streetwear",
    "premium apparel",
    "hoodies",
    "t-shirts",
    "merch",
  ],
  authors: [{ name: "A&C Merch Store" }],
  creator: "A&C Merch Store",
  openGraph: {
    type: "website",
    siteName: "A&C Merch Store",
    title: "A&C Merch Store — Wear the brand. Build the culture.",
    description:
      "Premium streetwear essentials — clean tees, heavyweight hoodies, and considered accessories.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "A&C Merch Store — Wear the brand. Build the culture.",
    description:
      "Premium streetwear essentials — clean tees, heavyweight hoodies, and considered accessories.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f4f4f2] text-[#0c0c0c]">
        {children}
      </body>
    </html>
  );
}
