"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { useMenus } from "@/hooks/api/useMenus";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function CollectionMenuPage({ slug, title }) {
  const { useMenuBySlug } = useMenus();
  const { data: menuResponse, isLoading, isError } = useMenuBySlug(slug);

  const menu = menuResponse;
  const categories = menu?.categories || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-32">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  if (isError || !menu) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat tracking-tight">
      {/* Super Minimal Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end border-b border-gray-100 pb-6 mb-16 gap-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb />
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-light tracking-wide text-black uppercase leading-none">
            {menu.name || title}
          </h1>
        </div>
      </div>

      {/* Ultra-Clean Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-16">
          {categories.map((category) => (
            <Link
              href={`/collections/${category.slug}`}
              key={category._id}
              className="group flex flex-col w-full"
            >
              {/* Raw Image Box */}
              <div className="relative w-full aspect-4/3 bg-[#f8f8f8] overflow-hidden mb-5">
                <Image
                  src={category.image || "/images/placeholder.png"}
                  alt={category.name}
                  fill
                  className="object-cover object-center transition-transform duration-1200 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03]"
                />
              </div>

              {/* Split Text Below Image */}
              <div className="flex justify-between items-start w-full px-1">
                <h2 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#222] uppercase group-hover:text-black transition-colors">
                  {category.name}
                </h2>
                <span className="text-[9px] md:text-[10px] tracking-widest text-gray-400 font-semibold text-right">
                  DISCOVER
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-100 rounded-sm bg-zinc-50/30">
          <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em] italic">
            Visual archive currently empty
          </p>
        </div>
      )}
    </div>
  );
}
