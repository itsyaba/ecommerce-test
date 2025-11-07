"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { fetchProducts, resetProducts, setSearchTerm } from "@/lib/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { ProductFilters } from "@/components/product-filters";

const LIMIT = 10;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { items, filteredItems, status, hasMore, skip, isLoadingMore, searchTerm, error, filters } =
    useAppSelector((state) => state.products);

  // Get initial search query from URL
  const urlQuery = searchParams.get("q") || "";
  const [searchValue, setSearchValue] = useState(urlQuery || searchTerm);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Sync URL query with Redux state on mount
  useEffect(() => {
    if (urlQuery && urlQuery !== searchTerm) {
      dispatch(setSearchTerm(urlQuery));
      dispatch(resetProducts());
      dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm: urlQuery }));
      setSearchValue(urlQuery);
    } else if (!urlQuery && status === "idle" && !searchTerm) {
      dispatch(fetchProducts({ skip: 0, limit: LIMIT, searchTerm: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQuery]);

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
  // Use filteredItems if filters are active, otherwise use items
  const hasActiveFilters =
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minRating !== undefined ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.brands && filters.brands.length > 0);

  // Use filteredItems when filters are active, otherwise fall back to items
  const displayItems = hasActiveFilters ? filteredItems : items;

  const productsGrid = useMemo(() => {
    if (showInitialSkeleton) {
      return Array.from({ length: LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ));
    }

    return displayItems.map((product) => <ProductCard key={product.id} product={product} />);
  }, [displayItems, showInitialSkeleton]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Search Products
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Find the perfect furniture piece for your home.
          </p>
        </div>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-12 rounded-full border-border pl-11 text-base"
            autoFocus
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-80 lg:shrink-0">
          <ProductFilters products={items} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {error && status === "failed" ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-destructive">
              <h3 className="text-lg font-semibold">We couldn&apos;t load products right now.</h3>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : searchValue && displayItems.length === 0 && !showInitialSkeleton ? (
            <div className="rounded-2xl border border-border bg-muted/50 p-12 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search terms or filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 ">{productsGrid}</div>
          )}

          <div ref={observerRef} className="h-6" />

          {isLoadingMore && !showInitialSkeleton && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={`loading-more-${index}`} />
              ))}
            </div>
          )}

          {!hasMore && displayItems.length > 0 && (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              You&apos;ve reached the end of the results.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
