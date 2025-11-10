"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchProducts, resetProducts, setSearchTerm, setSelectedCategory } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";

const LIMIT = 10;

export function ProductsSection() {
  const dispatch = useAppDispatch();
  const { items, status, hasMore, skip, isLoadingMore, searchTerm, selectedCategory, error } = useAppSelector(
    (state) => state.products
  );

  const [searchValue, setSearchValue] = useState(searchTerm);
  const [categories, setCategories] = useState<string[]>([]);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetch('https://dummyjson.com/products/category-list')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm, category: selectedCategory }));
    }
  }, [dispatch, status, searchTerm, selectedCategory]);

  useEffect(() => {
    if (searchValue === searchTerm) {
      return;
    }

    const handler = setTimeout(() => {
      dispatch(setSearchTerm(searchValue));
      dispatch(resetProducts());
      dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm: searchValue, category: selectedCategory }));
    }, 400);

    return () => clearTimeout(handler);
  }, [dispatch, searchValue, searchTerm, selectedCategory]);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore && status !== "loading") {
          dispatch(fetchProducts({ skip, limit: LIMIT, searchTerm, category: selectedCategory }));
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [dispatch, hasMore, isLoadingMore, skip, status, searchTerm, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
    dispatch(resetProducts());
    dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm, category }));
  };

  const showInitialSkeleton = status === "loading" && items.length === 0;

  const productsGrid = useMemo(() => {
    if (showInitialSkeleton) {
      return Array.from({ length: LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ));
    }

    return items.map((product) => <ProductCard key={product.id} product={product} />);
  }, [items, showInitialSkeleton]);

  return (
    <section
      id="products"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 xl:max-w-7xl"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse trending gadgets, fashion, and lifestyle essentials refreshed daily.
          </p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for sneakers, smart home, wellness..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-11 rounded-full border-border pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-foreground">Categories</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
            className="rounded-full"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category)}
              className="rounded-full capitalize"
            >
              {category.replace(/-/g, " ")}
            </Button>
          ))}
        </div>
      </div>

      {error && status === "failed" ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
          <h3 className="text-lg font-semibold">We couldn&apos;t load products right now.</h3>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 h-full">
          {productsGrid}
        </div>
      )}

      <div ref={observerRef} className="h-6" />

      {isLoadingMore && !showInitialSkeleton && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`loading-more-${index}`} />
          ))}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">
          You&apos;ve reached the end of today&apos;s picks.
        </p>
      )}
    </section>
  );
}
