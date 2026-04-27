"use client";
import { Check } from "lucide-react";

export default function BundleSelector({ product, activeBundles, selectedBundleId, setSelectedBundleId }) {
  const hasBundles = product.bundles && product.bundles.length > 0;
  const isOutOfStock = ["out-of-stock", "upcoming"].includes(product.stockStage);

  if (!hasBundles || isOutOfStock) return null;

  return (
    <div className="w-full mb-10 px-[2px]">
      <div className="flex flex-col text-left w-full mb-6 py-[2px]">
        <h3 className="text-[11px] font-bold tracking-[0.2em] text-black uppercase border-b border-gray-200 pb-3">
          Elite Packages
        </h3>
      </div>

      <div className="flex flex-col w-full gap-3">
        {activeBundles.map((bundle) => {
          const isSelected = selectedBundleId === bundle.id;

          return (
            <div
              key={bundle.id}
              onClick={() => setSelectedBundleId(bundle.id)}
              className={`relative w-full p-4 md:p-5 flex items-center justify-between cursor-pointer transition-all border ${
                isSelected
                  ? "bg-white border-black ring-1 ring-black shadow-xl"
                  : "bg-white border-gray-200 hover:border-gray-400"
              }`}
            >
              {bundle.badge && isSelected && (
                <div className="absolute -top-2.5 left-4 px-2 py-1 bg-black text-white text-[8px] font-bold tracking-[0.2em] uppercase">
                  {bundle.badge.text}
                </div>
              )}

              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div
                  className={`w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 border ${isSelected ? "border-black bg-black" : "border-gray-300"}`}
                >
                  {isSelected && (
                    <Check
                      size={8}
                      className="text-white"
                      strokeWidth={4}
                    />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] md:text-[13px] font-bold tracking-wider uppercase text-black truncate">
                      {bundle.title}
                    </span>
                    {bundle.discount && (
                      <span className="px-1.5 py-0.5 bg-gray-200 text-[8px] font-black tracking-tighter text-black uppercase">
                        {bundle.discount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5 truncate">
                    {bundle.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-4">
                <span className="text-[16px] md:text-[20px] font-bold tracking-tight text-black">
                  ৳{bundle.price.toLocaleString()}
                </span>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                  ৳{bundle.unitPrice} / Item
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
