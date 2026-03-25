/**
 * Xiroo Boutique: Cart Persistence Layer
 * 
 * Provides atomic operations for managing the client-side cart registry.
 * Designed to be consumed by TanStack Query mutations.
 */

const CART_STORAGE_KEY = "xiroo_cart_registry";

export const getCart = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const addToCartPersistence = (product, variant) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (item) => item.id === product.id && item.variant === variant
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      ...product,
      variant,
      quantity: 1,
      addedAt: new Date().toISOString(),
    });
  }

  saveCart(cart);
  return cart;
};

export const updateQuantityPersistence = (id, variant, delta) => {
  let cart = getCart();
  cart = cart.map((item) => {
    if (item.id === id && item.variant === variant) {
      return { ...item, quantity: Math.max(1, item.quantity + delta) };
    }
    return item;
  });
  saveCart(cart);
  return cart;
};

export const removeFromCartPersistence = (id, variant) => {
  let cart = getCart();
  cart = cart.filter((item) => !(item.id === id && item.variant === variant));
  saveCart(cart);
  return cart;
};

export const clearCartPersistence = () => {
  saveCart([]);
  return [];
};
