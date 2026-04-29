/**
 * Atomic Persistence Layer for the Boutique's Wishlist Registry.
 * Synchronizes salvaged items with LocalStorage for session persistence.
 */

import { getFromStorage, saveToStorage, removeFromStorage } from "./storage";

const WISHLIST_STORAGE_KEY = "xiroo_wishlist_registry";

export const getWishlistFromStorage = () => {
  if (typeof window === "undefined") return [];
  const stored = getFromStorage(WISHLIST_STORAGE_KEY);
  return stored || [];
};

export const saveWishlistToStorage = (items) => {
  if (typeof window === "undefined") return;
  saveToStorage(WISHLIST_STORAGE_KEY, items);
};

export const toggleWishlistItem = (product) => {
  const current = getWishlistFromStorage();
  const exists = current.find((item) => item.id === product.id);
  
  let updated;
  if (exists) {
    updated = current.filter((item) => item.id !== product.id);
  } else {
    updated = [...current, { ...product, addedAt: new Date().toISOString() }];
  }
  
  saveWishlistToStorage(updated);
  return updated;
};

export const clearWishlist = () => {
  if (typeof window === "undefined") return;
  removeFromStorage(WISHLIST_STORAGE_KEY);
};
