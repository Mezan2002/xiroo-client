"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/api/useProducts";

export default function NewArrival() {
  const { useNewArrivals } = useProducts();
  const { data: response, isLoading } = useNewArrivals(4);
  const products = response?.data || [];

  if (isLoading) {
    return (
      <section className="w-full py-20 lg:py-32 px-6 lg:px-12 border-t border-gray-100">
        <SectionHeader subtitle="Just Dropped" title="NEW ARRIVAL" className="mb-12 lg:mb-16" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="w-full aspect-3/4 bg-gray-100" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-2.5 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full py-20 lg:py-32 px-6 lg:px-12 border-t border-gray-100">
      {/* Header */}
      <SectionHeader subtitle="Just Dropped" title="NEW ARRIVAL" className="mb-12 lg:mb-16" />

      {/* 4-col equal grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-12">
        {products.map((product, idx) => (
          <ProductCard
            key={product._id}
            id={product._id}
            title={product.title}
            price={product.price}
            salePrice={product.salePrice}
            images={product.images}
            image={product.images?.[0]}
            variants={product.variants}
            stockStage={product.stockStage}
            badge={product.badge}
            priority={idx === 0}
          />
        ))}
      </div>
    </section>
  );
}
