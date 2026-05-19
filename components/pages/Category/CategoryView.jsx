"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { SlidersHorizontal } from "lucide-react";
import FilterContent from "./sections/FilterContent";
import FilterDrawer from "./sections/FilterDrawer";
import ProductGrid from "./sections/ProductGrid";
import { useCategoryFilters } from "./sections/useCategoryFilters";
import { useCategories } from "@/hooks/api/useCategories";
import { useMemo } from "react";

export default function CategoryView({ category }) {
  const {
    categoryData,
    filteredProducts,
    isLoading,
    isFilterMobileOpen,
    setIsFilterMobileOpen,
    selectedSubCategoryIds = [],
    toggleSubCategory,
    ...filterProps
  } = useCategoryFilters(category);

  const { useCategoryTree } = useCategories();
  const { data: allCategories = [] } = useCategoryTree();

  const subCategories = useMemo(() => {
    if (!categoryData?.data?._id && !categoryData?._id) return [];
    const currentId = categoryData?.data?._id || categoryData?._id;
    return allCategories.filter((cat) => cat.parentId === currentId);
  }, [allCategories, categoryData]);

  const title =
    categoryData?.data?.name ||
    categoryData?.name ||
    (category.toLowerCase() === "all"
      ? "ALL PRODUCTS"
      : category
          .replace(/-/g, " ")
          .replace(/\btshirt\b/gi, "T-SHIRT")
          .toUpperCase());

  return (
    <div className="w-full flex flex-col min-h-screen bg-white pt-24 lg:pt-32 pb-24 px-4 md:px-6 lg:px-12 overflow-hidden">
      {/* Category Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end border-b border-gray-100 pb-8 lg:pb-10 mb-10 lg:mb-12 gap-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb
            customItems={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: title },
            ]}
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide text-black uppercase leading-tight lg:leading-none pr-4">
            {title}
          </h1>
          {subCategories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2 select-none">
              {subCategories.map((sub) => {
                const isActive = selectedSubCategoryIds.includes(sub._id);
                return (
                  <button
                    key={sub._id}
                    onClick={() => toggleSubCategory(sub._id)}
                    className={`px-3 py-1.5 border text-[9px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 ${
                      isActive
                        ? "bg-black border-black text-white"
                        : "bg-white border-zinc-200 text-zinc-500 hover:border-black hover:text-black"
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between lg:justify-end items-center lg:items-end gap-6 w-full lg:w-auto">
          <button
            onClick={() => setIsFilterMobileOpen(true)}
            className="flex lg:hidden items-center gap-2.5 px-4 py-2.5 border border-black transition-all active:scale-95 group hover:bg-black hover:text-white bg-white shadow-sm"
          >
            <SlidersHorizontal
              size={14}
              strokeWidth={2.5}
              className="group-active:text-white"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">
              Filters
            </span>
          </button>

          <div className="flex text-[9px] md:text-[11px] font-bold tracking-[0.15em] text-gray-400 uppercase pb-1">
            <span className="text-black">{filteredProducts.length}</span>{" "}
            &nbsp;Items
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:flex w-[240px] shrink-0 sticky top-28 flex-col">
          <FilterContent {...filterProps} />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 w-full">
          <ProductGrid
            isLoading={isLoading}
            filteredProducts={filteredProducts}
            resetFilters={filterProps.resetFilters}
          />
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterMobileOpen}
        onClose={() => setIsFilterMobileOpen(false)}
        filteredCount={filteredProducts.length}
        {...filterProps}
      />
    </div>
  );
}
