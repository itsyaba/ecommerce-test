/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileText, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, type CreateProductData } from "@/lib/api";
import { cn } from "@/lib/utils";

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

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Woman", "Unisex"];

const DISCOUNT_TYPES = [
  "Chinese New Year Discount",
  "Summer Sale",
  "Winter Sale",
  "Black Friday",
  "Holiday Special",
  "Clearance",
];

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<
    CreateProductData & { sizes: string[]; genders: string[]; discountType: string }
  >({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    brand: "",
    category: "",
    discountPercentage: 0,
    discountType: "",
    sizes: [],
    genders: [],
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" || name === "discountPercentage"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleGenderToggle = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter((g) => g !== gender)
        : [...prev.genders, gender],
    }));
  };

  const handleImageAdd = (url: string) => {
    if (url.trim() && !selectedImages.includes(url.trim())) {
      setSelectedImages([...selectedImages, url.trim()]);
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url.trim()],
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
    if (mainImageIndex >= newImages.length) {
      setMainImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage as draft
    localStorage.setItem(
      "productDraft",
      JSON.stringify({ formData, selectedImages, mainImageIndex })
    );
    toast.success("Draft saved successfully!");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.title.trim()) {
        toast.error("Product name is required");
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
      if (!formData.category) {
        toast.error("Category is required");
        setIsLoading(false);
        return;
      }

      const cleanedData: CreateProductData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        stock: formData.stock,
        brand: formData.brand || "Unknown",
        category: formData.category,
      };

      if (formData.discountPercentage && formData.discountPercentage > 0) {
        cleanedData.discountPercentage = formData.discountPercentage;
      }
      if (selectedImages.length > 0) {
        cleanedData.images = selectedImages;
        cleanedData.thumbnail = selectedImages[0];
      }

      await createProduct(cleanedData);
      toast.success("Product created successfully!");

      // Clear draft
      localStorage.removeItem("productDraft");

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</h1>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Save Draft
            </Button>
            <Button
              type="submit"
              form="product-form"
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </div>

        <form id="product-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* General Information */}
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name Product
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Puffer Jacket With Pocket Detail"
                      required
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description Product
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description..."
                      required
                      rows={5}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Size
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pick Available Size</p>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={cn(
                            "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                            formData.sizes.includes(size)
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pick Available Gender
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => handleGenderToggle(gender)}
                          className={cn(
                            "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                            formData.genders.includes(gender)
                              ? "border-green-600 bg-green-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                          )}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing And Stock */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing And Stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Base Pricing
                    </label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={handleChange}
                      placeholder="47.55"
                      required
                      min="0"
                      step="0.01"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stock
                    </label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock || ""}
                      onChange={handleChange}
                      placeholder="77"
                      required
                      min="0"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Discount
                    </label>
                    <Input
                      name="discountPercentage"
                      type="number"
                      value={formData.discountPercentage || ""}
                      onChange={handleChange}
                      placeholder="10"
                      min="0"
                      max="100"
                      step="0.01"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Discount Type
                    </label>
                    <div className="relative">
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select discount type</option>
                        {DISCOUNT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Upload Img */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Img</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    {selectedImages[mainImageIndex] ? (
                      <Image
                        src={selectedImages[mainImageIndex]}
                        alt="Main product image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No image selected
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-4 gap-2">
                    {selectedImages.map((img, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-all",
                          mainImageIndex === index
                            ? "border-green-600"
                            : "border-gray-200 dark:border-gray-700"
                        )}
                        onClick={() => setMainImageIndex(index)}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 12.5vw"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageRemove(index);
                          }}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {selectedImages.length < 4 && (
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Enter image URL:");
                          if (url) handleImageAdd(url);
                        }}
                        className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-green-600 transition-colors hover:border-green-600 hover:bg-green-50 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <Plus className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Product Category
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select category</option>
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
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => {
                      const newCategory = prompt("Enter new category name:");
                      if (newCategory) {
                        toast.info("Category management feature coming soon!");
                      }
                    }}
                  >
                    Add Category
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
