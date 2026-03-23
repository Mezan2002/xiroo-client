"use client";

import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";

const MOCK_WISHLIST = [
  { id: 1, title: "Xiroo™ 4-in-1 Travel Dispensing Bottles", price: "৳2,450", image: "/images/featured-product-main.png" },
  { id: 2, title: "NORDIC SMART POT WITH LED", price: "৳5,200", image: "/images/promo-banner.png" },
];

export default function WishlistPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-montserrat font-semibold">Saved Wishlist</h2>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 border border-gray-100 italic">
          {MOCK_WISHLIST.length} Items Saved
        </span>
      </div>

      {MOCK_WISHLIST.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {MOCK_WISHLIST.map((product) => (
            <ProductCard 
              key={product.id}
              {...product}
              showRemove={true}
              onRemove={(id) => console.log(`Removed ${id} from wishlist`)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-gray-50 bg-gray-50/10 rounded-none">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-6 stroke-1" />
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-8 italic">Your wishlist is empty</p>
          <Button href="/collections/all">EXPLORE BOUTIQUE</Button>
        </div>
      )}
    </div>
  );
}
