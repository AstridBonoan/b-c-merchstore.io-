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
    default: "B&C Merch Store — Wear the brand. Build the culture.",
    template: "%s | B&C Merch Store",
  },
  description:
    "B&C Merch Store is premium streetwear built for everyday wear — clean tees, heavyweight hoodies, and considered accessories designed to build the culture.",
  keywords: [
    "B&C Merch Store",
    "streetwear",
    "premium apparel",
    "hoodies",
    "t-shirts",
    "merch",
  ],
  authors: [{ name: "B&C Merch Store" }],
  creator: "B&C Merch Store",
  openGraph: {
    type: "website",
    siteName: "B&C Merch Store",
    title: "B&C Merch Store — Wear the brand. Build the culture.",
    description:
      "Premium streetwear essentials — clean tees, heavyweight hoodies, and considered accessories.",
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "B&C Merch Store — Wear the brand. Build the culture.",
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
