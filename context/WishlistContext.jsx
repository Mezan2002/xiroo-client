"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getWishlistFromStorage, 
  toggleWishlistItem, 
  clearWishlist 
} from "@/lib/wishlist";
import { useToast } from "@/context/ToastContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 1. Reactive Wishlist Registry
  const { data: items = [] } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistFromStorage,
    staleTime: Infinity,
    initialData: [],
  });

  // 2. Atomic Toggle Mutation
  const toggleMutation = useMutation({
    mutationFn: async (product) => {
      return toggleWishlistItem(product);
    },
    onSuccess: (updatedItems, product) => {
      queryClient.setQueryData(["wishlist"], updatedItems);
      const isRemoved = updatedItems.length < items.length;
      if (isRemoved) {
        toast.info("Item Salvaged from Wishlist.");
      } else {
        toast.success("Item Secured in Wishlist.");
      }
    },
  });

  // 3. Identification Helpers
  const isInWishlist = useCallback((productId) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  const value = useMemo(() => ({
    items,
    itemCount: items.length,
    toggleItem: toggleMutation.mutate,
    toggleMutation,
    isInWishlist,
    clear: () => {
      clearWishlist();
      queryClient.setQueryData(["wishlist"], []);
    }
  }), [items, toggleMutation, queryClient, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
