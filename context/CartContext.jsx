"use client";

import { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getCart, 
  addToCartPersistence, 
  updateQuantityPersistence, 
  removeFromCartPersistence, 
  clearCartPersistence 
} from "@/lib/cart";
import { useToast } from "./ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. Synchronized Cart Registry (TanStack Query)
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    placeholderData: [],
    staleTime: Infinity, // Cart is strictly client-side for now
  });

  // 2. Atomic Mutations (Best Practices)
  const addItemMutation = useMutation({
    mutationFn: ({ product, variant }) => addToCartPersistence(product, variant),
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, variant, delta }) => updateQuantityPersistence(id, variant, delta),
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: ({ id, variant }) => removeFromCartPersistence(id, variant),
    onSuccess: (newCart) => {
      queryClient.setQueryData(["cart"], newCart);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCartPersistence,
    onSuccess: () => {
      queryClient.setQueryData(["cart"], []);
    },
  });

  // Calculate high-performance engagement metrics
  const { subtotal, itemCount } = useMemo(() => {
    const total = items.reduce((sum, item) => {
      const activePrice = (item.salePrice && item.salePrice > 0) ? item.salePrice : item.price;
      const numericPrice = parseFloat(activePrice?.toString().replace(/[^0-9.]/g, "") || 0);
      return sum + (numericPrice * item.quantity);
    }, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal: total, itemCount: count };
  }, [items]);

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      subtotal,
      itemCount,
      addItem: addItemMutation.mutate,
      updateQuantity: updateQuantityMutation.mutate,
      removeItem: removeItemMutation.mutate,
      clearCart: clearCartMutation.mutate,
      addItemMutation,
      updateQuantityMutation,
      removeItemMutation,
      clearCartMutation,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
