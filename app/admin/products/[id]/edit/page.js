"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import TiptapEditor from "@/components/admin/shared/TiptapEditor";
import { Button } from "@/components/ui/Button";
import { Package, Plus, Save, Trash2, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// --- Sub-components moved outside for React stability ---
const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 font-montserrat tracking-[0.2em]">
    {children}
  </label>
);

const SectionHeader = ({ label, title, action }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12 font-montserrat">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        {label}
      </h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  // State Management (Mocking initial data for edit)
  const [product, setProduct] = useState({
    title: "Signature Table Lamp",
    description: "<p>A seamless blend of material and light.</p>",
    price: "12500",
    salePrice: "9800",
    inventory: "42",
    sku: "XR-2024-MIN-01",
    tax: "15",
    variants: [{ id: 1, name: "Finish", values: ["Matte Bone", "Cold Steel"] }],
    specifications: [
      {
        id: 1,
        group: "Technical",
        items: [{ id: 101, label: "Lumen", value: "1200" }],
      },
    ],
    bundles: [],
  });

  // --- Handlers: Variants ---
  const addVariant = () =>
    setProduct((p) => ({
      ...p,
      variants: [...p.variants, { id: Date.now(), name: "Option", values: [] }],
    }));
  const removeVariant = (vid) =>
    setProduct((p) => ({
      ...p,
      variants: p.variants.filter((v) => v.id !== vid),
    }));
  const updateVariantName = (vid, name) =>
    setProduct((p) => ({
      ...p,
      variants: p.variants.map((v) => (v.id === vid ? { ...v, name } : v)),
    }));
  const addVariantValue = (vid, val) => {
    if (!val.trim()) return;
    setProduct((p) => ({
      ...p,
      variants: p.variants.map((v) =>
        v.id === vid ? { ...v, values: [...v.values, val] } : v,
      ),
    }));
  };
  const removeVariantValue = (vid, idx) =>
    setProduct((p) => ({
      ...p,
      variants: p.variants.map((v) =>
        v.id === vid
          ? { ...v, values: v.values.filter((_, i) => i !== idx) }
          : v,
      ),
    }));

  // --- Handlers: Specs ---
  const addSpecGroup = () =>
    setProduct((p) => ({
      ...p,
      specifications: [
        ...p.specifications,
        { id: Date.now(), group: "Group", items: [] },
      ],
    }));
  const removeSpecGroup = (gid) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.filter((g) => g.id !== gid),
    }));
  const updateSpecGroupName = (gid, name) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.map((g) =>
        g.id === gid ? { ...g, group: name } : g,
      ),
    }));
  const addSpecItem = (gid) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.map((g) =>
        g.id === gid
          ? {
              ...g,
              items: [...g.items, { id: Date.now(), label: "", value: "" }],
            }
          : g,
      ),
    }));
  const updateSpecItem = (gid, iid, field, val) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.map((g) =>
        g.id === gid
          ? {
              ...g,
              items: g.items.map((it) =>
                it.id === iid ? { ...it, [field]: val } : it,
              ),
            }
          : g,
      ),
    }));
  const removeSpecItem = (gid, iid) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.map((g) =>
        g.id === gid
          ? { ...g, items: g.items.filter((it) => it.id !== iid) }
          : g,
      ),
    }));

  // --- Handlers: Bundles ---
  const addBundle = () =>
    setProduct((p) => ({
      ...p,
      bundles: [
        ...p.bundles,
        {
          id: Date.now(),
          title: "PACK TITLE",
          subtitle: "TAG LINE",
          discount: "0% OFF",
          price: 0,
          unitPrice: 0,
        },
      ],
    }));
  const removeBundle = (bid) =>
    setProduct((p) => ({
      ...p,
      bundles: p.bundles.filter((b) => b.id !== bid),
    }));
  const updateBundle = (bid, f, v) =>
    setProduct((p) => ({
      ...p,
      bundles: p.bundles.map((b) => (b.id === bid ? { ...b, [f]: v } : b)),
    }));

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Edit", active: true }
        ]}
        title="Modify Product"
        icon={Package}
        primaryAction={{
          label: "Save Changes",
          icon: Save,
          onClick: () => console.log("Product Audit:", product),
        }}
      />

      <div className="space-y-32">
        {/* Identity Section */}
        <section>
          <SectionHeader label="Block 01" title="Product Narrative" />
          <div className="space-y-12">
            <div className="space-y-4">
              <Label>Product Nomenclature</Label>
              <input
                type="text"
                value={product.title}
                onChange={(e) =>
                  setProduct({ ...product, title: e.target.value })
                }
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-3xl font-light placeholder:text-zinc-200 text-black py-4"
                placeholder="Name of Product"
              />
            </div>
            <div className="space-y-4">
              <Label>Core Details (Description)</Label>
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

        {/* Configuration Section */}
        <section>
          <SectionHeader
            label="Block 02"
            title="Design Matrix"
            action={
              <button
                onClick={addVariant}
                className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                + New Option
              </button>
            }
          />
          {product.variants.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-200 p-20 text-center">
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
                No configuration variants active.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {product.variants.map((v) => (
                <div
                  key={v.id}
                  className="p-12 bg-white border border-zinc-200 space-y-8 group transition-all hover:bg-zinc-50/50"
                >
                  <div className="flex items-center justify-between">
                    <input
                      className="bg-transparent font-bold text-[12px] uppercase tracking-widest text-zinc-900 focus:text-black outline-none border-b border-transparent focus:border-black/10"
                      value={v.name}
                      onChange={(e) => updateVariantName(v.id, e.target.value)}
                    />
                    <button
                      onClick={() => removeVariant(v.id)}
                      className="text-zinc-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {v.values.map((val, idx) => (
                      <span
                        key={idx}
                        className="px-6 py-3 bg-white border-2 border-zinc-900 text-[11px] font-bold tracking-widest uppercase flex items-center gap-4 text-black shadow-lg shadow-black/5"
                      >
                        {val}
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

        {/* Technical Section */}
        <section>
          <SectionHeader
            label="Block 03"
            title="Technical Registry"
            action={
              <button
                onClick={addSpecGroup}
                className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                + Add Parameters
              </button>
            }
          />
          {product.specifications.length === 0 ? (
            <div className="bg-zinc-50 border border-zinc-200 p-20 text-center">
              <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
                Define metric constants for engineering verification.
              </p>
            </div>
          ) : (
            <div className="space-y-20">
              {product.specifications.map((group) => (
                <div
                  key={group.id}
                  className="space-y-12 border-l-4 border-zinc-900 pl-12 pt-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      className="bg-transparent text-[14px] font-bold text-black uppercase tracking-widest outline-none border-b border-transparent focus:border-black/10"
                      value={group.group}
                      onChange={(e) =>
                        updateSpecGroupName(group.id, e.target.value)
                      }
                    />
                    <div className="flex gap-8">
                      <button
                        onClick={() => addSpecItem(group.id)}
                        className="text-zinc-300 hover:text-black transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                      <button
                        onClick={() => removeSpecGroup(group.id)}
                        className="text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-6 items-center border-b border-zinc-100 pb-4 group"
                      >
                        <input
                          className="bg-transparent text-[10px] font-bold text-zinc-500 uppercase tracking-widest w-[40%] outline-none focus:text-black transition-colors"
                          value={item.label}
                          onChange={(e) =>
                            updateSpecItem(
                              group.id,
                              item.id,
                              "label",
                              e.target.value,
                            )
                          }
                          placeholder="Label"
                        />
                        <input
                          className="bg-transparent text-[14px] font-medium text-black flex-1 text-right outline-none"
                          value={item.value}
                          onChange={(e) =>
                            updateSpecItem(
                              group.id,
                              item.id,
                              "value",
                              e.target.value,
                            )
                          }
                          placeholder="Measure"
                        />
                        <button
                          onClick={() => removeSpecItem(group.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-zinc-200 hover:text-red-500 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Commercial Section */}
        <section>
          <SectionHeader
            label="Block 04"
            title="Commercial Bundling"
            action={
              <button
                onClick={addBundle}
                className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest transition-colors"
              >
                + New Offer Tier
              </button>
            }
          />
          {product.bundles.length === 0 ? (
            <div className="bg-black text-white p-20 text-center space-y-6">
              <p className="text-[12px] font-bold uppercase tracking-[0.4em] opacity-40">
                Tiered Strategy Inactive
              </p>
              <p className="text-[13px] font-light italic opacity-70 max-w-sm mx-auto tracking-wide leading-relaxed">
                Configure bulk acquisition incentives (e.g. Duo-Pack,
                Family-Pack) to optimize conversion.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {product.bundles.map((b) => (
                <div
                  key={b.id}
                  className="p-12 border-2 border-zinc-200 bg-white space-y-12 group hover:border-black transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-8 items-center">
                      <input
                        className="text-[16px] font-bold uppercase tracking-widest outline-none bg-transparent text-black"
                        value={b.title}
                        onChange={(e) =>
                          updateBundle(b.id, "title", e.target.value)
                        }
                      />
                      <input
                        className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest outline-none"
                        value={b.discount}
                        onChange={(e) =>
                          updateBundle(b.id, "discount", e.target.value)
                        }
                      />
                    </div>
                    <button
                      onClick={() => removeBundle(b.id)}
                      className="text-zinc-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                      <Label>Offer Status Badge</Label>
                      <input
                        className="w-full bg-zinc-50 border-b border-zinc-300 text-[12px] font-bold uppercase tracking-widest outline-none focus:border-black py-3 px-4"
                        value={b.subtitle}
                        onChange={(e) =>
                          updateBundle(b.id, "subtitle", e.target.value)
                        }
                        placeholder="PROMOTIONAL TAG"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Effective Tier Price</Label>
                      <input
                        className="w-full bg-zinc-50 border-b border-zinc-300 text-[20px] font-bold outline-none focus:border-black py-3 px-4"
                        value={b.price}
                        onChange={(e) =>
                          updateBundle(b.id, "price", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label>Calculated Unit Value</Label>
                      <input
                        className="w-full bg-zinc-50 border-b border-zinc-300 text-[20px] font-bold outline-none focus:border-black py-3 px-4"
                        value={b.unitPrice}
                        onChange={(e) =>
                          updateBundle(b.id, "unitPrice", e.target.value)
                        }
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Valuation Section */}
        <section>
          <SectionHeader label="Block 05" title="Monetary Valuation" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20">
            <div className="md:col-span-12 py-10">
              <div className="space-y-24">
                <div className="space-y-12 text-center">
                  <Label>Standard Retail Unit Price</Label>
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-4 group">
                      <span className="text-6xl font-light text-zinc-900 mt-2 font-montserrat tracking-tighter transition-all group-hover:scale-105">
                        ৳
                      </span>
                      <input
                        type="text"
                        value={product.price}
                        onChange={(e) =>
                          setProduct({ ...product, price: e.target.value })
                        }
                        className="bg-transparent text-[104px] font-light tracking-tighter outline-none text-center text-black min-w-0 placeholder:text-zinc-100"
                        style={{
                          width: `${(product.price?.toString().length || 4) * 60}px`,
                        }}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="h-px w-32 bg-zinc-100 mt-4"></div>
                  </div>
                </div>

                {/* Offered Price Tier */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-20 pt-20 border-t border-zinc-50">
                  <div className="space-y-6">
                    <Label>Offered Price</Label>
                    <div className="flex items-center gap-4 border-b border-zinc-100 h-14 pb-1 focus-within:border-black transition-all">
                      <span className="text-2xl font-light text-zinc-200 font-montserrat">
                        ৳
                      </span>
                      <input
                        type="text"
                        value={product.salePrice}
                        onChange={(e) =>
                          setProduct({ ...product, salePrice: e.target.value })
                        }
                        className="w-full bg-transparent text-2xl font-light outline-none text-black placeholder:text-zinc-100"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <Label>Offer Commencement</Label>
                    <div className="border-b border-zinc-100 h-14 pb-1 focus-within:border-black transition-all flex items-center">
                      <input
                        type="date"
                        className="w-full bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none text-zinc-900/40 focus:text-black transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <Label>Offer Termination</Label>
                    <div className="border-b border-zinc-100 h-14 pb-1 focus-within:border-black transition-all flex items-center">
                      <input
                        type="date"
                        className="w-full bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none text-zinc-900/40 focus:text-black transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-16 bg-white border border-zinc-100 grid grid-cols-2 gap-20">
              <div className="space-y-4">
                <Label>Registry SKID</Label>
                <input
                  value={product.sku}
                  onChange={(e) =>
                    setProduct({ ...product, sku: e.target.value })
                  }
                  className="bg-transparent text-[11px] font-bold tracking-widest uppercase outline-none w-full border-b border-zinc-200 focus:border-black text-zinc-900 py-3 pb-1 transition-all"
                  placeholder="XR-202X-MIN-00"
                />
              </div>
              <div className="space-y-4">
                <Label>Tax Calculation %</Label>
                <input
                  value={product.tax}
                  onChange={(e) =>
                    setProduct({ ...product, tax: e.target.value })
                  }
                  className="bg-transparent text-[11px] font-bold tracking-widest uppercase outline-none w-full border-b border-zinc-200 focus:border-black text-zinc-900 py-3 pb-1 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="md:col-span-4 p-16 bg-zinc-50 border border-zinc-100 flex flex-col justify-center items-center text-center space-y-4">
              <Label>
                <span className="text-zinc-400">Stock Available</span>
              </Label>
              <input
                value={product.inventory}
                onChange={(e) =>
                  setProduct({ ...product, inventory: e.target.value })
                }
                className="bg-transparent text-5xl font-light text-black outline-none w-full text-center placeholder:text-zinc-200"
                placeholder="0"
              />
              <div className="h-0.5 w-12 bg-zinc-200"></div>
            </div>
          </div>
        </section>

        {/* Global Exit Action */}
        <section className="pt-32 border-t border-zinc-50 flex justify-end items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 px-8 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400 border-zinc-200 hover:text-black hover:border-black transition-colors rounded-none"
          >
            Discard Changes
          </Button>
          <Button
            className="h-12 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none transition-all hover:bg-zinc-800"
            onClick={() => console.log("Product Audit:", product)}
          >
            Post to Registry
          </Button>
        </section>
      </div>
    </div>
  );
}
