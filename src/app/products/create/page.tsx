/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createProduct, type CreateProductData } from "@/lib/api";

const PRODUCT_CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
];

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProductData>({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    brand: "",
    category: "",
    discountPercentage: 0,
    sku: "",
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
    },
    tags: [],
    warrantyInformation: "",
    shippingInformation: "",
    returnPolicy: "",
    minimumOrderQuantity: 0,
    thumbnail: "",
    images: [],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("dimensions.")) {
      const dimensionField = name.split(".")[1] as "width" | "height" | "depth";
      setFormData((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions!,
          [dimensionField]: parseFloat(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" ||
          name === "stock" ||
          name === "discountPercentage" ||
          name === "weight" ||
          name === "minimumOrderQuantity"
            ? parseFloat(value) || 0
            : value,
      }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setImagesInput(value);
    const images = value
      .split(",")
      .map((img) => img.trim())
      .filter((img) => img.length > 0);
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Title is required");
        setIsLoading(false);
        return;
      }
      if (!formData.description.trim()) {
        toast.error("Description is required");
        setIsLoading(false);
        return;
      }
      if (formData.price <= 0) {
        toast.error("Price must be greater than 0");
        setIsLoading(false);
        return;
      }
      if (formData.stock < 0) {
        toast.error("Stock cannot be negative");
        setIsLoading(false);
        return;
      }
      if (!formData.brand.trim()) {
        toast.error("Brand is required");
        setIsLoading(false);
        return;
      }
      if (!formData.category) {
        toast.error("Category is required");
        setIsLoading(false);
        return;
      }

      // Clean up form data - remove empty optional fields
      const cleanedData: CreateProductData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        brand: formData.brand,
        category: formData.category,
      };

      // Add optional fields only if they have values
      if (formData.discountPercentage && formData.discountPercentage > 0) {
        cleanedData.discountPercentage = formData.discountPercentage;
      }
      if (formData.sku && formData.sku.trim()) {
        cleanedData.sku = formData.sku;
      }
      if (formData.weight && formData.weight > 0) {
        cleanedData.weight = formData.weight;
      }
      if (
        formData.dimensions &&
        (formData.dimensions.width > 0 ||
          formData.dimensions.height > 0 ||
          formData.dimensions.depth > 0)
      ) {
        cleanedData.dimensions = formData.dimensions;
      }
      if (formData.tags && formData.tags.length > 0) {
        cleanedData.tags = formData.tags;
      }
      if (formData.warrantyInformation && formData.warrantyInformation.trim()) {
        cleanedData.warrantyInformation = formData.warrantyInformation;
      }
      if (formData.shippingInformation && formData.shippingInformation.trim()) {
        cleanedData.shippingInformation = formData.shippingInformation;
      }
      if (formData.returnPolicy && formData.returnPolicy.trim()) {
        cleanedData.returnPolicy = formData.returnPolicy;
      }
      if (formData.minimumOrderQuantity && formData.minimumOrderQuantity > 0) {
        cleanedData.minimumOrderQuantity = formData.minimumOrderQuantity;
      }
      if (formData.thumbnail && formData.thumbnail.trim()) {
        cleanedData.thumbnail = formData.thumbnail;
      }
      if (formData.images && formData.images.length > 0) {
        cleanedData.images = formData.images;
      }

      await createProduct(cleanedData);

      toast.success(
        "Product created successfully! (Note: This is a demo - product is not persisted)"
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        brand: "",
        category: "",
        discountPercentage: 0,
        sku: "",
        weight: 0,
        dimensions: {
          width: 0,
          height: 0,
          depth: 0,
        },
        tags: [],
        warrantyInformation: "",
        shippingInformation: "",
        returnPolicy: "",
        minimumOrderQuantity: 0,
        thumbnail: "",
        images: [],
      });
      setTagsInput("");
      setImagesInput("");

      // Optionally redirect to home after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create product. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-linear-to-b from-sky-50 to-white px-4 py-12 dark:from-sky-950/20 dark:to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-900/20" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
        {/* Subtle arcing lines pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20 dark:opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 Q400,100 800,200 T1600,200"
            stroke="#0ea5e9"
            strokeWidth="1"
            fill="none"
            className="dark:text-sky-400"
          />
          <path
            d="M0,400 Q400,300 800,400 T1600,400"
            stroke="#3b82f6"
            strokeWidth="1"
            fill="none"
            className="dark:text-blue-400"
          />
          <path
            d="M0,600 Q400,500 800,600 T1600,600"
            stroke="#7dd3fc"
            strokeWidth="1"
            fill="none"
            className="dark:text-sky-300"
          />
        </svg>
      </div>

      <Card className="relative z-10 w-full max-w-4xl border-0 bg-linear-to-b from-sky-50/80 via-white/90 to-white shadow-2xl backdrop-blur-sm dark:from-sky-950/30 dark:via-gray-900/90 dark:to-gray-900">
        <CardHeader className="space-y-4">
          {/* Back button */}
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Icon */}
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-gray-100/80 dark:bg-gray-800/80">
            <Package className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Product
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-600 dark:text-gray-400">
            Add a new product to the catalog
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter product title"
                value={formData.title}
                onChange={handleChange}
                required
                className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                disabled={isLoading}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50"
                disabled={isLoading}
              />
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Price Field */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Price <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price || ""}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>

              {/* Stock Field */}
              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Stock <span className="text-red-500">*</span>
                </label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock || ""}
                  onChange={handleChange}
                  required
                  min="0"
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Brand Field */}
            <div className="space-y-2">
              <label
                htmlFor="brand"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Brand <span className="text-red-500">*</span>
              </label>
              <Input
                id="brand"
                name="brand"
                type="text"
                placeholder="Enter brand name"
                value={formData.brand}
                onChange={handleChange}
                required
                className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                disabled={isLoading}
              />
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="flex h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/50"
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Additional Information
              </h3>

              {/* Discount Percentage and SKU Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="discountPercentage"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Discount Percentage (%)
                  </label>
                  <Input
                    id="discountPercentage"
                    name="discountPercentage"
                    type="number"
                    placeholder="0"
                    value={formData.discountPercentage || ""}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="sku"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    SKU
                  </label>
                  <Input
                    id="sku"
                    name="sku"
                    type="text"
                    placeholder="Enter SKU"
                    value={formData.sku || ""}
                    onChange={handleChange}
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Weight and Minimum Order Quantity Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="weight"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Weight (kg)
                  </label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="0"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="minimumOrderQuantity"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Minimum Order Quantity
                  </label>
                  <Input
                    id="minimumOrderQuantity"
                    name="minimumOrderQuantity"
                    type="number"
                    placeholder="0"
                    value={formData.minimumOrderQuantity || ""}
                    onChange={handleChange}
                    min="0"
                    className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="dimensions.width"
                      className="text-xs text-gray-600 dark:text-gray-400"
                    >
                      Width
                    </label>
                    <Input
                      id="dimensions.width"
                      name="dimensions.width"
                      type="number"
                      placeholder="0"
                      value={formData.dimensions?.width || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="dimensions.height"
                      className="text-xs text-gray-600 dark:text-gray-400"
                    >
                      Height
                    </label>
                    <Input
                      id="dimensions.height"
                      name="dimensions.height"
                      type="number"
                      placeholder="0"
                      value={formData.dimensions?.height || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="dimensions.depth"
                      className="text-xs text-gray-600 dark:text-gray-400"
                    >
                      Depth
                    </label>
                    <Input
                      id="dimensions.depth"
                      name="dimensions.depth"
                      type="number"
                      placeholder="0"
                      value={formData.dimensions?.depth || ""}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tags
                </label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="Enter tags separated by commas (e.g., tag1, tag2, tag3)"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple tags with commas
                </p>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label
                  htmlFor="thumbnail"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Thumbnail URL
                </label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail || ""}
                  onChange={handleChange}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <label
                  htmlFor="images"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Image URLs
                </label>
                <Input
                  id="images"
                  type="text"
                  placeholder="Enter image URLs separated by commas"
                  value={imagesInput}
                  onChange={handleImagesChange}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple image URLs with commas
                </p>
              </div>

              {/* Warranty Information */}
              <div className="space-y-2">
                <label
                  htmlFor="warrantyInformation"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Warranty Information
                </label>
                <Input
                  id="warrantyInformation"
                  name="warrantyInformation"
                  type="text"
                  placeholder="e.g., 1 year warranty"
                  value={formData.warrantyInformation || ""}
                  onChange={handleChange}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>

              {/* Shipping Information */}
              <div className="space-y-2">
                <label
                  htmlFor="shippingInformation"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Shipping Information
                </label>
                <Input
                  id="shippingInformation"
                  name="shippingInformation"
                  type="text"
                  placeholder="e.g., Ships in 1-2 business days"
                  value={formData.shippingInformation || ""}
                  onChange={handleChange}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>

              {/* Return Policy */}
              <div className="space-y-2">
                <label
                  htmlFor="returnPolicy"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Return Policy
                </label>
                <Input
                  id="returnPolicy"
                  name="returnPolicy"
                  type="text"
                  placeholder="e.g., 30 days return policy"
                  value={formData.returnPolicy || ""}
                  onChange={handleChange}
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 px-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-lg bg-gray-900 text-base font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
