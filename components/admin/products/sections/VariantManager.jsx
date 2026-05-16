"use client";
import { Plus, Trash2, X } from "lucide-react";
import { Label, SectionHeader } from "./Shared";

const VariantManager = ({
  product,
  suggestedAttributes,
  addVariant,
  removeVariant,
  updateVariantName,
  addVariantValue,
  updateVariantValuePrice,
  removeVariantValue,
}) => {
  return (
    <section>
      <SectionHeader
        label="Block 04"
        title="Product Variants"
        action={
          <button
            onClick={() => addVariant()}
            className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
          >
            + New Option
          </button>
        }
      />

      {/* Suggested Attributes */}
      {suggestedAttributes.length > 0 && (
        <div className="mb-12 space-y-4 overflow-hidden">
          <Label>Recommended Options (Based on Category)</Label>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {suggestedAttributes.map((attr) => (
              <button
                key={attr._id}
                onClick={() => addVariant(attr.name, attr.values)}
                className="px-4 md:px-6 py-2 md:py-3 bg-white border border-[#EDECE9] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:border-black hover:text-black transition-all flex items-center gap-2 md:gap-3 group"
              >
                <Plus
                  size={12}
                  className="text-zinc-300 group-hover:text-black"
                />
                {attr.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {product.variants.length === 0 ? (
        <div className="bg-zinc-50 border border-zinc-200 p-10 md:p-20 text-center">
          <p className="text-[11px] md:text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
            No variants added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {product.variants.map((v) => (
            <div
              key={v.id}
              className="p-6 md:p-12 bg-white border border-zinc-200 space-y-6 md:space-y-8 group transition-all hover:bg-zinc-50/50"
            >
              <div className="flex items-center justify-between">
                <input
                  className="bg-transparent font-bold text-[12px] uppercase tracking-widest text-zinc-900 focus:text-black outline-none border-b border-transparent focus:border-black/10 w-4/12"
                  value={v.name}
                  onChange={(e) => updateVariantName(v.id, e.target.value)}
                />
                <div className="flex gap-8">
                  <button
                    onClick={() => {
                      const val = prompt("Enter new value:");
                      if (val) addVariantValue(v.id, val);
                    }}
                    className="text-zinc-300 hover:text-black transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeVariant(v.id)}
                    className="text-zinc-200 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {v.values.map((val, idx) => (
                  <span
                    key={idx}
                    className="px-4 md:px-6 py-2 md:py-3 bg-white border border-zinc-900 text-[10px] md:text-[11px] font-bold tracking-widest uppercase flex items-center gap-3 md:gap-4 text-black shadow-lg shadow-black/5"
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="leading-none">
                        {typeof val === "string" ? val : val.value}
                      </span>
                      <div className="flex items-center gap-1 border-b border-zinc-100 pb-0.5">
                        <span className="text-[8px] text-zinc-400">৳</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={typeof val === "string" ? "" : val.price}
                          onChange={(e) =>
                            updateVariantValuePrice(v.id, idx, e.target.value)
                          }
                          className="bg-transparent border-none outline-none text-[9px] w-12 text-zinc-500 font-bold placeholder:text-zinc-200"
                        />
                      </div>
                    </div>
                    <button onClick={() => removeVariantValue(v.id, idx)}>
                      <X
                        size={12}
                        className="text-zinc-300 hover:text-black"
                      />
                    </button>
                  </span>
                ))}
                <input
                  className="px-6 py-3 bg-zinc-50 border-2 border-dashed border-zinc-300 text-[11px] font-bold tracking-widest uppercase outline-none focus:border-black focus:border-solid w-40"
                  placeholder="+ VALUE"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addVariantValue(v.id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default VariantManager;
