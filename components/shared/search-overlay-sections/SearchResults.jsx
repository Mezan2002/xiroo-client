"use client";
import ProductCard from "@/components/ui/ProductCard";
import { Loader2, Search } from "lucide-react";

export default function SearchResults({ isSearching, debouncedQuery, searchResults, onClose }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {isSearching ? "Searching..." : `Results for “${debouncedQuery}”`}
        </h3>
        {!isSearching && searchResults.length > 0 && (
          <span className="text-[11px] font-semibold text-gray-400">
            {searchResults.length} found
          </span>
        )}
      </div>

      {isSearching && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-gray-300 animate-spin stroke-1" />
        </div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {searchResults.map((product) => (
            <div key={product._id} onClick={onClose}>
              <ProductCard
                id={product._id}
                title={product.title}
                price={product.price}
                salePrice={product.salePrice}
                image={product.images?.[0]}
                images={product.images}
                variants={product.variants}
                badge={product.badge}
              />
            </div>
          ))}
        </div>
      )}

      {!isSearching && searchResults.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <Search className="w-12 h-12 text-gray-100 mx-auto stroke-1" />
          <p className="text-[13px] font-medium text-gray-400 tracking-wide">
            No products found for <span className="text-black font-semibold">“{debouncedQuery}”</span>
          </p>
          <p className="text-[11px] text-gray-300 uppercase tracking-widest font-semibold">
            Try a different keyword
          </p>
        </div>
      )}
    </div>
  );
}
