"use client";
import TiptapEditor from "@/components/admin/shared/TiptapEditor";
import { Select } from "@/components/ui/Select";
import { Label } from "./Shared";

const BasicInfo = ({ product, setProduct }) => {
  return (
    <section>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-200 pb-6 md:pb-8 mb-8 font-montserrat gap-6">
        <div className="space-y-2">
          <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
            Block 01
          </h2>
          <p className="text-xl md:text-2xl font-light text-black tracking-tight">
            Basic Information
          </p>
        </div>
      </div>

      {/* Global Configurations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 font-montserrat">
        {/* Inventory Registry */}
        <div className="flex items-center gap-6 px-6 py-4 bg-zinc-50 border border-zinc-100 group hover:bg-white hover:border-black transition-all duration-300">
          <div className="flex flex-col gap-1 min-w-fit">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-500">
              Inventory Registry
            </span>
            <span className="text-[10px] font-black uppercase tracking-tighter text-black">
              Target Stage
            </span>
          </div>
          <div className="flex-1">
            <Select
              options={[
                { value: "in-stock", label: "In Stock" },
                { value: "out-of-stock", label: "Out of Stock" },
                { value: "pre-order", label: "Pre-order" },
                { value: "upcoming", label: "Upcoming" },
              ]}
              value={product.stockStage}
              onChange={(val) => setProduct({ ...product, stockStage: val })}
              size="sm"
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border border-zinc-100 group hover:bg-white hover:border-black transition-all duration-300">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-500">
              Global Visibility
            </span>
            <span className="text-[10px] font-black uppercase tracking-tighter text-black">
              Featured Product
            </span>
          </div>
          <button
            onClick={() =>
              setProduct((p) => ({ ...p, isFeatured: !p.isFeatured }))
            }
            className={`w-10 h-5 rounded-full transition-all duration-500 relative shrink-0 ${product.isFeatured ? "bg-black" : "bg-zinc-200"}`}
          >
            <div
              className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500 ${product.isFeatured ? "left-6" : "left-1"}`}
            />
          </button>
        </div>

        {/* Manual Badge */}
        <div className="flex items-center gap-6 px-6 py-4 bg-zinc-50 border border-zinc-100 group hover:bg-white hover:border-black transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex flex-col gap-1 min-w-fit">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-500">
              Manual Badge
            </span>
            <span className="text-[10px] font-black uppercase tracking-tighter text-black">
              Display Label
            </span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={product.badge}
              onChange={(e) =>
                setProduct({
                  ...product,
                  badge: e.target.value.toUpperCase(),
                })
              }
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-[11px] font-bold uppercase tracking-widest text-black py-1 placeholder:text-zinc-300"
              placeholder="E.G. HOT, NEW"
              list="badge-suggestions"
            />
            <datalist id="badge-suggestions">
              <option value="NEW" />
              <option value="HOT" />
              <option value="LIMITED" />
              <option value="BEST SELLER" />
            </datalist>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-4">
          <Label>Product Title</Label>
          <input
            type="text"
            value={product.title}
            onChange={(e) =>
              setProduct({ ...product, title: e.target.value })
            }
            className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl md:text-3xl font-light placeholder:text-zinc-200 text-black py-4"
            placeholder="Enter product name"
          />
        </div>
        <div className="space-y-4">
          <Label>Product Description</Label>
          <div className="border border-zinc-200 p-px">
            <TiptapEditor
              content={product.description}
              onChange={(html) =>
                setProduct({ ...product, description: html })
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfo;
