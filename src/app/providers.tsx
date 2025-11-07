"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";

import { store } from "@/lib/store";
import { loadFavorites } from "@/lib/features/favorites/favoritesSlice";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    // Load favorites from localStorage on mount
    store.dispatch(loadFavorites());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

