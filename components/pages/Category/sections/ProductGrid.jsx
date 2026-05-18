"use client";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { SlidersHorizontal } from "lucide-react";

export default function ProductGrid({
  isLoading,
  filteredProducts,
  resetFilters,
}) {
  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-zinc-100 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-sm">
        <SlidersHorizontal size={32} className="text-gray-200 mb-6" />
        <p className="text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-2">
          No matches found
        </p>
        <p className="text-[10px] font-medium text-gray-400 tracking-wider mb-8 max-w-[280px]">
          We couldn&apos;t find items matching your active constraints.
        </p>
        <Button
          variant="primary"
          onClick={resetFilters}
          className="bg-black text-white text-[10px] px-8 py-3 tracking-[0.2em]"
        >
          RESET SELECTION
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8">
      {filteredProducts.map((product, idx) => (
        <ProductCard
          key={product._id}
          id={product._id}
          title={product.title}
          price={product.price}
          salePrice={product.salePrice}
          image={product.images?.[0]}
          images={product.images}
          variants={product.variants}
          priority={idx < 4}
          stockStage={product.stockStage}
          badge={product.badge}
        />
      ))}
    </div>
  );
}
