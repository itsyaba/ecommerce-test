import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Product } from "@/lib/features/products/productsSlice";

type FavoritesState = {
  items: Record<number, Product>;
};

const FAVORITES_STORAGE_KEY = "furnizen_favorites";

const loadFavoritesFromStorage = (): Record<number, Product> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveFavoritesToStorage = (items: Record<number, Product>) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error);
  }
};

const initialState: FavoritesState = {
  items: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite(state, action: PayloadAction<Product>) {
      const product = action.payload;
      if (state.items[product.id]) {
        delete state.items[product.id];
      } else {
        state.items[product.id] = product;
      }
      saveFavoritesToStorage(state.items);
    },
    loadFavorites(state) {
      state.items = loadFavoritesFromStorage();
    },
  },
});

export const { toggleFavorite, loadFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
