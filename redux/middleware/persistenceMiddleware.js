const CART_STORAGE_KEY = "xiroo_cart_registry";
const WISHLIST_STORAGE_KEY = "xiroo_wishlist_registry";

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
  }

  return result;
};

/** High-Performance State Hydration Helper */
export const rehydrateState = () => {
  if (typeof window === "undefined") return {};
  
  const cartItems = localStorage.getItem(CART_STORAGE_KEY);
  const wishlistItems = localStorage.getItem(WISHLIST_STORAGE_KEY);

  return {
    cart: cartItems ? { items: JSON.parse(cartItems), subtotal: 0, itemCount: 0 } : undefined,
    wishlist: wishlistItems ? { items: JSON.parse(wishlistItems) } : undefined,
  };
};
