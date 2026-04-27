"use client";
import { Trash2 } from "lucide-react";
import { SectionHeader } from "./Shared";

const BundleManager = ({ product, addBundle, removeBundle, updateBundle }) => {
  return (
    <section>
      <SectionHeader
        label="Block 06"
        title="Bundle Architecture"
        action={
          <button
            onClick={addBundle}
            className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
          >
            + Create Bundle
          </button>
        }
      />
      {product.bundles.length === 0 ? (
        <div className="bg-zinc-50 border border-zinc-200 p-10 md:p-20 text-center">
          <p className="text-[11px] md:text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
            No bundle configurations present.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {product.bundles.map((b) => (
            <div
              key={b.id}
              className="p-8 md:p-12 bg-white border border-zinc-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 group relative"
            >
              <button
                onClick={() => removeBundle(b.id)}
                className="absolute top-6 right-6 text-zinc-200 hover:text-red-500 transition-all"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-3">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                  Bundle Title
                </span>
                <input
                  className="w-full bg-transparent border-b border-zinc-100 focus:border-black outline-none text-[12px] font-bold text-black uppercase tracking-widest py-1"
                  value={b.title}
                  onChange={(e) => updateBundle(b.id, "title", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                  Marketing Label
                </span>
                <input
                  className="w-full bg-transparent border-b border-zinc-100 focus:border-black outline-none text-[12px] font-bold text-zinc-900 uppercase tracking-widest py-1"
                  value={b.subtitle}
                  onChange={(e) =>
                    updateBundle(b.id, "subtitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-3">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                  Valuation (Price)
                </span>
                <input
                  type="number"
                  className="w-full bg-transparent border-b border-zinc-100 focus:border-black outline-none text-[14px] font-bold text-black py-1"
                  value={b.price}
                  onChange={(e) => updateBundle(b.id, "price", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                  Unit Constant
                </span>
                <input
                  type="number"
                  className="w-full bg-transparent border-b border-zinc-100 focus:border-black outline-none text-[14px] font-bold text-black py-1"
                  value={b.unitPrice}
                  onChange={(e) =>
                    updateBundle(b.id, "unitPrice", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BundleManager;
