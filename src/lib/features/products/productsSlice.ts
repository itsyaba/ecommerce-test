import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { api } from "@/lib/api";
import { isAxiosError } from "axios";

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Record<string, unknown>;
  images: string[];
  thumbnail: string;
};

type FetchProductsArgs = {
  skip: number;
  limit?: number;
  searchTerm?: string;
};

type FetchProductsResponse = {
  total: number;
  products: Product[];
};

export const fetchProducts = createAsyncThunk<
  FetchProductsResponse,
  FetchProductsArgs,
  { rejectValue: string }
>("products/fetchProducts", async ({ skip, limit = 10, searchTerm }, thunkApi) => {
  try {
    const params: Record<string, string | number> = {
      limit,
      skip,
    };

    let url = "/products";

    if (searchTerm && searchTerm.trim().length > 0) {
      params.q = searchTerm.trim();
      url = "/products/search";
    }

    const response = await api.get(url, { params });
    const { products, total } = response.data as FetchProductsResponse;

    return { products, total };
  } catch (error) {
    if (isAxiosError(error)) {
      return thunkApi.rejectWithValue(error.message);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return thunkApi.rejectWithValue(message);
  }
});

type ProductsState = {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  hasMore: boolean;
  skip: number;
  limit: number;
  searchTerm: string;
  isLoadingMore: boolean;
};

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  hasMore: true,
  skip: 0,
  limit: 10,
  searchTerm: "",
  isLoadingMore: false,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts(state) {
      state.items = [];
      state.skip = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        const isInitialLoad = action.meta.arg.skip === 0;
        if (isInitialLoad) {
          state.status = "loading";
          state.error = null;
          if (state.items.length === 0) {
            state.hasMore = true;
          }
        } else {
          state.isLoadingMore = true;
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const {
          meta: {
            arg: { skip },
          },
        } = action;

        if (skip === 0) {
          state.items = action.payload.products;
          state.status = "succeeded";
        } else {
          state.items = [...state.items, ...action.payload.products];
        }

        state.isLoadingMore = false;
        state.status = "succeeded";

        const received = action.payload.products.length;
        const total = action.payload.total;
        const nextSkip = skip + received;

        state.skip = nextSkip;
        state.hasMore = nextSkip < total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const isInitialLoad = action.meta.arg.skip === 0;
        state.error = action.payload ?? "Failed to fetch products";
        state.isLoadingMore = false;
        if (isInitialLoad) {
          state.status = "failed";
        }
      });
  },
});

export const { resetProducts, setSearchTerm } = productsSlice.actions;

export default productsSlice.reducer;

