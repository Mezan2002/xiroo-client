"use client";

import { useCategories } from "@/hooks/api/useCategories";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

// Fallback images for categories without a custom image
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
];

export default function FeaturedCategories() {
  const { useCategoryTree } = useCategories();
  const { data: allCategories = [], isLoading } = useCategoryTree();

  // Only show root-level categories (no parentId), up to 4
  const categories = useMemo(() => {
    return allCategories
      .filter((cat) => !cat.parentId)
      .slice(0, 4)
      .map((cat, idx) => ({
        ...cat,
        image: cat.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
      }));
  }, [allCategories]);

  const [activeCategory, setActiveCategory] = useState(null);

  // Determine the active category to show in the image preview
  const displayCategory = activeCategory || categories[0] || null;

  if (isLoading) {
    return (
      <section className="w-full py-24 lg:py-32 px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 animate-pulse">
          <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 lg:h-16 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="w-full lg:w-5/12 flex justify-end">
            <div className="w-full max-w-[480px] aspect-4/5 bg-gray-100" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full py-24 lg:py-32 px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        {/* Left Side: Category List */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/collections/${cat.slug}`}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`flex items-start w-fit group transition-colors duration-300 ${
                displayCategory?._id === cat._id
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <h2 className="text-[32px] sm:text-4xl lg:text-[52px] font-light uppercase tracking-wide leading-none whitespace-nowrap">
                {cat.name}
              </h2>
              <span className="text-sm md:text-base lg:text-xl ml-2 lg:ml-4 font-normal text-gray-400 transition-colors duration-300 group-hover:text-gray-500">
                {/* Sub-category count could go here in the future */}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Side: Featured Dynamic Image */}
        <div className="w-full lg:w-5/12 flex justify-end">
          <div className="relative w-full max-w-[480px] aspect-4/5 bg-gray-100 overflow-hidden">
            {categories.map((cat) => (
              <Image
                key={cat._id}
                src={cat.image}
                alt={cat.name}
                fill
                className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  displayCategory?._id === cat._id
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-[1.02]"
                }`}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
