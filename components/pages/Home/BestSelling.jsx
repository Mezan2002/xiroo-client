"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/api/useProducts";

export default function BestSelling() {
  const { useBestSelling } = useProducts();
  const { data: response, isLoading } = useBestSelling(4);
  const products = response?.data || [];

  if (isLoading) {
    return (
      <section className="w-full py-20 lg:py-32 px-6 lg:px-12 bg-[#111111]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-end justify-between mb-12 lg:mb-16">
            <div>
              <SectionHeader subtitle="Customer Favorites" title="BEST SELLING" dark align="left" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="w-full aspect-square bg-white/[0.04]" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
                <div className="h-2.5 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const top4 = products.slice(0, 4);

  return (
    <section className="w-full py-20 lg:py-32 px-6 lg:px-12 bg-[#111111]">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 lg:mb-16">
          <SectionHeader subtitle="Customer Favorites" title="BEST SELLING" dark align="left" />
        </div>

        {/* Top 4 — Netflix-style ranking */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 lg:gap-x-8 lg:gap-y-12">
          {top4.map((product, idx) => (
            <div key={product._id} className="relative group/card">
              <div className="relative z-10">
                {/* Rank number — inside image top-left */}
                <div className="absolute top-0 left-0 z-20 pointer-events-none select-none">
                  <span className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white text-black font-mono font-black text-lg sm:text-xl leading-none">
                    {idx + 1}
                  </span>
                </div>
                <ProductCard
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
                  dark
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
