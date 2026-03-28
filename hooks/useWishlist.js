import { useSelector, useDispatch } from "react-redux";
import { toggleItem, clearWishlist } from "@/redux/slices/wishlistSlice";
import { addToast } from "@/redux/slices/toastSlice";

/** 
 * Senior Dev Hook: useWishlist
 * Provides a clean interface for the UI to interact with the global Wishlist state.
 */
export const useWishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const toggleWishlist = (product) => {
    dispatch(toggleItem(product));
    const isAdding = !items.find((i) => (i._id === product._id || i.id === product.id));
    dispatch(addToast({ 
      message: isAdding ? "Product saved to wishlist." : "Product removed from wishlist.", 
      type: isAdding ? "success" : "info" 
    }));
  };

  const resetWishlist = () => {
    dispatch(clearWishlist());
  };

  return {
    items,
    itemCount: items.length,
    toggleWishlist,
    clearWishlist: resetWishlist,
    isInWishlist: (id) => !!items.find((i) => (i._id === id || i.id === id)),
  };
};
