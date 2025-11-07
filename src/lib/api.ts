import axios from "axios";
import type { Product } from "@/lib/features/products/productsSlice";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
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
  const response = await api.get(`/products/${id}`);
  return response.data as Product;
};

