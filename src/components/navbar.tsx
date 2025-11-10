/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Heart, LogOut, Plus, User, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/hooks/use-redux";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const favorites = useAppSelector((state) => state.favorites.items);
  const favoritesCount = Object.keys(favorites).length;
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error(e);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    const handleAuthChange = () => checkAuth();
    window.addEventListener("auth-change", handleAuthChange);
    const updateCartCount = () => {
      try {
        const raw = localStorage.getItem("cart");
        if (!raw) {
          setCartCount(0);
          return;
        }
        const items = JSON.parse(raw) as Record<string, { quantity: number }>;
        const total = Object.values(items).reduce((sum, it) => sum + (it.quantity || 0), 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-change", updateCartCount);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-change", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
    }
    router.push("/");
    router.refresh();
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

        <div className="hidden md:flex items-center justify-center gap-6 px-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/#products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Products
          </Link>
          <Link href="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Favorites
          </Link>
          <Link href="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full mr-1">
              <ShoppingCart className="h-5 w-5 text-foreground hover:text-primary" />
              {cartCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="relative rounded-full mr-3">
              <Heart className="h-5 w-5 text-foreground hover:fill-primary hover:text-primary" />
              {favoritesCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </Badge>
              )}
              <span className="sr-only">Favorites</span>
            </Button>
          </Link>
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="hidden rounded-full sm:flex">
                  <User className="h-4 w-4 text-foreground hover:fill-primary hover:text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/products/create" className="flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Create a new product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="lg" variant="default" className="hidden rounded-sm sm:inline-flex">
                Log in
              </Button>
            </Link>
          )}

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
              <div className="flex flex-col gap-3">
                <Link href="/cart">
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <Badge className="ml-2 h-5 min-w-[1.25rem] rounded-full px-1.5 text-xs">
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    Home
                  </Button>
                </Link>
                <Link href="/#products" className="w-full">
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    Products
                  </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    <Heart className="mr-2 h-4 w-4 hover:fill-primary hover:text-primary" />
                    My Favorites
                    {favoritesCount > 0 && (
                      <Badge className="ml-2 h-5 min-w-[1.25rem] rounded-full px-1.5 text-xs">
                        {favoritesCount > 99 ? "99+" : favoritesCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/#about" className="w-full">
                  <Button variant="outline" className="w-full rounded-full" size="lg">
                    About
                  </Button>
                </Link>
                {user ? (
                  <>
                    <Link href="/products/create">
                      <Button className="w-full rounded-full" size="lg">
                        <Plus className="mr-2 h-4 w-4" />
                        Create a new product
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full rounded-full"
                      size="lg"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <Link href="/login">
                    <Button variant="outline" className="w-full rounded-full" size="lg">
                      Log in
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
