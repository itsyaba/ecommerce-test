import Link from "next/link";

export function Footer() {
  return (
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
  );
}

