"use client";

import Image from "next/image";

import { Heart, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleFavorite } from "@/lib/features/favorites/favoritesSlice";
import type { Product } from "@/lib/features/products/productsSlice";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => Boolean(state.favorites.items[product.id]));

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(product));
  };

  return (
    <Card className="group relative h-[450px] overflow-hidden rounded-[28px] border-none bg-transparent shadow-xl">
      <div className="absolute inset-0">
        <Image
          src={product.images?.[0]}
          alt={product.title}
          fill
          // sizes="(min-width: 1024px) 280px, 60vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/50 to-black/80" />
      </div>

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-3 text-white">
          <Badge
            variant="secondary"
            className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide"
          >
            {product.category}
          </Badge>
          <span className="flex items-center gap-1 text-sm font-medium text-white/90">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-auto space-y-4 text-white">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-tight drop-shadow-sm sm:text-xl">
              {product.title}
            </h3>
            <p className="text-sm text-white/70 line-clamp-2">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold tracking-tight drop-shadow-sm">
              ${product.price.toFixed(2)}
            </span>
            <Button
              onClick={handleToggleFavorite}
              className={cn(
                "flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-foreground shadow-lg transition hover:bg-white",
                isFavorite && "bg-primary text-primary-foreground hover:bg-primary"
              )}
              size="sm"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition",
                  isFavorite ? "fill-primary-foreground text-primary-foreground" : "text-foreground"
                )}
              />
              {isFavorite ? "Favorited" : "Add to Favorite"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
