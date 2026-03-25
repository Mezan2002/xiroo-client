/**
 * Atomic Persistence Layer for the Boutique's Wishlist Registry.
 * Synchronizes salvaged items with LocalStorage for session persistence.
 */

const WISHLIST_STORAGE_KEY = "xiroo_wishlist_registry";

export const getWishlistFromStorage = () => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveWishlistToStorage = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
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
  localStorage.removeItem(WISHLIST_STORAGE_KEY);
};
