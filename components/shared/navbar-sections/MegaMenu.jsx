/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MegaMenu({
  activeMenu,
  scrolled,
  menusData,
  setActiveMenu,
}) {
  const [displayMenu, setDisplayMenu] = useState(null);

  useEffect(() => {
    if (activeMenu) {
      setDisplayMenu(activeMenu);
    } else {
      const timer = setTimeout(() => {
        setDisplayMenu(null);
      }, 500); // Buffer for animation
      return () => clearTimeout(timer);
    }
  }, [activeMenu]);

  const currentMenu = displayMenu || activeMenu;
  const currentMenuData =
    currentMenu && menusData[currentMenu]
      ? menusData[currentMenu]
      : { categories: [], products: [] };

  return (
    <div
      className={`absolute top-[72px] left-0 w-full cursor-default ${activeMenu !== null ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-white border-t border-gray-100 origin-top transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] -z-10 ${
          activeMenu !== null
            ? `scale-y-100 shadow-xl ${!scrolled ? "delay-300" : "delay-0"}`
            : "scale-y-0 shadow-none delay-75"
        }`}
      />
      <div
        className={`flex justify-between px-6 lg:px-12 py-10 w-full max-w-[1600px] mx-auto transition-all duration-75 ${activeMenu !== null ? `opacity-100 visible ${!scrolled ? "delay-600" : "delay-300"}` : "opacity-0 invisible translate-y-1 delay-0"}`}
      >
        <div className="flex flex-col gap-3 min-w-[250px]">
          {currentMenuData.categories.length > 0 ? (
            currentMenuData.categories.map((category) => (
              <Link
                key={category._id}
                href={`/collections/${category.slug}`}
                className="text-lg font-medium tracking-wide text-gray-800 hover:text-black inline-block"
                onClick={() => setActiveMenu(null)}
              >
                {category.name.toUpperCase()}
              </Link>
            ))
          ) : (
            <Link
              href={`/${activeMenu}`}
              onClick={() => setActiveMenu(null)}
              className="group block w-full max-w-[280px]"
            >
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-sm group-hover:bg-gray-100 transition-colors">
                <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest italic group-hover:text-black transition-colors">
                  No categories available yet
                </p>
              </div>
            </Link>
          )}
        </div>
        <div className="flex gap-6 items-start min-h-[150px]">
          {currentMenuData.products.length > 0 ? (
            currentMenuData.products.map((product, idx) => (
              <div key={idx} className="w-[250px] shrink-0">
                <ProductCard
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  salePrice={product.salePrice}
                  image={product.images?.[0]}
                  images={product.images}
                  hoverImage={product.images?.[1]}
                  variants={product.variants}
                  badge={product.badge}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-[380px] h-full border border-dashed border-gray-100 bg-gray-50/50 rounded-sm">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                No Featured Selection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
