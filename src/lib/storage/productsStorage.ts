import type { Product } from "@/lib/features/products/productsSlice";

const STORAGE_KEYS = {
  LOCAL_PRODUCTS: "localProducts", // Newly created products
  UPDATED_PRODUCTS: "updatedProducts", // Updated products (id -> product)
  DELETED_PRODUCTS: "deletedProducts", // Deleted product IDs
} as const;

/**
 * Get all products from localStorage
 */
export const getLocalProducts = (): Product[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading local products from localStorage:", error);
    return [];
  }
};

/**
 * Get all updated products from localStorage
 */
export const getUpdatedProducts = (): Record<number, Product> => {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.UPDATED_PRODUCTS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading updated products from localStorage:", error);
    return {};
  }
};

/**
 * Get all deleted product IDs from localStorage
 */
export const getDeletedProducts = (): number[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DELETED_PRODUCTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading deleted products from localStorage:", error);
    return [];
  }
};

/**
 * Add a new product to localStorage
 */
export const addLocalProduct = (product: Product): void => {
  if (typeof window === "undefined") return;
  try {
    const localProducts = getLocalProducts();
    localProducts.push(product);
    localStorage.setItem(STORAGE_KEYS.LOCAL_PRODUCTS, JSON.stringify(localProducts));
  } catch (error) {
    console.error("Error adding product to localStorage:", error);
  }
};

/**
 * Update a product in localStorage
 */
export const updateLocalProduct = (id: number, product: Product): void => {
  if (typeof window === "undefined") return;
  try {
    const updatedProducts = getUpdatedProducts();
    updatedProducts[id] = product;
    localStorage.setItem(STORAGE_KEYS.UPDATED_PRODUCTS, JSON.stringify(updatedProducts));
  } catch (error) {
    console.error("Error updating product in localStorage:", error);
  }
};

/**
 * Delete a product (mark as deleted in localStorage)
 */
export const deleteLocalProduct = (id: number): void => {
  if (typeof window === "undefined") return;
  try {
    const deletedProducts = getDeletedProducts();
    if (!deletedProducts.includes(id)) {
      deletedProducts.push(id);
      localStorage.setItem(STORAGE_KEYS.DELETED_PRODUCTS, JSON.stringify(deletedProducts));
    }

    // Also remove from local products if it was a locally created product
    const localProducts = getLocalProducts();
    const filteredLocalProducts = localProducts.filter((p) => p.id !== id);
    if (filteredLocalProducts.length !== localProducts.length) {
      localStorage.setItem(STORAGE_KEYS.LOCAL_PRODUCTS, JSON.stringify(filteredLocalProducts));
    }

    // Remove from updated products
    const updatedProducts = getUpdatedProducts();
    if (updatedProducts[id]) {
      delete updatedProducts[id];
      localStorage.setItem(STORAGE_KEYS.UPDATED_PRODUCTS, JSON.stringify(updatedProducts));
    }
  } catch (error) {
    console.error("Error deleting product from localStorage:", error);
  }
};

/**
 * Get a single product by ID, checking localStorage first
 */
export const getLocalProductById = (id: number): Product | null => {
  if (typeof window === "undefined") return null;

  // Check if product is deleted
  const deletedProducts = getDeletedProducts();
  if (deletedProducts.includes(id)) {
    return null;
  }

  // Check updated products first
  const updatedProducts = getUpdatedProducts();
  if (updatedProducts[id]) {
    return updatedProducts[id];
  }

  // Check local products
  const localProducts = getLocalProducts();
  const localProduct = localProducts.find((p) => p.id === id);
  if (localProduct) {
    return localProduct;
  }

  return null;
};

/**
 * Merge API products with localStorage changes
 * - Remove deleted products
 * - Apply updates from localStorage
 * - Optionally add new products from localStorage (only on first page)
 */
export const mergeProductsWithLocalStorage = (
  apiProducts: Product[],
  includeNewLocalProducts: boolean = false
): Product[] => {
  const deletedIds = getDeletedProducts();
  const updatedProducts = getUpdatedProducts();

  // Filter out deleted products and apply updates
  const mergedProducts = apiProducts
    .filter((product) => !deletedIds.includes(product.id))
    .map((product) => {
      // Apply updates if the product was updated
      if (updatedProducts[product.id]) {
        return updatedProducts[product.id];
      }
      return product;
    });

  // Add local products that don't exist in API products (only if requested, typically for first page)
  if (includeNewLocalProducts) {
    const localProducts = getLocalProducts();
    const apiProductIds = new Set(apiProducts.map((p) => p.id));
    const newLocalProducts = localProducts.filter((p) => !apiProductIds.has(p.id));
    return [...mergedProducts, ...newLocalProducts];
  }
  
  return mergedProducts;
};

/**
 * Get count of new local products that aren't in the API
 */
export const getNewLocalProductsCount = (apiProductIds: Set<number>): number => {
  const localProducts = getLocalProducts();
  const deletedIds = getDeletedProducts();
  return localProducts.filter((p) => !apiProductIds.has(p.id) && !deletedIds.includes(p.id)).length;
};

/**
 * Get count of deleted products from the API products
 */
export const getDeletedProductsCount = (apiProducts: Product[]): number => {
  const deletedIds = getDeletedProducts();
  return apiProducts.filter((p) => deletedIds.includes(p.id)).length;
};

/**
 * Generate a unique ID for new products
 * Uses timestamp + random number to ensure uniqueness
 */
export const generateProductId = (): number => {
  // Generate a large number that's unlikely to collide with API IDs
  // API IDs are typically small (1, 2, 3, ...), so we use timestamp + random
  return Date.now() + Math.floor(Math.random() * 10000);
};

/**
 * Clear all localStorage data (useful for testing/reset)
 */
export const clearProductsStorage = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.LOCAL_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.UPDATED_PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.DELETED_PRODUCTS);
  } catch (error) {
    console.error("Error clearing products storage:", error);
  }
};

