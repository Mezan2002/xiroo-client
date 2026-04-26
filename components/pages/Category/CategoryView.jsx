"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import ProductCard from "@/components/ui/ProductCard";
import { useCategories } from "@/hooks/api/useCategories";
import { useProducts } from "@/hooks/api/useProducts";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

export default function CategoryView({ category }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({});

  // 0. Debounce Search Logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(tempSearchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [tempSearchQuery]);

  const { useCategoryDetail } = useCategories();
  const { data: categoryData } = useCategoryDetail(category);

  const { useAllProducts } = useProducts();

  const queryParams = useMemo(() => {
    const p = { limit: 1000 };
    if (category !== "all") p.categorySlug = category;
    if (searchQuery) p.searchTerm = searchQuery;
    if (minPrice) p.minPrice = minPrice;
    if (maxPrice) p.maxPrice = maxPrice;
    
    // Convert selectedStatuses to API params if necessary
    // Note: Backend currently only supports inStock=true/false
    if (selectedStatuses.includes("in-stock") && !selectedStatuses.includes("out-of-stock")) p.inStock = "true";
    if (selectedStatuses.includes("out-of-stock") && !selectedStatuses.includes("in-stock")) p.inStock = "false";
    
    return p;
  }, [category, searchQuery, minPrice, maxPrice, selectedStatuses]);

  const { data: productsResponse, isLoading } = useAllProducts(queryParams);

  const products = productsResponse?.data || [];
  
  // 1. Extract dynamic variant options
  const variantOptions = useMemo(() => {
    const options = {};
    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (!options[variant.name]) options[variant.name] = new Set();
        variant.values?.forEach((val) => {
          const valueName = val?.value || val;
          if (valueName) options[variant.name].add(valueName);
        });
      });
    });

    Object.keys(options).forEach((key) => {
      options[key] = Array.from(options[key]);
    });
    return options;
  }, [products]);

  // 2. Toggle variant filter
  const toggleVariantFilter = (variantName, value) => {
    setSelectedVariants((prev) => {
      const activeValues = prev[variantName] || [];
      if (activeValues.includes(value)) {
        return {
          ...prev,
          [variantName]: activeValues.filter((v) => v !== value),
        };
      } else {
        return { ...prev, [variantName]: [...activeValues, value] };
      }
    });
  };

  // 3. Compute Filtered Products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // A. Filter by Availability Status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((product) => {
        const status = product.stockStage || (product.inventory > 0 ? "in-stock" : "out-of-stock");
        return selectedStatuses.includes(status);
      });
    }

    // B. Filter by Price Range
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Number.MAX_SAFE_INTEGER;
      filtered = filtered.filter((product) => {
        const effectivePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
        return effectivePrice >= min && effectivePrice <= max;
      });
    }

    // C. Filter by Dynamic Variants
    const activeVariantNames = Object.keys(selectedVariants).filter(
      (name) => selectedVariants[name].length > 0
    );

    if (activeVariantNames.length > 0) {
      filtered = filtered.filter((product) => {
        return activeVariantNames.every((variantName) => {
          const productVariant = product.variants?.find(
            (v) => v.name === variantName
          );
          if (!productVariant) return false;

          const productValues = productVariant.values.map((v) => v.value || v);
          return selectedVariants[variantName].some((selectedVal) =>
            productValues.includes(selectedVal)
          );
        });
      });
    }

    return filtered;
  }, [products, selectedVariants, selectedStatuses, minPrice, maxPrice]);

  const title =
    categoryData?.data?.name ||
    (category.toLowerCase() === "all"
      ? "ALL PRODUCTS"
      : category.replace(/-/g, " ").toUpperCase());

  const inStockCount = products.filter((p) => p.inventory > 0).length;
  const outOfStockCount = products.filter((p) => p.inventory === 0).length;
  const preOrderCount = products.filter((p) => p.stockStage === "pre-order").length;
  const upcomingCount = products.filter((p) => p.stockStage === "upcoming").length;

  const isFiltering =
    tempSearchQuery || selectedStatuses.length > 0 || minPrice || maxPrice || Object.values(selectedVariants).some((vals) => vals.length > 0);

  const toggleStatusFilter = (status) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const applyPriceFilter = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white pt-24 lg:pt-32 pb-24 px-4 md:px-6 lg:px-12 max-w-[1600px] mx-auto overflow-hidden">
      {/* Category Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end border-b border-gray-100 pb-8 lg:pb-10 mb-10 lg:mb-12 gap-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb />
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[60px] font-light tracking-wide text-black uppercase leading-tight lg:leading-none pr-4">
            {title}
          </h1>
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
            <span className="text-black">{filteredProducts.length}</span> &nbsp;Items
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:flex w-[240px] shrink-0 sticky top-28 flex-col">
          <div className="flex flex-col gap-10">
            {/* Search Filter */}
            <div className="flex flex-col">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                Quick Search
              </h3>
              <div className="relative flex items-center w-full border-b border-gray-200 pb-3 group">
                <Search
                  size={14}
                  className="text-gray-400 group-hover:text-black transition-colors absolute left-0"
                />
                <input
                  type="text"
                  placeholder="SEARCH CATALOG"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-7 pr-2 text-[10px] uppercase font-semibold tracking-widest outline-none placeholder-gray-400 text-black"
                />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="flex flex-col">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                Availability
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { id: "in-stock", label: "In Stock", count: inStockCount },
                  { id: "out-of-stock", label: "Out of Stock", count: outOfStockCount },
                  { id: "pre-order", label: "Pre-Order", count: preOrderCount },
                  { id: "upcoming", label: "Upcoming", count: upcomingCount },
                ].map((status) => (
                  <label key={status.id} className="flex items-center gap-3 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedStatuses.includes(status.id)}
                      onChange={() => toggleStatusFilter(status.id)}
                    />
                    <div
                      className={`w-[14px] h-[14px] border rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${selectedStatuses.includes(status.id) ? "border-black" : "border-gray-300 group-hover:border-black"}`}
                    >
                      <div
                        className={`w-[6px] h-[6px] bg-black rounded-[1px] transition-all duration-300 ${selectedStatuses.includes(status.id) ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                      />
                    </div>
                    <span
                      className={`text-[11px] transition-colors ${selectedStatuses.includes(status.id) ? "text-black font-semibold tracking-widest" : "text-gray-500 font-medium tracking-wider group-hover:text-black"}`}
                    >
                      {status.label} ({status.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex flex-col">
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                Price Range
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex flex-col flex-1">
                    <label className="text-[9px] text-gray-400 mb-2 uppercase tracking-widest font-medium">
                      Min (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-[11px] font-medium focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                  <span className="text-gray-300 mt-6">-</span>
                  <div className="flex flex-col flex-1">
                    <label className="text-[9px] text-gray-400 mb-2 uppercase tracking-widest font-medium">
                      Max (৳)
                    </label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-[11px] font-medium focus:outline-none focus:border-black transition-all"
                    />
                  </div>
                </div>
                <Button 
                  onClick={applyPriceFilter}
                  className="w-full bg-black text-white text-[9px] font-bold tracking-widest py-2 rounded-none"
                >
                  APPLY PRICE
                </Button>
              </div>
            </div>

            {/* Dynamic Variant Filters */}
            {Object.entries(variantOptions).map(([variantName, values]) => (
              <div key={variantName} className="flex flex-col">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                  {variantName}
                </h3>
                <div className="flex flex-col gap-4 max-h-[200px] overflow-y-auto pr-2">
                  {values.map((value) => {
                    const isActive = selectedVariants[variantName]?.includes(value);
                    return (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isActive || false}
                          onChange={() => toggleVariantFilter(variantName, value)}
                        />
                        <div
                          className={`w-[14px] h-[14px] border rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${isActive ? "border-black" : "border-gray-300 group-hover:border-black"}`}
                        >
                          <div
                            className={`w-[6px] h-[6px] bg-black rounded-[1px] transition-all duration-300 ${isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                          />
                        </div>
                        <span
                          className={`text-[11px] transition-colors ${isActive ? "text-black font-semibold tracking-widest" : "text-gray-500 font-medium tracking-wider group-hover:text-black uppercase"}`}
                        >
                          {value}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Clear Button */}
            {isFiltering && (
              <Button
                variant="link"
                size="sm"
                showHoverIcon={false}
                onClick={() => {
                  setSearchQuery("");
                  setTempSearchQuery("");
                  setSelectedStatuses([]);
                  setMinPrice("");
                  setMaxPrice("");
                  setTempMinPrice("");
                  setTempMaxPrice("");
                  setSelectedVariants({});
                }}
                className="mt-2 text-left text-[10px] text-zinc-400 hover:text-black transition-colors w-fit underline underline-offset-4 uppercase tracking-[0.15em] font-bold"
              >
                Reset All
              </Button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 w-full">
          {isLoading ? (
            <div className="w-full h-96 flex items-center justify-center">
              <div className="w-10 h-10 border-[3px] border-zinc-100 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-16">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  salePrice={product.salePrice}
                  image={product.images?.[0]}
                  images={product.images}
                  variants={product.variants}
                  priority={idx < 4}
                  stockStage={product.stockStage}
                  badge={product.badge}
                />
              ))}
            </div>
          ) : (
            <div className="w-full py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-sm">
              <SlidersHorizontal size={32} className="text-gray-200 mb-6" />
              <p className="text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-2">
                No matches found
              </p>
              <p className="text-[10px] font-medium text-gray-400 tracking-wider mb-8 max-w-[280px]">
                We couldn&apos;t find items matching your active constraints.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setSearchQuery("");
                  setTempSearchQuery("");
                  setSelectedStatuses([]);
                  setMinPrice("");
                  setMaxPrice("");
                  setTempMinPrice("");
                  setTempMaxPrice("");
                  setSelectedVariants({});
                }}
                className="bg-black text-white text-[10px] px-8 py-3 tracking-[0.2em]"
              >
                RESET SELECTION
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      <div
        className={`fixed inset-0 z-100 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isFilterMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsFilterMobileOpen(false)}
      />

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[85%] max-w-[340px] bg-white z-101 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] lg:hidden ${isFilterMobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full bg-white relative">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.3em]">
              Refine Items
            </h2>
            <button
              onClick={() => setIsFilterMobileOpen(false)}
              className="p-2 -mr-2"
            >
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <div className="flex flex-col gap-10">
              {/* Search Filter */}
              <div className="flex flex-col">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                  Quick Search
                </h3>
                <div className="relative flex items-center w-full border-b border-gray-200 pb-3 group">
                  <Search
                    size={14}
                    className="text-gray-400 group-hover:text-black transition-colors absolute left-0"
                  />
                  <input
                    type="text"
                    placeholder="SEARCH CATALOG"
                    value={tempSearchQuery}
                    onChange={(e) => setTempSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-7 pr-2 text-[10px] uppercase font-semibold tracking-widest outline-none placeholder-gray-400 text-black"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div className="flex flex-col">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                  Availability
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { id: "in-stock", label: "In Stock", count: inStockCount },
                    { id: "out-of-stock", label: "Out of Stock", count: outOfStockCount },
                    { id: "pre-order", label: "Pre-Order", count: preOrderCount },
                    { id: "upcoming", label: "Upcoming", count: upcomingCount },
                  ].map((status) => (
                    <label key={status.id} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedStatuses.includes(status.id)}
                        onChange={() => toggleStatusFilter(status.id)}
                      />
                      <div
                        className={`w-[14px] h-[14px] border rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${selectedStatuses.includes(status.id) ? "border-black" : "border-gray-300 group-hover:border-black"}`}
                      >
                        <div
                          className={`w-[6px] h-[6px] bg-black rounded-[1px] transition-all duration-300 ${selectedStatuses.includes(status.id) ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                        />
                      </div>
                      <span
                        className={`text-[11px] transition-colors ${selectedStatuses.includes(status.id) ? "text-black font-semibold tracking-widest" : "text-gray-500 font-medium tracking-wider group-hover:text-black"}`}
                      >
                        {status.label} ({status.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="flex flex-col">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                  Price Range
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex flex-col flex-1">
                      <label className="text-[9px] text-gray-400 mb-2 uppercase tracking-widest font-medium">
                        Min (৳)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={tempMinPrice}
                        onChange={(e) => setTempMinPrice(e.target.value)}
                        className="w-full border border-gray-200 p-2 text-[11px] font-medium focus:outline-none focus:border-black transition-all"
                      />
                    </div>
                    <span className="text-gray-300 mt-6">-</span>
                    <div className="flex flex-col flex-1">
                      <label className="text-[9px] text-gray-400 mb-2 uppercase tracking-widest font-medium">
                        Max (৳)
                      </label>
                      <input
                        type="number"
                        placeholder="50000"
                        value={tempMaxPrice}
                        onChange={(e) => setTempMaxPrice(e.target.value)}
                        className="w-full border border-gray-200 p-2 text-[11px] font-medium focus:outline-none focus:border-black transition-all"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={applyPriceFilter}
                    className="w-full bg-black text-white text-[9px] font-bold tracking-widest py-2 rounded-none"
                  >
                    APPLY PRICE
                  </Button>
                </div>
              </div>

              {/* Dynamic Variant Filters */}
              {Object.entries(variantOptions).map(([variantName, values]) => (
                <div key={variantName} className="flex flex-col">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
                    {variantName}
                  </h3>
                  <div className="flex flex-col gap-4 max-h-[200px] overflow-y-auto pr-2">
                    {values.map((value) => {
                      const isActive = selectedVariants[variantName]?.includes(value);
                      return (
                        <label
                          key={value}
                          className="flex items-center gap-3 cursor-pointer group select-none"
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isActive || false}
                            onChange={() => toggleVariantFilter(variantName, value)}
                          />
                          <div
                            className={`w-[14px] h-[14px] border rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${isActive ? "border-black" : "border-gray-300 group-hover:border-black"}`}
                          >
                            <div
                              className={`w-[6px] h-[6px] bg-black rounded-[1px] transition-all duration-300 ${isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                            />
                          </div>
                          <span
                            className={`text-[11px] transition-colors ${isActive ? "text-black font-semibold tracking-widest" : "text-gray-500 font-medium tracking-wider group-hover:text-black uppercase"}`}
                          >
                            {value}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Clear Button */}
              {isFiltering && (
                <Button
                  variant="link"
                  size="sm"
                  showHoverIcon={false}
                  onClick={() => {
                    setSearchQuery("");
                    setTempSearchQuery("");
                    setSelectedStatuses([]);
                    setMinPrice("");
                    setMaxPrice("");
                    setTempMinPrice("");
                    setTempMaxPrice("");
                    setSelectedVariants({});
                  }}
                  className="mt-2 text-left text-[10px] text-zinc-400 hover:text-black transition-colors w-fit underline underline-offset-4 uppercase tracking-[0.15em] font-bold"
                >
                  Reset All
                </Button>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 flex items-center gap-3">
            <Button
              variant="primary"
              className="w-full bg-black text-white py-4 text-[11px] font-bold tracking-[0.2em] leading-none"
              onClick={() => setIsFilterMobileOpen(false)}
            >
              SHOW {filteredProducts.length} RESULTS
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
