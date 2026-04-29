import { getFromStorage, saveToStorage } from "@/lib/storage";

const CART_STORAGE_KEY = "xiroo_cart_registry";
const WISHLIST_STORAGE_KEY = "xiroo_wishlist_registry";
const RECENTLY_VIEWED_KEY = "xiroo_recently_viewed";

/** 
 * Senior Dev Pattern: Persistence Middleware
 * Synchronizes Redux state to LocalStorage for data integrity across sessions.
 */
export const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Persistence Logic: Executed only on the client side
  if (typeof window !== "undefined") {
    // Handling Cart Registry
    if (action.type.startsWith("cart/")) {
      const cartItems = store.getState().cart.items;
      saveToStorage(CART_STORAGE_KEY, cartItems);
    }

    // Handling Wishlist Registry
    if (action.type.startsWith("wishlist/")) {
      const wishlistItems = store.getState().wishlist.items;
      saveToStorage(WISHLIST_STORAGE_KEY, wishlistItems);
    }

    // Handling Recently Viewed Registry
    if (action.type.startsWith("recentlyViewed/")) {
      const recentItems = store.getState().recentlyViewed.items;
      saveToStorage(RECENTLY_VIEWED_KEY, recentItems);
    }
  }

  return result;
};

/** High-Performance State Hydration Helper */
export const rehydrateState = () => {
  if (typeof window === "undefined") return {};
  
  const cartItems = getFromStorage(CART_STORAGE_KEY);
  const wishlistItems = getFromStorage(WISHLIST_STORAGE_KEY);
  const recentItems = getFromStorage(RECENTLY_VIEWED_KEY);

  return {
    cart: cartItems ? { items: cartItems, subtotal: 0, itemCount: 0 } : undefined,
    wishlist: wishlistItems ? { items: wishlistItems } : undefined,
    recentlyViewed: recentItems ? { items: recentItems } : undefined,
  };
};
