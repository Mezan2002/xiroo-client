"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { apiRequest } from "@/lib/api";

import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { items: wishlistItems, toggleItem } = useWishlist();
  const isLoading = false; // Persistent LocalStorage is instantaneous

  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-8 w-48 bg-gray-100" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-4/5 bg-gray-50 border border-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-montserrat font-semibold">Saved Wishlist</h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 border border-gray-100 italic">
          {wishlistItems.length} Items Saved
        </span>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {wishlistItems.map((item) => (
            <ProductCard 
              key={item._id || item.id}
              {...(item.product || item)}
              showRemove={true}
              onRemove={(id) => console.log(`Removed ${id} from wishlist`)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-gray-50 bg-gray-50/10 rounded-none">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-6 stroke-1" />
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-8 italic">Your wishlist is empty</p>
          <Button href="/collections/all" className="rounded-none px-10 h-14 tracking-widest font-bold uppercase text-[11px]">
            EXPLORE BOUTIQUE
          </Button>
        </div>
      )}
    </div>
  );
}
