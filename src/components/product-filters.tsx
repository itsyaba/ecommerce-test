"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
  setFilters,
  clearFilters,
  type ProductFilters,
} from "@/lib/features/products/productsSlice";
import type { Product } from "@/lib/features/products/productsSlice";

type ProductFiltersProps = {
  products: Product[];
};

export function ProductFilters({ products }: ProductFiltersProps) {
  const dispatch = useAppDispatch();
  const currentFilters = useAppSelector((state) => state.products.filters);

  // Extract unique categories and brands from products
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return uniqueCategories.sort();
  }, [products]);

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map((p) => p.brand)));
    return uniqueBrands.sort();
  }, [products]);

  // Local state for filters
  const [minPrice, setMinPrice] = useState<string>(currentFilters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState<string>(currentFilters.maxPrice?.toString() || "");
  const [minRating, setMinRating] = useState<string>(currentFilters.minRating?.toString() || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.categories || []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentFilters.brands || []);

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Apply filters when local state changes
  useEffect(() => {
    const newFilters: ProductFilters = {};

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) newFilters.minPrice = min;
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) newFilters.maxPrice = max;
    }
    if (minRating) {
      const rating = parseFloat(minRating);
      if (!isNaN(rating)) newFilters.minRating = rating;
    }
    if (selectedCategories.length > 0) {
      newFilters.categories = selectedCategories;
    }
    if (selectedBrands.length > 0) {
      newFilters.brands = selectedBrands;
    }

    dispatch(setFilters(newFilters));
  }, [minPrice, maxPrice, minRating, selectedCategories, selectedBrands, dispatch]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    dispatch(clearFilters());
  };

  const hasActiveFilters =
    minPrice || maxPrice || minRating || selectedCategories.length > 0 || selectedBrands.length > 0;

  return (
    <Card className="sticky top-20 h-fit w-full space-y-6 rounded-2xl border-border p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-8 text-xs">
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Price Range</h4>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={`Min $${priceRange.min}`}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-9"
            min={priceRange.min}
            max={priceRange.max}
          />
          <Input
            type="number"
            placeholder={`Max $${priceRange.max}`}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-9"
            min={priceRange.min}
            max={priceRange.max}
          />
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Minimum Rating</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="0.0"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="h-9"
            min="0"
            max="5"
            step="0.1"
          />
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Categories</h4>
        <div className="max-h-48 space-y-2 overflow-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <label htmlFor={`category-${category}`} className="cursor-pointer text-sm capitalize">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Brands</h4>
        <div className="max-h-48 space-y-2 overflow-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center gap-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
