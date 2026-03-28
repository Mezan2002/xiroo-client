import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart, clearCart } from "@/redux/slices/cartSlice";
import { addToast } from "@/redux/slices/toastSlice";

/** 
 * Senior Dev Hook: useCart
 * Provides a clean interface for the UI to interact with the global Cart state.
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const { items, subtotal, itemCount } = useSelector((state) => state.cart);

  const addItem = ({ product, variant = "Standard" }) => {
    dispatch(addToCart({ product, variant }));
    dispatch(addToast({ message: "Product added to cart.", type: "success" }));
  };

  const updateItemQuantity = ({ id, variant, delta }) => {
    dispatch(updateQuantity({ id, variant, delta }));
  };

  const removeItemItem = ({ id, variant }) => {
    dispatch(removeFromCart({ id, variant }));
    dispatch(addToast({ message: "Item removed from cart.", type: "info" }));
  };

  const resetCart = () => {
    dispatch(clearCart());
  };

  return {
    items,
    subtotal,
    itemCount,
    addItem,
    updateQuantity: updateItemQuantity,
    removeItem: removeItemItem,
    clearCart: resetCart,
  };
};
