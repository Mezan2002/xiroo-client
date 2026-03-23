"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductCard from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const ALL_PRODUCTS = [
  {
    id: "1",
    title: "CAT STEAM BRUSH STEAMY DOG BRUSH",
    price: "$24.45",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600",
    inStock: true,
  },
  {
    id: "2",
    title: "WINTER HEATED JACKET USB ELECTRIC",
    price: "$45.90",
    image: "https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1591047139829-d91aec36caea?auto=format&fit=crop&q=80&w=600",
    inStock: true,
  },
  {
    id: "3",
    title: "XIROO™ 4-IN-1 TRAVEL DISPENSING BOTTLES",
    price: "$28.55",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1610461888750-10bfc601b874?auto=format&fit=crop&q=80&w=600",
    inStock: false,
  },
  {
    id: "4",
    title: "XIROO™ 5-IN-1 KITCHEN VEGETABLE CUTTER",
    price: "$45.99",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1616644200388-1bfd5985860b?auto=format&fit=crop&q=80&w=600",
    inStock: true,
  },
  {
    id: "5",
    title: "MINIMALIST NORDIC READING LAMP",
    price: "$120.00",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb270?auto=format&fit=crop&q=80&w=600",
    hoverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
    inStock: true,
  },
  {
    id: "6",
    title: "CURATED NORDIC AESTHETICS CHAIR",
    price: "$350.00",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600",
    inStock: true,
  },
  {
    id: "7",
    title: "GRAVITY BALANCE LIGHT (LIGHT)",
    price: "$180.00",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=600",
    inStock: false,
  },
  {
    id: "8",
    title: "GRAVITY BALANCE LIGHT (DARK)",
    price: "$180.00",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
    inStock: true,
  },
];

// Subtly duplicate the catalog to fill out the grid nicely for demonstration
const MOCK_CATALOG = [
  ...ALL_PRODUCTS,
  ...[...ALL_PRODUCTS].reverse().map((p) => ({ ...p, id: `dup-${p.id}` })),
];

export default function CategoryView({ category }) {
  const title =
    category.toLowerCase() === "all"
      ? "ALL PRODUCTS"
      : category.replace(/-/g, " ").toUpperCase();

  const [searchQuery, setSearchQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filteredProducts = useMemo(() => {
    return MOCK_CATALOG.filter((product) => {
      // 1. Search Query
      if (
        searchQuery &&
        !product.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. Availability
      if (inStockOnly && !outOfStockOnly && !product.inStock) return false;
      if (outOfStockOnly && !inStockOnly && product.inStock) return false;

      // 3. Pricing
      const priceVal = parseFloat(product.price.replace(/[^0-9.]/g, ""));
      if (minPrice && priceVal < parseFloat(minPrice)) return false;
      if (maxPrice && priceVal > parseFloat(maxPrice)) return false;

      return true;
    });
  }, [searchQuery, inStockOnly, outOfStockOnly, minPrice, maxPrice]);

  const inStockCount = MOCK_CATALOG.filter((p) => p.inStock).length;
  const outOfStockCount = MOCK_CATALOG.filter((p) => !p.inStock).length;
  const isFiltering =
    searchQuery || inStockOnly || outOfStockOnly || minPrice || maxPrice;

  return (
    <div className="w-full flex flex-col min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto">
      {/* Category Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end border-b border-gray-100 pb-10 mb-12 gap-6">
        <div className="flex flex-col gap-4">
          <Breadcrumb />
          <h1 className="text-3xl md:text-5xl lg:text-[60px] font-light tracking-wide text-black uppercase leading-none">
            {title}
          </h1>
        </div>
        <div className="flex text-[10px] md:text-[11px] font-semibold tracking-[0.15em] text-black uppercase pb-1">
          <span>{filteredProducts.length} ITEMS FOUND</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-[240px] shrink-0 sticky top-28 flex flex-col gap-10">
          {/* Search Filter */}
          <div className="flex flex-col">
            <div className="relative flex items-center w-full border-b border-gray-200 pb-3 group">
              <Search
                size={14}
                className="text-gray-400 group-hover:text-black transition-colors absolute left-0"
              />
              <input
                type="text"
                placeholder="SEARCH CATALOG"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-7 pr-2 text-[10px] uppercase font-semibold tracking-widest outline-none placeholder-gray-400 text-black"
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div className="flex flex-col">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
              Availability
            </h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <div
                  className={`w-[14px] h-[14px] border rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${inStockOnly ? "border-black" : "border-gray-300 group-hover:border-black"}`}
                >
                  <div
                    className={`w-[6px] h-[6px] bg-black rounded-[1px] transition-all duration-300 ${inStockOnly ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                  />
                </div>
                <span
                  className={`text-[11px] transition-colors ${inStockOnly ? "text-black font-semibold tracking-widest" : "text-gray-500 font-medium tracking-wider group-hover:text-black"}`}
                >
                  In Stock ({inStockCount})
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={outOfStockOnly}
                  onChange={(e) => setOutOfStockOnly(e.target.checked)}
                />
                <div
                  className={`w-[14px] h-[14px] border rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${outOfStockOnly ? "border-black" : "border-gray-300 group-hover:border-black"}`}
                >
                  <div
                    className={`w-[6px] h-[6px] bg-black rounded-[1px] transition-all duration-300 ${outOfStockOnly ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
                  />
                </div>
                <span
                  className={`text-[11px] transition-colors ${outOfStockOnly ? "text-black font-semibold tracking-widest" : "text-gray-500 font-medium tracking-wider group-hover:text-black"}`}
                >
                  Out of Stock ({outOfStockCount})
                </span>
              </label>
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex flex-col">
            <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-black mb-5 border-b border-gray-100 pb-3">
              Price Range
            </h3>
            <div className="flex items-center gap-3 w-full">
              <div className="flex flex-col flex-1">
                <label className="text-[9px] text-gray-400 mb-2 uppercase tracking-widest font-medium">
                  Min ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 p-2 text-[11px] font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
              <span className="text-gray-300 mt-6">-</span>
              <div className="flex flex-col flex-1">
                <label className="text-[9px] text-gray-400 mb-2 uppercase tracking-widest font-medium">
                  Max ($)
                </label>
                <input
                  type="number"
                  placeholder="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 p-2 text-[11px] font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Clear Button */}
          {isFiltering && (
            <Button
              variant="link"
              size="sm"
              showHoverIcon={false}
              onClick={() => {
                setSearchQuery("");
                setInStockOnly(false);
                setOutOfStockOnly(false);
                setMinPrice("");
                setMaxPrice("");
              }}
              className="mt-2 text-left text-[10px] text-zinc-400 hover:text-black transition-colors w-fit underline underline-offset-4"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Product Grid */}
        <div className="flex-1 w-full flex flex-col">
          {filteredProducts.length > 0 ? (
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-12 sm:gap-y-16">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          ) : (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center bg-gray-50">
              <p className="text-xs font-semibold text-black uppercase tracking-widest mb-2">
                No matches found
              </p>
              <p className="text-[11px] font-medium text-gray-500 tracking-wider mb-6">
                Modify your active constraints to discover more products.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setSearchQuery("");
                  setInStockOnly(false);
                  setOutOfStockOnly(false);
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="mt-4"
              >
                Clear Sidebar Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
