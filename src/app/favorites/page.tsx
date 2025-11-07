"use client";

import { useAppSelector } from "@/hooks/use-redux";
import { ProductCard } from "@/components/product-card";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.items);
  const favoriteProducts = Object.values(favorites);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          My Favorites
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {favoriteProducts.length === 0
            ? "You haven't favorited any products yet."
            : `You have ${favoriteProducts.length} favorite product${
                favoriteProducts.length > 1 ? "s" : ""
              }.`}
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold">No favorites yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start exploring our collection and add products you love to your favorites.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
