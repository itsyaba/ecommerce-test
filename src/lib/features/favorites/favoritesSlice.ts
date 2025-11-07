import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { Product } from "@/lib/features/products/productsSlice";

type FavoritesState = {
  items: Record<number, Product>;
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
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;

