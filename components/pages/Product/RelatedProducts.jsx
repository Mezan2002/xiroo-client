"use client";
import React from "react";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/api/useProducts";

export default function RelatedProducts({ categoryId, currentProductId }) {
  const { useAllProducts } = useProducts({
    enabled: !!categoryId,
    staleTime: 10 * 60 * 1000,
  });

  const { data: productsResponse, isLoading } = useAllProducts({
    category: categoryId,
    limit: 6,
  });


  const products = productsResponse?.success
    ? productsResponse.data.filter((p) => p._id !== currentProductId).slice(0, 3)
    : [];

  if (isLoading || products.length === 0) return null;

  return (
    <div className="w-full mt-12 lg:mt-24 xl:mt-32 max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 pt-16">
      <h2 className="text-center text-[15px] md:text-xl font-semibold tracking-[0.2em] uppercase mb-10 text-[#111]">
        You May Also Like
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
        {products.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id}
            title={item.title}
            price={item.price}
            salePrice={item.salePrice}
            image={item.images?.[0]}
            images={item.images}
            hoverImage={item.images?.[1]}
            stockStage={item.stockStage}
          />
        ))}
      </div>
    </div>
  );
}
