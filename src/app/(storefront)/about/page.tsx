import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind A&C Merch Store — premium streetwear built on fabric-first design and long-term wear.",
};

const VALUES = [
  {
    title: "Fabric first",
    body: "Every style starts with the material, not the print. Midweight jerseys, brushed fleece, and heavyweight canvas that earn their place in rotation.",
  },
  {
    title: "Considered detail",
    body: "Reinforced seams, tonal embroidery, matte hardware — the kind of finishing you notice on the tenth wear, not just the first.",
  },
  {
    title: "Built to last",
    body: "We design for the wash cycle, not the photo shoot. If it doesn't hold its shape after a season, it doesn't ship.",
  },
];

const TIMELINE = [
  {
    year: "2019",
    title: "Two friends, one tee",
    body: "A&C started as a single run of hand-screened tees sold out of a shared studio apartment.",
  },
  {
    year: "2021",
    title: "The core lineup",
    body: "We narrowed our focus to a tight collection of essentials — tees, hoodies, hats — refined over dozens of fit samples.",
  },
  {
    year: "2023",
    title: "Building the culture",
    body: "A&C became shorthand for a community, not just a logo — worn by makers, students, and neighborhood regulars alike.",
  },
  {
    year: "2026",
    title: "Where we are now",
    body: "Still small by design. Every piece is developed in-house and produced in limited runs to keep quality — and intention — high.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-[#0c0c0c]/10 bg-[#0c0c0c] py-20 text-[#f4f4f2] sm:py-28">
        <Container className="flex max-w-3xl flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0d5c63]">
            Our Story
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Wear the brand. Build the culture.
          </h1>
          <p className="text-lg text-[#f4f4f2]/70">
            A&amp;C Merch Store makes premium streetwear essentials for people who
            wear their clothes into the ground — then come back for more.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="flex flex-col gap-5">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#0c0c0c] sm:text-3xl">
              Designed for daily rotation
            </h2>
            <p className="text-[#0c0c0c]/70">
              We started A&amp;C because we couldn&rsquo;t find merch that felt as good
              as it looked. Most of it was either disposable fast fashion or precious
              limited drops that never left the closet. We wanted something in between
              — clothes built well enough to wear constantly, and designed carefully
              enough to still mean something after fifty washes.
            </p>
            <p className="text-[#0c0c0c]/70">
              Today that same philosophy runs through every piece we make: sixteen
              core styles, refined over years, produced in small batches, and
              obsessed over at the fabric level before we ever think about branding.
            </p>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-6">
            {VALUES.map((value) => (
              <div key={value.title} className="border-l-2 border-[#0d5c63] pl-5">
                <h3 className="text-base font-semibold text-[#0c0c0c]">{value.title}</h3>
                <p className="mt-1.5 text-sm text-[#0c0c0c]/65">{value.body}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-[#0c0c0c]/10 bg-[#0c0c0c]/[0.03] py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <Reveal>
            <SectionHeading eyebrow="Since 2019" title="How we got here" align="left" />
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item, index) => (
              <Reveal
                key={item.year}
                delay={index * 100}
                className="flex flex-col gap-2 border-t-2 border-[#0c0c0c] pt-4"
              >
                <span className="font-display text-2xl font-bold text-[#0c0c0c]">
                  {item.year}
                </span>
                <h3 className="text-sm font-semibold text-[#0c0c0c]">{item.title}</h3>
                <p className="text-sm text-[#0c0c0c]/60">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
