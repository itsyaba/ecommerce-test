"use client";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
  color?: string;
  sku?: string | null;
};

const CART_KEY = "cart";

export function readCart(): Record<number, CartItem> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<number, CartItem>;
    return parsed || {};
  } catch {
    return {};
  }
}

export function writeCart(items: Record<number, CartItem>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // notify listeners (navbar, cart page)
  window.dispatchEvent(new Event("cart-change"));
}

export function addToCart(item: CartItem) {
  const cart = readCart();
  const existing = cart[item.id];
  const nextQty = (existing?.quantity || 0) + item.quantity;
  cart[item.id] = { ...existing, ...item, quantity: nextQty };
  writeCart(cart);
}

export function removeFromCart(productId: number) {
  const cart = readCart();
  delete cart[productId];
  writeCart(cart);
}

export function setItemQuantity(productId: number, quantity: number) {
  const cart = readCart();
  if (!cart[productId]) return;
  cart[productId].quantity = Math.max(1, quantity);
  writeCart(cart);
}

export function clearCart() {
  writeCart({});
}


