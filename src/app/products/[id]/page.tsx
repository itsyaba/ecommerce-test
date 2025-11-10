"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ChevronRight,
  Minus,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Facebook,
  Twitter,
  Instagram,
  Link as LinkIcon,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toggleFavorite } from "@/lib/features/favorites/favoritesSlice";
import { fetchProductById, deleteProduct } from "@/lib/api";
import type { Product } from "@/lib/features/products/productsSlice";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { resetProducts, fetchProducts } from "@/lib/features/products/productsSlice";

const AVAILABLE_COLORS = [
  { name: "Beige", value: "#F5F5DC", hex: "bg-[#F5F5DC]" },
  { name: "Black", value: "#000000", hex: "bg-[#000000]" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = Boolean(favorites[productId]);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0].value);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // cart helpers
  const handleAddToCart = () => {
    if (!product) return;
    try {
      // defer import to avoid SSR issues
      const { addToCart } = require("@/lib/cart") as typeof import("@/lib/cart");
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] ?? null,
        quantity,
        color: selectedColor,
        sku: product.sku ?? null,
      });
      toast.success("Added to cart");
    } catch (err) {
      // fallback local implementation if needed
      toast.error("Failed to add to cart");
      console.error(err);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProductById(productId);
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product?.stock || 1)));
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!");
      setShowDeleteDialog(false);

      // Reset and refetch products to remove the deleted product
      dispatch(resetProducts());
      dispatch(fetchProducts({ skip: 0, limit: 10 }));

      // Redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete product. Please try again.";
      toast.error(errorMessage);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-6 w-64" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-semibold">Product Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link href="/">
            <Button className="mt-6">Back to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const totalReviews = product.reviews?.length || 0;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: product.category, href: `#${product.category}` },
    { label: product.brand, href: `#${product.brand}` },
    { label: product.title, href: null },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground">{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4" />}
          </div>
        ))}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={images[selectedImageIndex] || product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-4"
              priority
            />
            {product.discountPercentage > 0 && (
              <Badge className="absolute right-4 top-4 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-semibold">
                -{product.discountPercentage.toFixed(0)}% OFF
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImageIndex === index
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Type & Title */}
          <div>
            <p className="text-sm text-muted-foreground uppercase">{product.category}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "fill-muted stroke-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating.toFixed(1)} from {totalReviews} Reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1">
            {product.discountPercentage > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold">${discountedPrice.toFixed(2)}</span>
                  <span className="text-xl font-medium text-muted-foreground line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          {/* Available Color */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Available Color</label>
            <div className="flex gap-3">
              {AVAILABLE_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={cn(
                    "h-10 w-10 rounded-full border-2 transition-all",
                    selectedColor === color.value
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-border hover:border-primary/50"
                  )}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Select ${color.name} color`}
                />
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(Number(e.target.value), product.stock)))
                }
                className="h-10 w-20 text-center"
                min={1}
                max={product.stock}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                className="ml-1"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              variant={isFavorite ? "destructive" : "default"}
              disabled={product.stock === 0}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
            <Link href={`/products/${productId}/edit`}>
              <Button size="lg" variant="outline" className="flex-1 sm:flex-initial">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              size="lg"
              variant="destructive"
              className="flex-1 sm:flex-initial"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>

          {/* Product Metadata */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>SKU: {product.sku}</p>
            <p>Tags: {product.tags?.join(", ") || "N/A"}</p>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Share:</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  window.open(
                    `https://twitter.com/intent/tweet?url=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  window.open(
                    `https://www.instagram.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  window.open(
                    `https://www.linkedin.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b border-border bg-transparent p-0">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              {/* Description Section */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </Card>

              {/* Product Information */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Product Information</h3>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                    <span className="text-sm font-medium text-muted-foreground">SKU</span>
                    <span className="text-sm font-semibold">{product.sku}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Brand</span>
                    <span className="text-sm font-semibold">{product.brand}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Category</span>
                    <span className="text-sm font-semibold capitalize">{product.category}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Weight</span>
                    <span className="text-sm font-semibold">{product.weight} kg</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Dimensions</span>
                    <span className="text-sm font-semibold">
                      {product.dimensions.width} × {product.dimensions.height} ×{" "}
                      {product.dimensions.depth} cm
                    </span>
                  </div>
                  {product.minimumOrderQuantity && (
                    <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Minimum Order
                      </span>
                      <span className="text-sm font-semibold">
                        {product.minimumOrderQuantity} units
                      </span>
                    </div>
                  )}
                  {product.stock !== undefined && (
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Stock</span>
                      <span className="text-sm font-semibold">{product.stock} available</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Shipping & Policies */}
              {(product.warrantyInformation ||
                product.shippingInformation ||
                product.returnPolicy) && (
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Shipping & Policies</h3>
                  <div className="space-y-4">
                    {product.warrantyInformation && (
                      <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Warranty</span>
                        <span className="text-sm font-semibold">{product.warrantyInformation}</span>
                      </div>
                    )}
                    {product.shippingInformation && (
                      <div className="flex flex-col gap-1 border-b border-border pb-3 sm:flex-row sm:justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Shipping</span>
                        <span className="text-sm font-semibold">{product.shippingInformation}</span>
                      </div>
                    )}
                    {product.returnPolicy && (
                      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Return Policy
                        </span>
                        <span className="text-sm font-semibold">{product.returnPolicy}</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <Card className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Review List</h3>
                  <span className="text-sm text-muted-foreground">
                    Showing 1-{Math.min(2, totalReviews)} of {totalReviews} results
                  </span>
                </div>
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.slice(0, 2).map((review, index) => (
                      <Card key={index} className="p-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {review.reviewerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{review.reviewerName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(review.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "fill-muted stroke-muted-foreground"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <div className="flex items-center gap-4 pt-2">
                              <Button variant="ghost" size="sm" className="h-8 gap-2">
                                <ThumbsUp className="h-4 w-4" />
                                <span className="text-xs">44</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 gap-2">
                                <ThumbsDown className="h-4 w-4" />
                                <span className="text-xs">0</span>
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-6 text-center">
                      <p className="text-muted-foreground">
                        No reviews yet. Be the first to review!
                      </p>
                    </Card>
                  )}
                </div>
              </div>

              {/* Rating Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Newest
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Newest</DropdownMenuItem>
                      <DropdownMenuItem>Oldest</DropdownMenuItem>
                      <DropdownMenuItem>Highest Rating</DropdownMenuItem>
                      <DropdownMenuItem>Lowest Rating</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Card className="p-6 text-center">
                  <div className="text-4xl font-bold">{product.rating.toFixed(1)}</div>
                  <div className="mt-2 flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(product.rating)
                            ? "fill-primary text-primary"
                            : "fill-muted stroke-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">({totalReviews} Reviews)</p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-6">
            <Card className="p-6">
              <p className="text-muted-foreground">Discussion feature coming soon!</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete the product "{product?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
