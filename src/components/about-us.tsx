"use client";

import Image from "next/image";

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1887&auto=format&fit=crop",
    alt: "Minimal retail display with lifestyle accessories",
  },
  {
    src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1887&auto=format&fit=crop",
    alt: "Modern workspace showcasing tech gadgets",
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1887&auto=format&fit=crop",
    alt: "Shelves with curated home and lifestyle products",
  },
];

export default function AboutUsSection() {
  return (
    <section id="about" className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8 xl:max-w-7xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            About Us
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Commerce Crafted for Everyday Life
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Founded in 2021, ShopSphere brings together independent makers, leading brands, and
            emerging tech to simplify how people discover products they love. From limited-edition
            drops to daily essentials, everything is selected with quality, value, and experience in
            mind.
          </p>
          <p className="text-sm text-muted-foreground sm:text-base">
            We believe shopping should feel inspiring and effortless. Our team blends data insight,
            design thinking, and hands-on curation to deliver an omnichannel experience that keeps
            customers coming back.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <div
              key={item.src}
              className="overflow-hidden rounded-2xl border border-border bg-muted/30 transition hover:scale-[1.01]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={640}
                height={480}
                className="h-56 w-full object-cover grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


