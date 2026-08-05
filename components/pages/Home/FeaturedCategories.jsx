"use client";

import { useCategories } from "@/hooks/api/useCategories";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558227691-41ea78d1f631?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
];

export default function FeaturedCategories() {
  const { useCategoryTree } = useCategories();
  const { data: allCategories = [], isLoading } = useCategoryTree();

  const categories = useMemo(() => {
    return allCategories
      .filter((cat) => !cat.parentId)
      .slice(0, 4)
      .map((cat, idx) => ({
        ...cat,
        image: cat.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
      }));
  }, [allCategories]);

  if (isLoading) {
    return (
      <section className="w-full bg-white animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_0.6fr_1fr] grid-rows-2 h-[85vh] max-h-[800px]">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-white overflow-hidden my-2">
      {/* Mobile: left tall + right 2 stacked (3 items) */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[85vh] max-h-[800px] lg:hidden">
        <BentoCell
          cat={categories[0]}
          index={0}
          className="col-span-1 row-span-2"
          sizes="50vw"
        />
        <BentoCell
          cat={categories[1]}
          index={1}
          className="col-start-2 row-start-1"
          sizes="50vw"
        />
        <BentoCell
          cat={categories[2]}
          index={2}
          className="col-start-2 row-start-2"
          sizes="50vw"
        />
      </div>

      {/* Desktop: diagonal bento — top-left tall, bottom-right tall */}
      <div className="hidden lg:grid grid-cols-[1fr_0.6fr_1fr] grid-rows-2 gap-2 h-[85vh] max-h-[800px]">
        <BentoCell
          cat={categories[0]}
          index={0}
          className="col-start-1 row-start-1 row-span-2"
          sizes="40vw"
        />
        <BentoCell
          cat={categories[1]}
          index={1}
          className="col-start-2 row-start-1"
          sizes="24vw"
        />
        <BentoCell
          cat={categories[2]}
          index={2}
          className="col-start-2 row-start-2"
          sizes="24vw"
        />
        <BentoCell
          cat={categories[3]}
          index={3}
          className="col-start-3 row-start-1 row-span-2"
          sizes="40vw"
        />
      </div>
    </section>
  );
}

/* ── Bento Cell ── */
function BentoCell({ cat, index, className = "", sizes }) {
  if (!cat) return <div className={`bg-gray-100 ${className}`} />;

  return (
    <Link
      href={`/collections/${cat.slug}`}
      className={`relative overflow-hidden group bg-gray-100 ${className}`}
    >
      <Image
        src={cat.image}
        alt={cat.name}
        fill
        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        sizes={sizes}
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

      {/* Hover label */}
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="bg-white px-6 py-3 flex items-center gap-3 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 whitespace-nowrap">
            {cat.name}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-900"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
