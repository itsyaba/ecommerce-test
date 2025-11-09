/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Product } from "@/lib/features/products/productsSlice";
import {
  getLocalProductById,
  addLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
  generateProductId,
} from "@/lib/storage/productsStorage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export type ApiError = {
  message: string;
};

// Fetch a single product by ID
export const fetchProductById = async (id: number): Promise<Product> => {
  // Check localStorage first
  const localProduct = getLocalProductById(id);
  if (localProduct) {
    return localProduct;
  }

  // If not in localStorage, fetch from API
  const response = await api.get(`/products/${id}`);
  return response.data as Product;
};

// Auth types
export type LoginCredentials = {
  username: string;
  password: string;
  expiresInMins?: number;
};

export type AuthResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

// Login user and get tokens
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data as AuthResponse;
};

// Get current authenticated user
export const getAuthUser = async (accessToken: string): Promise<any> => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Refresh auth session
export const refreshToken = async (
  refreshToken?: string,
  expiresInMins?: number
): Promise<RefreshTokenResponse> => {
  const response = await api.post("/auth/refresh", {
    refreshToken,
    expiresInMins,
  });
  return response.data as RefreshTokenResponse;
};

// Create a new product
export type CreateProductData = {
  title: string;
  description: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  discountPercentage?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  tags?: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  thumbnail?: string;
  images?: string[];
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  // Generate a unique ID for the new product
  const newId = generateProductId();

  // Create the product object with all required fields
  const newProduct: Product = {
    id: newId,
    title: productData.title,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    brand: productData.brand || "Unknown",
    category: productData.category,
    discountPercentage: productData.discountPercentage || 0,
    rating: 0, // Default rating
    tags: productData.tags || [],
    sku: productData.sku || `SKU-${newId}`,
    weight: productData.weight || 0,
    dimensions: productData.dimensions || {
      width: 0,
      height: 0,
      depth: 0,
    },
    warrantyInformation: productData.warrantyInformation,
    shippingInformation: productData.shippingInformation,
    returnPolicy: productData.returnPolicy,
    minimumOrderQuantity: productData.minimumOrderQuantity,
    images: productData.images || [],
    thumbnail: productData.thumbnail || productData.images?.[0] || "",
    reviews: [],
  };

  // Save to localStorage
  addLocalProduct(newProduct);

  // Still make API call for consistency (though it won't persist)
  try {
    await api.post("/products/add", productData);
  } catch (error) {
    // Ignore API errors since we're using localStorage
    console.warn("API call failed, but product saved to localStorage:", error);
  }

  return newProduct;
};

// Update a product
export type UpdateProductData = Partial<CreateProductData>;

export const updateProduct = async (
  id: number,
  productData: UpdateProductData
): Promise<Product> => {
  // Fetch the current product (from localStorage or API)
  const currentProduct = await fetchProductById(id);

  // Merge the updates with the current product
  const updatedProduct: Product = {
    ...currentProduct,
    ...productData,
    id, // Ensure ID doesn't change
    images: productData.images || currentProduct.images,
    thumbnail: productData.thumbnail || productData.images?.[0] || currentProduct.thumbnail,
  };

  // Save to localStorage
  updateLocalProduct(id, updatedProduct);

  // Still make API call for consistency (though it won't persist)
  try {
    await api.put(`/products/${id}`, productData);
  } catch (error) {
    // Ignore API errors since we're using localStorage
    console.warn("API call failed, but product updated in localStorage:", error);
  }

  return updatedProduct;
};

// Delete a product
export const deleteProduct = async (
  id: number
): Promise<Product & { isDeleted: boolean; deletedOn: string }> => {
  // Fetch the product first to return it
  const product = await fetchProductById(id);

  // Mark as deleted in localStorage
  deleteLocalProduct(id);

  // Still make API call for consistency (though it won't persist)
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    // Ignore API errors since we're using localStorage
    console.warn("API call failed, but product deleted from localStorage:", error);
  }

  return {
    ...product,
    isDeleted: true,
    deletedOn: new Date().toISOString(),
  };
};
