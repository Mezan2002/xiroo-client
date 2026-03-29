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
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }

    // Handling Wishlist Registry
    if (action.type.startsWith("wishlist/")) {
      const wishlistItems = store.getState().wishlist.items;
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }

    // Handling Recently Viewed Registry
    if (action.type.startsWith("recentlyViewed/")) {
      const recentItems = store.getState().recentlyViewed.items;
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentItems));
    }
  }

  return result;
};

/** High-Performance State Hydration Helper */
export const rehydrateState = () => {
  if (typeof window === "undefined") return {};
  
  const cartItems = localStorage.getItem(CART_STORAGE_KEY);
  const wishlistItems = localStorage.getItem(WISHLIST_STORAGE_KEY);
  const recentItems = localStorage.getItem(RECENTLY_VIEWED_KEY);

  return {
    cart: cartItems ? { items: JSON.parse(cartItems), subtotal: 0, itemCount: 0 } : undefined,
    wishlist: wishlistItems ? { items: JSON.parse(wishlistItems) } : undefined,
    recentlyViewed: recentItems ? { items: JSON.parse(recentItems) } : undefined,
  };
};
