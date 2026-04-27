"use client";
import ProductCard from "@/components/ui/ProductCard";
import { Sparkles } from "lucide-react";

const TRENDING_SEARCHES = ["Smart LED", "Travel Bottles", "Cat Brush", "Heated Jacket", "Pet Feeder"];

export default function DefaultSearchLayout({
  recentlyViewed,
  handleClearRecent,
  handleTrendingClick,
  trendingProducts,
  onClose,
}) {
  return (
    <>
      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Recently Viewed</h3>
            <button
              onClick={handleClearRecent}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {recentlyViewed.slice(0, 4).map((product) => (
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
        </div>
      )}

      {/* Trending Searches */}
      <div className="space-y-5">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Trending Searches</h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => handleTrendingClick(term)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-[11px] font-semibold text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3 stroke-[1.5]" />
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      {trendingProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">New Arrivals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
            {trendingProducts.map((product) => (
              <div key={product._id} onClick={onClose}>
                <ProductCard
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  salePrice={product.salePrice}
                  variants={product.variants}
                  badge={product.badge}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
