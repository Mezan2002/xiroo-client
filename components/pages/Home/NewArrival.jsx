"use client";

import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/api/useProducts";

export default function NewArrival() {
  const { useNewArrivals } = useProducts();
  const { data: response, isLoading } = useNewArrivals(4);
  const products = response?.data || [];

  if (isLoading) {
    return (
      <section className="w-full py-20 lg:py-32 px-6 lg:px-12 border-t border-gray-100">
        <div className="flex justify-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-mono tracking-[0.15em] lg:tracking-[0.2em] font-medium text-black uppercase">
            NEW ARRIVAL
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-4/5 bg-gray-100" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="w-full py-20 lg:py-32 px-6 lg:px-12 border-t border-gray-100">
      {/* Section Header */}
      <div className="flex justify-center mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-mono tracking-[0.15em] lg:tracking-[0.2em] font-medium text-black uppercase">
          NEW ARRIVAL
        </h2>
      </div>

      {/* Products Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8">
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
