"use client";

export default function VariantSelector({ variants, selectedVariants, setSelectedVariants }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="w-full mb-10 px-[2px]">
      <div className="flex flex-col gap-6">
        {variants.map((variant) => (
          <div key={variant.name} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                Select {variant.name}
              </span>
              <span
                className={`text-[9px] font-bold tracking-widest uppercase ${!selectedVariants[variant.name] ? "text-red-500 animate-pulse" : "text-gray-600"}`}
              >
                {selectedVariants[variant.name] || "Required"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {variant.values.map((vObj) => {
                const val = typeof vObj === "string" ? vObj : vObj.value;
                const vPrice = typeof vObj === "string" ? null : vObj.price;
                const isSelected = selectedVariants[variant.name] === val;
                return (
                  <button
                    key={val}
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [variant.name]: val,
                      }))
                    }
                    className={`min-w-[100px] h-12 px-4 text-[10px] font-bold tracking-widest transition-all border uppercase flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? "bg-black text-white border-black shadow-lg"
                        : "bg-white text-gray-500 border-gray-200 hover:border-black"
                    }`}
                  >
                    <span>{val}</span>
                    {vPrice > 0 && (
                      <span
                        className={`text-[8px] ${isSelected ? "text-white/60" : "text-zinc-400"}`}
                      >
                        ৳{vPrice}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
