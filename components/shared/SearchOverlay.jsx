"use client";

import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/api/useProducts";
import { clearRecentViews } from "@/redux/slices/recentlyViewedSlice";
import { Loader2, Search, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const TRENDING_SEARCHES = [
  "Smart LED",
  "Travel Bottles",
  "Cat Brush",
  "Heated Jacket",
  "Pet Feeder",
];

export function SearchOverlay({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const recentlyViewed = useSelector((state) => state.recentlyViewed.items);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);

  const { useSearchProducts, useNewArrivals } = useProducts();
  const { data: searchData, isFetching: isSearching } = useSearchProducts(debouncedQuery);
  const { data: trendingData } = useNewArrivals(4);

  // Normalize product arrays from the API response shape
  const searchResults = searchData?.data || searchData?.products || searchData || [];
  const trendingProducts = trendingData?.data || trendingData?.products || trendingData || [];

  const isSearchMode = debouncedQuery.trim().length > 0;

  // Scroll lock + input focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleClearRecent = () => dispatch(clearRecentViews());

  const handleTrendingClick = (term) => setQuery(term);

  return (
    <div
      className={`fixed inset-0 z-[1001] transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`absolute inset-0 flex items-start justify-center pt-[8vh] px-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-95"
        }`}
      >
        {/* Modal Panel */}
        <aside className="w-full max-w-[1000px] bg-white text-black shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[84vh]">
          {/* Search Bar Header */}
          <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 stroke-[1.5] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-[20px] font-light text-gray-800 placeholder:text-gray-300 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-gray-300 hover:text-black transition-colors"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black transition-colors shrink-0"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10 scrollbar-hide space-y-14">

            {/* ─── SEARCH MODE ─── */}
            {isSearchMode && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    {isSearching ? "Searching..." : `Results for &ldquo;${debouncedQuery}&rdquo;`}
                  </h3>
                  {!isSearching && searchResults.length > 0 && (
                    <span className="text-[11px] font-semibold text-gray-400">
                      {searchResults.length} found
                    </span>
                  )}
                </div>

                {/* Loading Skeleton */}
                {isSearching && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin stroke-1" />
                  </div>
                )}

                {/* Results Grid */}
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
                          />
                        </div>
                      ))}
                  </div>
                )}

                {/* Empty State */}
                {!isSearching && searchResults.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <Search className="w-12 h-12 text-gray-100 mx-auto stroke-1" />
                    <p className="text-[13px] font-medium text-gray-400 tracking-wide">
                      No products found for{" "}
                      <span className="text-black font-semibold">&ldquo;{debouncedQuery}&rdquo;</span>
                    </p>
                    <p className="text-[11px] text-gray-300 uppercase tracking-widest font-semibold">
                      Try a different keyword
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ─── DEFAULT MODE ─── */}
            {!isSearchMode && (
              <>
                {/* Recently Viewed */}
                {recentlyViewed.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                        Recently Viewed
                      </h3>
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
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div className="space-y-5">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Trending Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTrendingClick(term)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-[11px] font-semibold text-gray-600 hover:border-black hover:text-black hover:bg-gray-50 transition-all duration-200 uppercase tracking-wider"
                      >
                        <Sparkles className="w-3 h-3 stroke-[1.5]" />
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Products (New Arrivals) */}
                {trendingProducts.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      New Arrivals
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
                      {trendingProducts.map((product) => (
                        <div key={product._id} onClick={onClose}>
                          <ProductCard
                            id={product._id}
                            title={product.title}
                            price={product.price}
                            salePrice={product.salePrice}
                            image={product.images?.[0]}
                            images={product.images}
                            variants={product.variants}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
