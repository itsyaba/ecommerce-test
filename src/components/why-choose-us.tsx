"use client";

import Image from "next/image";
import { Truck, BadgeCheck, PhoneCall, RefreshCcw, ShoppingBag, Store } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 my-16 grid gap-12">
        {/* Top block: Why Choose Us */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <DecorDots />
            <div className="relative overflow-hidden rounded-3xl bg-muted shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1523475472560-d2df97ec485c?q=80&w=1600&auto=format&fit=crop"
                alt="Modern retail space with lifestyle products"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Why Choose Us</h2>
            <p className="text-muted-foreground">
              ShopSphere curates the best from leading brands, boutique makers, and innovative
              start-ups. From doorstep delivery to loyalty rewards, we make upgrading your lifestyle
              effortless.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Feature
                icon={<Truck className="h-5 w-5" />}
                title="Fast & Free Shipping"
                description="Quick delivery on popular items with order tracking from warehouse to your door."
              />
              <Feature
                icon={<ShoppingBag className="h-5 w-5" />}
                title="Easy to Shop"
                description="Smart filters, rich product media, and authentic reviews simplify every purchase."
              />
              <Feature
                icon={<PhoneCall className="h-5 w-5" />}
                title="24/7 Support"
                description="Real people ready to help with sizing, specs, warranty claims, and gifting."
              />
              <Feature
                icon={<RefreshCcw className="h-5 w-5" />}
                title="Hassle-free Returns"
                description="30-day returns on eligible items—returns labels included inside every box."
              />
            </div>
          </div>
        </div>

        {/* Bottom block: Design help */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-3 gap-4">
              <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm col-span-2">
                <Image
                  src="https://images.unsplash.com/photo-1685640206182-c51b8aa9b686?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1469"
                  alt="Curated lifestyle products on a table"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1462396881884-de2c07cb95ed?q=80&w=1200&auto=format&fit=crop"
                  alt="Modern gadget displayed on podium"
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              We Help You Shop Smarter Across Every Category
            </h3>
            <p className="text-muted-foreground">
              Tap into personal shoppers who compare specs, source limited releases, and build carts
              tailored to your lifestyle. We make confident choices easy—online or in store.
            </p>
            <ul className="space-y-3">
              <ListItem text="Complimentary styling and gifting consultations for every budget" />
              <ListItem text="Sustainable and emerging brands spotlighted weekly" />
              <ListItem text="Verified buyer photos ensure you know exactly what arrives" />
              <ListItem text="In-store pickup and same-day couriers in select cities" />
            </ul>
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Join the ShopSphere Insider community
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-muted-foreground">
      <Store className="h-4 w-4 text-primary" />
      {text}
    </li>
  );
}

function DecorDots() {
  return (
    <div className="pointer-events-none absolute -left-6 -top-6 hidden h-28 w-28 grid-cols-6 gap-2 opacity-60 sm:grid">
      {Array.from({ length: 36 }).map((_, i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary/30" />
      ))}
    </div>
  );
}
