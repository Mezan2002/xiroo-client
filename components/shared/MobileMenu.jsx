"use client";

import { useProducts } from "@/hooks/api/useProducts";
import { useUser } from "@/hooks/api/useUser";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";

export default function MobileMenu({ isOpen, onClose, navItems }) {
  const { user, logout } = useUser();
  const isAdmin = user?.role === "admin";
  const { useFeaturedProducts } = useProducts();
  const { data: featuredResponse } = useFeaturedProducts();
  const featuredProducts = featuredResponse?.data || featuredResponse || [];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Menu */}
      <aside className="absolute right-0 top-0 bottom-0 w-full sm:w-[380px] bg-white shadow-2xl animate-in slide-in-from-right duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col font-montserrat tracking-tight overflow-hidden">
        {/* Minimalist Close Button - Top Left */}
        <div className="px-8 py-4">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-zinc-400 hover:text-black transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="px-8 pt-2 pb-12 space-y-12">
            {/* Dynamic Sections from navItems */}
            {navItems?.map((section) => (
              <div key={section.id} className="space-y-6">
                <Link
                  href={`/${section.id}`}
                  onClick={onClose}
                  className="block group"
                >
                  <h3 className="text-[20px] font-bold text-black uppercase tracking-widest group-hover:opacity-70 transition-opacity">
                    {section.label}
                  </h3>
                </Link>
                <div className="flex flex-col space-y-4">
                  {section.categories && section.categories.length > 0 ? (
                    section.categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/collections/${category.slug}`}
                        onClick={onClose}
                        className="text-[15px] font-medium text-zinc-700 hover:text-black uppercase tracking-[0.15em] transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))
                  ) : (
                    <Link
                      href={`/${section.id}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-100 rounded-[2px] bg-zinc-50/30 group-hover:bg-zinc-50 transition-colors">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic group-hover:text-black transition-colors">
                          No categories available yet
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {/* Featured Selection Header */}
            {featuredProducts.length > 0 && (
              <div className="space-y-6 pt-8">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                    Featured Selection
                  </p>
                </div>

                {/* Horizontal Product Scroll */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 snap-x snap-mandatory">
                  {featuredProducts.map((product) => (
                    <div 
                      key={product._id} 
                      className="w-[180px] shrink-0 snap-start"
                      onClick={onClose}
                    >
                      <ProductCard
                        id={product._id}
                        title={product.title}
                        price={product.price}
                        salePrice={product.salePrice}
                        image={product.images?.[0] || ""}
                        images={product.images}
                        variants={product.variants}
                        stockStage={product.stockStage}
                        badge={product.badge}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
