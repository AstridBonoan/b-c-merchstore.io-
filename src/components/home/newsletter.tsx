import { Container } from "@/components/layout/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Reveal } from "@/components/motion/reveal";

export function Newsletter() {
  return (
    <section className="border-t border-[#0c0c0c]/10 py-16 sm:py-24">
      <Container>
        <Reveal className="flex flex-col items-center gap-6 rounded-2xl bg-[#0c0c0c]/[0.04] px-6 py-14 text-center sm:px-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0d5c63]">
            Join the List
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#0c0c0c] sm:text-4xl">
            Get first access to new drops
          </h2>
          <p className="max-w-md text-sm text-[#0c0c0c]/65">
            Restocks, limited runs, and studio notes — straight to your inbox. No spam,
            unsubscribe anytime.
          </p>
          <NewsletterForm />
        </Reveal>
      </Container>
    </section>
  );
}
