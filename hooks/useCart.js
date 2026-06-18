import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart, clearCart, applyDiscount, removeDiscount } from "@/redux/slices/cartSlice";
import { addToast } from "@/redux/slices/toastSlice";

/** 
 * Senior Dev Hook: useCart
 * Provides a clean interface for the UI to interact with the global Cart state.
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const { items, subtotal, itemCount, discount, discountAmount, autoBundleDiscountAmount, isBundleFreeShipping, total } = useSelector((state) => state.cart);

  const addItem = ({ product, variant = "Standard", quantity = 1, bundleId = null, silent = false }) => {
    dispatch(addToCart({ product, variant, quantity, bundleId }));
    if (!silent) {
      dispatch(addToast({ message: "Product added to cart.", type: "success" }));
    }
  };

  const updateItemQuantity = ({ id, variant, delta, bundleId = null }) => {
    dispatch(updateQuantity({ id, variant, delta, bundleId }));
  };

  const removeItemItem = ({ id, variant, bundleId = null }) => {
    dispatch(removeFromCart({ id, variant, bundleId }));
    dispatch(addToast({ message: "Item removed from cart.", type: "info" }));
  };

  const resetCart = () => {
    dispatch(clearCart());
  };

  const applyDiscountCode = (discountData) => {
    dispatch(applyDiscount(discountData));
    dispatch(addToast({ message: "Discount applied successfully.", type: "success" }));
  };

  const removeDiscountCode = () => {
    dispatch(removeDiscount());
    dispatch(addToast({ message: "Discount removed.", type: "info" }));
  };

  return {
    items,
    subtotal,
    itemCount,
    discount,
    discountAmount,
    autoBundleDiscountAmount,
    isBundleFreeShipping,
    total,
    addItem,
    updateQuantity: updateItemQuantity,
    removeItem: removeItemItem,
    clearCart: resetCart,
    applyDiscount: applyDiscountCode,
    removeDiscount: removeDiscountCode,
  };
};
