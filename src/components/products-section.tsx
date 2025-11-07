"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { fetchProducts, resetProducts, setSearchTerm } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";

const LIMIT = 10;

export function ProductsSection() {
  const dispatch = useAppDispatch();
  const { items, status, hasMore, skip, isLoadingMore, searchTerm, error } = useAppSelector(
    (state) => state.products
  );

  const [searchValue, setSearchValue] = useState(searchTerm);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm }));
    }
  }, [dispatch, status, searchTerm]);

  useEffect(() => {
    if (searchValue === searchTerm) {
      return;
    }

    const handler = setTimeout(() => {
      dispatch(setSearchTerm(searchValue));
      dispatch(resetProducts());
      dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm: searchValue }));
    }, 400);

    return () => clearTimeout(handler);
  }, [dispatch, searchValue, searchTerm]);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore && status !== "loading") {
          dispatch(fetchProducts({ skip, limit: LIMIT, searchTerm }));
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [dispatch, hasMore, isLoadingMore, skip, status, searchTerm]);

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
      id="collection"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 xl:max-w-7xl"
    >
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Curated Collection
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore handcrafted pieces sourced from artisans across the globe.
          </p>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-11 rounded-full border-border pl-10"
          />
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
          You&apos;ve reached the end of the collection.
        </p>
      )}
    </section>
  );
}
