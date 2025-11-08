"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/products/${product.id}`}>
        <Card className="group relative h-[450px] cursor-pointer overflow-hidden rounded-[28px] border-none bg-transparent shadow-xl transition-transform duration-300 hover:scale-[1.02]">
          <div className="absolute inset-0">
            <Image
              src={product.images?.[0]}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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

              <div className="flex items-center justify-between flex-wrap">
                <div className="flex flex-col gap-1">
                  {product.discountPercentage > 0 ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold tracking-tight drop-shadow-sm">
                          ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                        <span className="rounded-full bg-red-500/90 px-2 py-0.5 text-xs font-semibold text-white">
                          -{product.discountPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white/60 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-semibold tracking-tight drop-shadow-sm">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "flex items-center gap-2 rounded-full bg-white/90 dark:bg-zinc-900/90 px-5 py-2 text-sm font-semibold text-foreground shadow-lg transition hover:bg-white",
                    isFavorite && "bg-primary text-primary-foreground hover:bg-primary"
                  )}
                  size="sm"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 transition",
                      isFavorite
                        ? "fill-primary-foreground text-primary-foreground"
                        : "text-foreground"
                    )}
                  />
                  {isFavorite ? "Favorited" : "Add to Favorite"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
