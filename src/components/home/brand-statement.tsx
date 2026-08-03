import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

const STATS = [
  { value: "2019", label: "Founded" },
  { value: "16", label: "Core Styles" },
  { value: "40k+", label: "Pieces Worn" },
  { value: "100%", label: "Designed In-House" },
];

export function BrandStatement() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col items-center gap-12 text-center">
        <Reveal className="flex max-w-2xl flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0d5c63]">
            The Statement
          </span>
          <p className="font-display text-2xl font-semibold leading-snug tracking-tight text-[#0c0c0c] sm:text-3xl">
            A&amp;C isn&rsquo;t about chasing trends — it&rsquo;s about building pieces
            that outlast them. Every drop starts with fabric first, fit second, and
            branding last.
          </p>
        </Reveal>
        <Reveal
          delay={100}
          className="grid w-full max-w-3xl grid-cols-2 gap-8 border-t border-[#0c0c0c]/10 pt-10 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1.5">
              <span className="font-display text-3xl font-bold text-[#0c0c0c] sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-[#0c0c0c]/50">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
