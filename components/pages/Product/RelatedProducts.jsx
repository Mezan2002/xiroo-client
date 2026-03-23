import React from 'react';
import ProductCard from '@/components/ui/ProductCard';

const MOCK_RELATED = [
  { id: "101", title: "RED AMBIENT TABLE LAMP", price: "$89.99", image: "/images/featured-product-main.png" },
  { id: "102", title: "WARM EDISON DESK BULB", price: "$65.00", image: "/images/comparison-light.png" },
  { id: "103", title: "FLOATING MAGNETIC GLOBE LIGHT", price: "$120.00", image: "/images/comparison-dark.png" },
];

export default function RelatedProducts() {
  return (
    <div className="w-full mt-12 lg:mt-24 xl:mt-32 max-w-[1400px] mx-auto px-4 md:px-8 xl:px-12 pt-16">
      <h2 className="text-center text-[15px] md:text-xl font-semibold tracking-[0.2em] uppercase mb-10 text-[#111]">You May Also Like</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
         {MOCK_RELATED.map(item => (
            <ProductCard key={item.id} {...item} />
         ))}
      </div>
    </div>
  );
}
