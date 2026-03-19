"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  {
    id: "smart-home",
    name: "SMART HOME",
    count: 8,
    image: "/images/category-smart-home.png",
  },
  {
    id: "home-decor",
    name: "HOME DECOR",
    count: 4,
    image: "/images/category-home-decor.png",
  },
  {
    id: "lifestyle",
    name: "LIFESTYLE",
    count: 5,
    image: "/images/category-lifestyle.png",
  },
  {
    id: "kitchen-gadgets",
    name: "KITCHEN GADGETS",
    count: 10,
    image: "/images/category-kitchen.png",
  },
];

export default function FeaturedCategories() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  return (
    <section className="w-full py-24 lg:py-32 px-6 lg:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
        {/* Left Side: Category List */}
        <div className="w-full lg:w-7/12 flex flex-col gap-6 lg:gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/collections/${cat.id}`}
              onMouseEnter={() => setActiveCategory(cat)}
              className={`flex items-start w-fit group transition-colors duration-300 ${
                activeCategory.id === cat.id
                  ? "text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <h2 className="text-[32px] sm:text-4xl lg:text-[52px] font-light uppercase tracking-wide leading-none whitespace-nowrap">
                {cat.name}
              </h2>
              <span className="text-sm md:text-base lg:text-xl ml-2 lg:ml-4 font-normal text-gray-400 transition-colors duration-300 group-hover:text-gray-500">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Side: Featured Dynamic Image */}
        <div className="w-full lg:w-5/12 flex justify-end">
          <div className="relative w-full max-w-[480px] aspect-4/5 bg-gray-100 overflow-hidden">
            {CATEGORIES.map((cat) => (
              <Image
                key={cat.id}
                src={cat.image}
                alt={cat.name}
                fill
                className={`object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  activeCategory.id === cat.id
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-105"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
