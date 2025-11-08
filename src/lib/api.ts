/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Product } from "@/lib/features/products/productsSlice";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  // Note: withCredentials removed due to CORS limitations with DummyJSON
  // Tokens are stored in localStorage instead
});

export type ApiError = {
  message: string;
};

// Fetch a single product by ID
export const fetchProductById = async (id: number): Promise<Product> => {
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
  const response = await api.post("/products/add", productData);
  return response.data as Product;
};

// Update a product
export type UpdateProductData = Partial<CreateProductData>;

export const updateProduct = async (
  id: number,
  productData: UpdateProductData
): Promise<Product> => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data as Product;
};

// Delete a product
export const deleteProduct = async (
  id: number
): Promise<Product & { isDeleted: boolean; deletedOn: string }> => {
  const response = await api.delete(`/products/${id}`);
  return response.data as Product & { isDeleted: boolean; deletedOn: string };
};
