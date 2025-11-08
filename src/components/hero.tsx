"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Leaf, Package, Sparkles, Palette } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Authentic Craftsmanship",
    description: "Celebrate artisan furniture built to last generations.",
    icon: Package,
  },
  {
    title: "Personalized Styling",
    description: "Design consultants tailor every room to your lifestyle.",
    icon: Palette,
  },
  {
    title: "Sustainable Materials",
    description: "Eco-conscious woods and fabrics sourced responsibly.",
    icon: Leaf,
  },
  {
    title: "Innovative Comfort",
    description: "Ergonomic silhouettes that blend form with function.",
    icon: Sparkles,
  },
];

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="bg-background">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="mx-auto grid w-full max-w-6xl grid-cols-1 lg:grid-cols-2 my-8 xl:max-w-7xl min-h-[80vh] gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={itemVariants as Variants}
          className="flex max-w-2xl flex-col gap-6 lg:gap-8"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            New Season • 2025 Collection
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Your Comfort Zone Begins with Furnizen
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Discover the perfect blend of quality, comfort, and modern design. Furnizen hand-selects
            signature pieces that refresh every room and reflect your unique taste.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
              <Link href="/collection">
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 rounded-full px-7 text-base"
            >
              <Link href="/favorites">
                Explore Favorites
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 rounded-3xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-2xl bg-background/60 p-4 shadow-sm shadow-black/5 dark:shadow-none"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={imageVariants as Variants}
          className="relative flex w-full flex-1 items-center justify-center h-[400px] sm:h-[500px] lg:h-full min-h-[400px]"
        >
          <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-muted shadow-xl h-full">
            <div className="absolute inset-0 -z-10 bg-linear-to-b from-primary/10 to-secondary/30" />
            <Image
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Modern lounge chair with neutral textiles"
              width={960}
              height={1600}
              className="h-full w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden h-24 w-24 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/40 sm:flex">
            <ArrowUpRight className="h-8 w-8" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
