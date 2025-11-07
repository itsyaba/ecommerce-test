"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { useState, FormEvent } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
            FZ
          </span>
          <span className="text-lg font-semibold sm:text-xl">Furnizen</span>
        </Link>

        <div className="flex flex-1 items-center justify-center gap-4 px-4">
          <form onSubmit={handleSearch} className="hidden w-full max-w-md sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-full border-border pl-10 pr-4"
              />
            </div>
          </form>
        </div>

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
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 rounded-full border-border pl-10 pr-4"
                  />
                </div>
              </form>
              <div className="flex flex-col gap-3">
                {/* {session?.user ? ( */}
                <>
                  <Link href="/dashboard">
                    <Button className="w-full rounded-full" size="lg">
                      Go to Dashboard
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
  );
}

