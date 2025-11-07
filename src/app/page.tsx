import Link from "next/link";
import { Menu, LayoutDashboard, ArrowRight, ArrowUpRight } from "lucide-react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HeroSection from "@/components/hero";
import { ProductsSection } from "@/components/products-section";

const navLinks = [
  { href: "#collection", label: "Collection" },
  { href: "#service", label: "Service" },
  { href: "#project", label: "Projects" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export default async function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
              FZ
            </span>
            <span className="text-lg font-semibold sm:text-xl">Furnizen</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            {/* {session?.user ? ( */}
            {/* <>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="hidden items-center gap-2 rounded-full sm:flex"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </> */}
            {/* ) : ( */}
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost" className="hidden rounded-full sm:inline-flex">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="hidden rounded-full sm:inline-flex">
                  Sign up
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </>
            {/* )} */}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 space-y-6">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-semibold">Menu</span>
                  <ModeToggle />
                </div>
                <nav className="flex flex-col gap-4 text-base font-medium text-muted-foreground">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3">
                  {/* {session?.user ? ( */}
                  <>
                    <Link href="/dashboard">
                      <Button className="w-full rounded-full" size="lg">
                        Go to Dashboard
                        <LayoutDashboard className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                  {/* ) : ( */}
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full rounded-full" size="lg">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="w-full rounded-full" size="lg">
                        Create Account
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                  {/* )} */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <ProductsSection />
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-medium text-foreground">Furnizen • Crafted for Modern Living</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="#collection" className="hover:text-foreground">
              Collection
            </Link>
            <Link href="#service" className="hover:text-foreground">
              Concierge Service
            </Link>
            <Link href="mailto:hello@furnizen.com" className="hover:text-foreground">
              hello@furnizen.com
            </Link>
          </div>
          <p>© {new Date().getFullYear()} Furnizen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
