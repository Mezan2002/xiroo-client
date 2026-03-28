import { useDispatch, useSelector } from "react-redux";
import { toggleItem as toggleWishlistItem, clearWishlist as clearWishlistItems } from "@/redux/slices/wishlistSlice";

/** 
 * Senior Dev Hook: useWishlist
 * Professional-grade wishlist orchestration.
 * Manages the user's curated selection of boutique items.
 */
export const useWishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  const toggleItem = (product) => {
    dispatch(toggleWishlistItem(product));
  };

  const clearWishlist = () => {
    dispatch(clearWishlistItems());
  };

  const isInWishlist = (productId) => {
    return items.some((item) => item._id === productId || item.id === productId);
  };

  return {
    wishlistItems: items,
    toggleItem,
    clearWishlist,
    isInWishlist,
    count: items.length,
  };
};
