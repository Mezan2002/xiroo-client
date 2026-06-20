"use client";

import { useCategories } from "@/hooks/api/useCategories";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

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

  const [activeCategory, setActiveCategory] = useState(null);
  const displayCategory = activeCategory || categories[0] || null;
  const activeIndex = categories.findIndex(
    (c) => c._id === displayCategory?._id,
  );

  if (isLoading) {
    return (
      <section className="w-full py-16 lg:py-24 px-4 sm:px-8 lg:px-20 bg-white animate-pulse">
        <div className="max-w-[1300px] mx-auto flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-2 w-24 bg-gray-100 rounded-full" />
              <div className="h-7 w-48 bg-gray-100 rounded-sm" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-100" />
              ))}
            </div>
          </div>
          {/* Mobile skeleton */}
          <div className="flex flex-col gap-2 lg:hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-44 bg-gray-100 rounded-sm" />
            ))}
          </div>
          {/* Desktop skeleton */}
          <div className="hidden lg:block h-[720px] bg-gray-100 rounded-sm" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-white py-16 lg:py-24 px-4 sm:px-8 lg:px-20 overflow-hidden">
      <div className="max-w-[1300px] mx-auto flex flex-col gap-10 lg:gap-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Curated for you
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono text-gray-900 tracking-tight uppercase">
              Shop by Collection
            </h2>
          </div>
          {/* Dot indicators — desktop only */}
          <div className="hidden lg:flex items-center gap-3">
            {categories.map((cat, idx) => (
              <button
                key={cat._id}
                onMouseEnter={() => setActiveCategory(cat)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`transition-all duration-500 rounded-full ${
                  activeIndex === idx
                    ? "w-6 h-1.5 bg-gray-900"
                    : "w-1.5 h-1.5 bg-gray-200 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile & Tablet: vertical stack ── */}
        <div className="flex flex-col gap-2 lg:hidden">
          {categories.map((cat, idx) => (
            <Link
              key={cat._id}
              href={`/collections/${cat.slug}`}
              className="relative w-full h-48 sm:h-64 overflow-hidden group bg-gray-100"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105 brightness-75 group-hover:brightness-90"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] tabular-nums tracking-[0.3em] text-white/40">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-light text-white tracking-tight leading-none">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/10">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/70">
                      Shop
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/70"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Desktop: bento grid ── */}
        <div
          className="hidden lg:grid gap-2 h-[80vh] max-h-[720px]"
          style={{
            gridTemplateColumns: "1.2fr 0.8fr 1fr",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          {/* Cell 1 — full-height left portrait */}
          <BentoCell
            cat={categories[0]}
            index={0}
            isActive={displayCategory?._id === categories[0]?._id}
            onEnter={() => setActiveCategory(categories[0])}
            onLeave={() => setActiveCategory(null)}
            className="col-start-1 row-start-1 row-span-2"
            sizes="(max-width: 1300px) 40vw, 520px"
          />

          {/* Cell 2 — top center */}
          <BentoCell
            cat={categories[1]}
            index={1}
            isActive={displayCategory?._id === categories[1]?._id}
            onEnter={() => setActiveCategory(categories[1])}
            onLeave={() => setActiveCategory(null)}
            className="col-start-2 row-start-1 row-span-1"
            sizes="(max-width: 1300px) 27vw, 350px"
          />

          {/* Cell 3 — full-height right portrait */}
          <BentoCell
            cat={categories[2]}
            index={2}
            isActive={displayCategory?._id === categories[2]?._id}
            onEnter={() => setActiveCategory(categories[2])}
            onLeave={() => setActiveCategory(null)}
            className="col-start-3 row-start-1 row-span-2"
            sizes="(max-width: 1300px) 33vw, 430px"
          />

          {/* Cell 4 — bottom center */}
          <BentoCell
            cat={categories[3]}
            index={3}
            isActive={displayCategory?._id === categories[3]?._id}
            onEnter={() => setActiveCategory(categories[3])}
            onLeave={() => setActiveCategory(null)}
            className="col-start-2 row-start-2 row-span-1"
            sizes="(max-width: 1300px) 27vw, 350px"
          />
        </div>
      </div>
    </section>
  );
}

/* ── Reusable Bento Cell ── */
function BentoCell({
  cat,
  index,
  isActive,
  onEnter,
  onLeave,
  className = "",
  sizes,
}) {
  if (!cat) return <div className={`bg-gray-100 ${className}`} />;

  return (
    <Link
      href={`/collections/${cat.slug}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden group bg-gray-100 ${className}`}
    >
      {/* Image */}
      <Image
        src={cat.image}
        alt={cat.name}
        fill
        className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isActive ? "scale-105 brightness-90" : "scale-100 brightness-[0.55]"
        }`}
        sizes={sizes}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/5 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 lg:p-7">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <span
              className={`text-[10px] tabular-nums tracking-[0.3em] transition-colors duration-500 ${
                isActive ? "text-white/40" : "text-white/15"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className={`text-lg xl:text-2xl font-light tracking-tight leading-none transition-all duration-500 ${
                isActive ? "text-white" : "text-white/50"
              }`}
            >
              {cat.name}
            </h3>
          </div>

          {/* Arrow pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 border border-white/20 transition-all duration-500 ${
              isActive
                ? "opacity-100 translate-y-0 bg-white/10"
                : "opacity-0 translate-y-2"
            }`}
          >
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/70">
              Shop
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/70"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
