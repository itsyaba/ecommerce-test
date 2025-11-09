import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import {
  mergeProductsWithLocalStorage,
  getNewLocalProductsCount,
  getDeletedProductsCount,
} from "@/lib/storage/productsStorage";

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

export type ProductFilters = {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  categories?: string[];
  brands?: string[];
};

type FetchProductsArgs = {
  skip: number;
  limit?: number;
  searchTerm?: string;
  filters?: ProductFilters;
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

    // Always merge with localStorage changes to apply updates and filter deletions
    // Include new local products only on the first page (skip === 0)
    const isFirstPage = skip === 0;
    const mergedProducts = mergeProductsWithLocalStorage(products, isFirstPage);

    // Adjust total count to account for localStorage changes
    let adjustedTotal = total;
    if (isFirstPage) {
      const apiProductIds = new Set(products.map((p) => p.id));
      const newLocalCount = getNewLocalProductsCount(apiProductIds);
      const deletedCount = getDeletedProductsCount(products);
      adjustedTotal = total - deletedCount + newLocalCount;
    } else {
      // For subsequent pages, only account for deletions in this page
      const deletedCount = getDeletedProductsCount(products);
      adjustedTotal = total - deletedCount;
    }

    return { products: mergedProducts, total: Math.max(adjustedTotal, mergedProducts.length) };
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
  filteredItems: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
  hasMore: boolean;
  skip: number;
  limit: number;
  searchTerm: string;
  isLoadingMore: boolean;
  filters: ProductFilters;
};

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  hasMore: true,
  skip: 0,
  limit: 10,
  searchTerm: "",
  isLoadingMore: false,
  filters: {},
};

// Helper function to apply filters
const applyFilters = (products: Product[], filters: ProductFilters): Product[] => {
  return products.filter((product) => {
    // Price filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Rating filter
    if (filters.minRating !== undefined && product.rating < filters.minRating) {
      return false;
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(product.category)) {
        return false;
      }
    }

    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(product.brand)) {
        return false;
      }
    }

    return true;
  });
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts(state) {
      state.items = [];
      state.filteredItems = [];
      state.skip = 0;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setFilters(state, action: PayloadAction<ProductFilters>) {
      state.filters = action.payload;
      state.filteredItems = applyFilters(state.items, action.payload);
    },
    clearFilters(state) {
      state.filters = {};
      state.filteredItems = state.items;
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
          state.filteredItems = applyFilters(action.payload.products, state.filters);
          state.status = "succeeded";
        } else {
          const newItems = [...state.items, ...action.payload.products];
          state.items = newItems;
          state.filteredItems = applyFilters(newItems, state.filters);
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

export const { resetProducts, setSearchTerm, setFilters, clearFilters } = productsSlice.actions;

export default productsSlice.reducer;

