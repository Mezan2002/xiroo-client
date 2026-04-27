"use client";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

export default function FilterContent({
  tempSearchQuery,
  setTempSearchQuery,
  selectedStatuses,
  toggleStatusFilter,
  tempMinPrice,
  setTempMinPrice,
  tempMaxPrice,
  setTempMaxPrice,
  applyPriceFilter,
  variantOptions,
  selectedVariants,
  toggleVariantFilter,
  isFiltering,
  resetFilters,
  counts,
}) {
  return (
    <div className="flex flex-col gap-10">
      {/* Search Filter */}
      <div className="flex flex-col">
        <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-5 pb-3">
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
            { id: "in-stock", label: "In Stock", count: counts.inStock },
            {
              id: "out-of-stock",
              label: "Out of Stock",
              count: counts.outOfStock,
            },
            { id: "pre-order", label: "Pre-Order", count: counts.preOrder },
            { id: "upcoming", label: "Upcoming", count: counts.upcoming },
          ].map((status) => (
            <label
              key={status.id}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
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
          onClick={resetFilters}
          className="mt-2 text-left text-[10px] text-zinc-400 hover:text-black transition-colors w-fit underline underline-offset-4 uppercase tracking-[0.15em] font-bold"
        >
          Reset All
        </Button>
      )}
    </div>
  );
}
