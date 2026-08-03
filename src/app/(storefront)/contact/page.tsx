import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the B&C Merch Store team — order questions, wholesale inquiries, and general support.",
};

const CONTACT_DETAILS = [
  { Icon: Mail, label: "hello@bcmerchstore.com", href: "mailto:hello@bcmerchstore.com" },
  { Icon: Phone, label: "+1 (555) 010-2024", href: "tel:+15550102024" },
  { Icon: MapPin, label: "Studio 14, Portland, OR", href: undefined },
];

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0d5c63]">
            Get in Touch
          </span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#0c0c0c] sm:text-4xl">
            We&rsquo;d love to hear from you
          </h1>
          <p className="text-[#0c0c0c]/65">
            Questions about an order, a wholesale inquiry, or just want to talk
            fabric — reach out and a real person on our small team will get back to
            you.
          </p>
          <ul className="flex flex-col gap-4">
            {CONTACT_DETAILS.map(({ Icon, label, href }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-[#0c0c0c]/75">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0c0c0c]/[0.06] text-[#0d5c63]">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {href ? (
                  <a href={href} className="transition-colors hover:text-[#0c0c0c]">
                    {label}
                  </a>
                ) : (
                  <span>{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#0c0c0c]/10 p-6 sm:p-10">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
