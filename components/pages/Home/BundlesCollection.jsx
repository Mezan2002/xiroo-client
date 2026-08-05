"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import { useProducts } from "@/hooks/api/useProducts";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BundlesCollection() {
  const { useMultiItemProducts } = useProducts();
  const { data: response, isLoading } = useMultiItemProducts(6);
  const products = response?.data || [];

  if (isLoading) {
    return (
      <section className="w-full py-20 lg:py-32 bg-white border-t border-gray-100">
        <div className="max-w-400 mx-auto px-6 lg:px-12">
          <SectionHeader
            subtitle="Multi-Item Packs"
            title="BUNDLE COLLECTION"
            className="mb-12 lg:mb-16"
          />
          <div className="w-full h-125 lg:h-150 bg-gray-100 animate-pulse" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const [hero, ...rest] = products;

  return (
    <section className="w-full py-20 lg:py-32 bg-white border-t border-gray-100">
      <div className="max-w-400 mx-auto px-6 lg:px-12">
        {/* Header */}
        <SectionHeader
          subtitle="Multi-Item Packs"
          title="BUNDLE COLLECTION"
          className="mb-12 lg:mb-16"
        />

        {/* Hero — full width image with products overlaid */}
        <div className="relative w-full h-125 lg:h-150 bg-gray-100 overflow-hidden group">
          {/* Background image */}
          {hero.images?.[0] && (
            <Image
              src={hero.images[0]}
              alt={hero.title}
              fill
              className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content overlay */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 lg:p-16">
            {/* Top */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 mb-2 block">
                  Multi-Item Packs
                </span>
                <h2 className="text-xl lg:text-3xl font-mono font-medium text-white uppercase tracking-tight max-w-lg leading-tight">
                  {hero.title}
                </h2>
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-white">
                ৳{(hero.salePrice || hero.price).toLocaleString()}
              </span>
            </div>

            {/* Bottom — small product cards row */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="flex-none w-35 lg:w-45 bg-white/10 backdrop-blur-sm border border-white/20 p-2 hover:bg-white/20 transition-colors"
                >
                  <div className="relative w-full aspect-square overflow-hidden bg-white/10 mb-2">
                    {product.images?.[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover object-center"
                        sizes="180px"
                      />
                    )}
                  </div>
                  <h4 className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                    {product.title}
                  </h4>
                  <span className="text-[11px] font-bold text-white/70">
                    ৳{(product.salePrice || product.price).toLocaleString()}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 lg:mt-16">
          <Link
            href="/bundles/create"
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase text-black pb-1 transition-all"
          >
            Build Your Own Bundle
            <ChevronRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
