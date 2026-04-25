/* eslint-disable react-hooks/immutability */
"use client";
import TiptapEditor from "@/components/admin/shared/TiptapEditor";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Circle, Plus, Star, Trash2, X } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/hooks/api/useCategories";
import { useAttributes } from "@/hooks/api/useAttributes";

const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-900 uppercase block mb-3 font-montserrat tracking-[0.2em]">
    {children}
  </label>
);

const SectionHeader = ({ label, title, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-6 md:pb-8 mb-8 md:mb-12 font-montserrat gap-4">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        {label}
      </h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);

const ProductForm = forwardRef(({ initialData, onSubmit, isPending }, ref) => {
  const { toast } = useToast();
  const { useCategoryTree } = useCategories();
  const { data: categories = [] } = useCategoryTree();
  
  const { useAttributeRegistry } = useAttributes();
  const { data: attributes = [] } = useAttributeRegistry();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    inventory: "",
    sku: "",
    tax: "15",
    variants: [],
    specifications: [],
    bundles: [],
    category: "",
    subCategory: "",
    images: [],
    stockStage: "in-stock",
    isFeatured: false,
    badge: "",
  });

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        _id: initialData._id,
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        salePrice: initialData.salePrice?.toString() || "",
        saleStartDate: formatDate(initialData.saleStartDate),
        saleEndDate: formatDate(initialData.saleEndDate),
        inventory: initialData.inventory?.toString() || "",
        sku: initialData.sku || "",
        tax: initialData.tax?.toString() || "15",
        category: initialData.category?._id || initialData.category || "",
        subCategory:
          initialData.subCategory?._id || initialData.subCategory || "",
        images: initialData.images || [],
        stockStage: initialData.stockStage || "in-stock",
        isFeatured: initialData.isFeatured || false,
        badge: initialData.badge || "",
        variants:
          initialData.variants?.map((v, i) => ({
            ...v,
            id: v.id || `v-${Date.now()}-${i}`,
          })) || [],
        specifications:
          initialData.specifications?.map((g, i) => ({
            ...g,
            id: g.id || `g-${Date.now()}-${i}`,
            items:
              g.items?.map((it, j) => ({
                ...it,
                id: it.id || `it-${Date.now()}-${j}`,
              })) || [],
          })) || [],
        bundles:
          initialData.bundles?.map((b, i) => ({
            ...b,
            id: b.id || `b-${Date.now()}-${i}`,
          })) || [],
      });
    }
  }, [initialData]);

  useImperativeHandle(ref, () => ({
    handleSave: () => {
      validateAndSave();
    },
  }));


  const selectedCategoryData = useMemo(() => {
    const cid = product.subCategory || product.category;
    return categories.find((c) => c._id === cid);
  }, [categories, product.category, product.subCategory]);

  const suggestedAttributes = useMemo(() => {
    if (!selectedCategoryData?.allowedAttributes) return [];
    return attributes.filter((attr) =>
      selectedCategoryData.allowedAttributes.includes(attr._id),
    );
  }, [attributes, selectedCategoryData]);

  const rootCategories = useMemo(
    () =>
      categories
        .filter((c) => !c.parentId)
        .map((c) => ({
          value: c._id,
          label: c.name,
        })),
    [categories],
  );

  const subCategoryOptions = useMemo(() => {
    if (!product.category) return [];
    return categories
      .filter((c) => c.parentId && c.parentId.toString() === product.category)
      .map((c) => ({
        value: c._id,
        label: c.name,
      }));
  }, [categories, product.category]);

  const validateAndSave = () => {
    if (!product.title) return toast.error("Product Nomenclature Required.");
    if (!product.price) return toast.error("Monetary Valuation Required.");
    if (!product.category) return toast.error("Category Registry Required.");

    const payload = {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      saleStartDate: product.saleStartDate
        ? new Date(product.saleStartDate)
        : undefined,
      saleEndDate: product.saleEndDate
        ? new Date(product.saleEndDate)
        : undefined,
      inventory: Number(product.inventory || 0),
      tax: Number(product.tax || 15),
      subCategory: product.subCategory || undefined,
      stockStage: product.stockStage || "in-stock",
      isFeatured: product.isFeatured || false,
      badge: product.badge || undefined,
      variants: product.variants.map((v) => ({
        name: v.name,
        values: v.values,
      })),
      specifications: product.specifications.map((g) => ({
        group: g.group,
        items: g.items.map((i) => ({ label: i.label, value: i.value })),
      })),
      bundles: product.bundles.map((b) => ({
        ...b,
        price: Number(b.price),
        unitPrice: Number(b.unitPrice),
      })),
    };

    onSubmit(payload);
  };

  // --- Handlers: Variants ---
  const addVariant = (name = "Option", values = []) =>
    setProduct((p) => ({
      ...p,
      variants: [...p.variants, { id: Date.now(), name, values }],
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
    <div className="space-y-16 md:space-y-32 pb-24">
      {/* Identity Section */}
      <section>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-zinc-200 pb-6 md:pb-8 mb-8 md:mb-12 font-montserrat gap-6">
          <div className="space-y-2">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
              Block 01
            </h2>
            <p className="text-xl md:text-2xl font-light text-black tracking-tight">
              Product Narrative
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-8 px-4 md:px-8 py-2 bg-zinc-50 border border-zinc-100 flex-1 sm:flex-none">
              <div className="flex flex-col gap-1 min-w-fit">
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Inventory Registry</span>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tighter text-black">Target Stage</span>
              </div>
              <div className="w-full sm:w-40 md:w-48">
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
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-zinc-50 px-6 py-3 border border-zinc-100 flex-1 sm:flex-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Featured Product
              </span>
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
            <div className="flex items-center gap-4 md:gap-8 px-4 md:px-8 py-2 bg-zinc-50 border border-zinc-100 flex-1 sm:flex-none">
              <div className="flex flex-col gap-1 min-w-fit">
                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Manual Badge</span>
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tighter text-black">Display Label</span>
              </div>
              <div className="w-full sm:w-40 md:w-48">
                <input
                  type="text"
                  value={product.badge}
                  onChange={(e) => setProduct({ ...product, badge: e.target.value.toUpperCase() })}
                  className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-[11px] font-bold uppercase tracking-widest text-black py-1 placeholder:text-zinc-300"
                  placeholder="e.g. HOT, NEW"
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
        </div>

        <div className="space-y-12">
          <div className="space-y-4">
            <Label>Product Nomenclature</Label>
            <input
              type="text"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl md:text-3xl font-light placeholder:text-zinc-200 text-black py-4"
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

      {/* Classification Section */}
      <section>
        <SectionHeader label="Block 02" title="Registry Classification" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
          <div className="space-y-6">
            <Label>Main Category Registry</Label>
            <Select
              options={rootCategories}
              value={product.category}
              onChange={(val) =>
                setProduct({ ...product, category: val, subCategory: "" })
              }
              placeholder="Select Primary Root"
            />
            <p className="text-[10px] text-zinc-400 font-medium italic">
              Assign this product to a top-level architectural branch.
            </p>
          </div>
          <div className="space-y-6">
            <Label>Sub-category Mapping</Label>
            <Select
              options={subCategoryOptions}
              value={product.subCategory}
              onChange={(val) => setProduct({ ...product, subCategory: val })}
              placeholder={
                product.category
                  ? subCategoryOptions.length > 0
                    ? "Select Mapping"
                    : "No Sub-categories Available"
                  : "Select Root First"
              }
              disabled={!product.category || subCategoryOptions.length === 0}
            />
            <p className="text-[10px] text-zinc-400 font-medium italic">
              Refine the product placement within the selected branch.
            </p>
          </div>
        </div>
      </section>

      {/* Configuration Section */}
      <section>
        <SectionHeader
          label="Block 03"
          title="Design Matrix"
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
            <Label>Suggested Registry Attributes (Based on Category)</Label>
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
              No configuration variants active.
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
                      className="px-4 md:px-6 py-2 md:py-3 bg-white border border-zinc-900 text-[10px] md:text-[11px] font-bold tracking-widest uppercase flex items-center gap-3 md:gap-4 text-black shadow-lg shadow-black/5"
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

      {/* Visual Identity Section */}
      <section>
        <SectionHeader
          label="Block 04"
          title="Visual Documentation"
          action={
            <button
              onClick={() => setProduct((p) => ({ ...p, images: [] }))}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
            >
              Clear All
            </button>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <ImageUploader
            multiple={true}
            onUploadSuccess={(url) =>
              setProduct((p) => ({ ...p, images: [...p.images, url] }))
            }
            className="aspect-square bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center hover:bg-white hover:border-black transition-all group"
          >
            <Plus
              size={24}
              className="text-zinc-300 group-hover:text-black mb-2"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-black">
              Add Frame
            </span>
          </ImageUploader>

          {product.images?.map((img, idx) => {
            const isMain = idx === 0;
            return (
              <div
                key={idx}
                className={`aspect-square relative group bg-white border transition-all duration-500 overflow-hidden ${isMain ? "border-black ring-4 ring-black/5" : "border-zinc-100"}`}
              >
                <img
                  src={img}
                  alt=""
                  className={`w-full h-full object-cover transition-all duration-700 ${isMain ? "grayscale-0" : "grayscale hover:grayscale-0"}`}
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  {!isMain && (
                    <button
                      onClick={() => {
                        const newImages = [...product.images];
                        const [selected] = newImages.splice(idx, 1);
                        newImages.unshift(selected);
                        setProduct((p) => ({ ...p, images: newImages }));
                      }}
                      className="p-3 bg-white text-black hover:bg-zinc-100 transition-colors shadow-xl"
                      title="Set as Featured"
                    >
                      <Star size={18} />
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setProduct((p) => ({
                        ...p,
                        images: p.images.filter((_, i) => i !== idx),
                      }))
                    }
                    className="p-3 bg-red-500 text-white hover:bg-red-600 transition-colors shadow-xl"
                    title="Delete Frame"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {isMain && (
                  <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em]">
                    Featured
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Section */}
      <section>
        <SectionHeader
          label="Block 05"
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
          <div className="bg-zinc-50 border border-zinc-200 p-10 md:p-20 text-center">
            <p className="text-[11px] md:text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic opacity-60">
              Define metric constants for engineering verification.
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {product.specifications.map((group) => (
              <div
                key={group.id}
                className="space-y-8 md:space-y-12 border-l-2 md:border-l-4 border-zinc-900 pl-6 md:pl-12 pt-2"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-20 gap-y-6 md:gap-y-10">
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
          label="Block 06"
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
          <div className="bg-black text-white p-10 md:p-20 text-center space-y-6">
            <p className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.4em] opacity-40">
              Tiered Strategy Inactive
            </p>
            <p className="text-[12px] md:text-[13px] font-light italic opacity-70 max-w-sm mx-auto tracking-wide leading-relaxed">
              Configure bulk acquisition incentives (e.g. Duo-Pack, Family-Pack)
              to optimize conversion.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {product.bundles.map((b) => (
              <div
                key={b.id}
                className="p-6 md:p-12 border-2 border-zinc-200 bg-white space-y-8 md:space-y-12 group hover:border-black transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-8 items-center">
                    <input
                      className="text-[14px] md:text-[16px] font-bold uppercase tracking-widest outline-none bg-transparent text-black w-full"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
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
        <SectionHeader label="Block 07" title="Monetary Valuation" />
        <div className="bg-white border border-zinc-100 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Main Price Inputs */}
          <div className="md:col-span-8 p-10 md:p-14 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label>Regular Price</Label>
                <div className="flex items-center gap-4 bg-zinc-50 border-b border-zinc-200 h-16 px-6 focus-within:border-black focus-within:bg-white transition-all">
                  <span className="text-xl font-light text-zinc-400 font-montserrat">
                    ৳
                  </span>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                    className="w-full bg-transparent text-2xl font-medium outline-none text-black placeholder:text-zinc-200"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Offered Price (Active Sale)</Label>
                <div className="flex items-center gap-4 bg-zinc-50 border-b border-zinc-200 h-16 px-6 focus-within:border-black focus-within:bg-white transition-all">
                  <span className="text-xl font-light text-zinc-400 font-montserrat">
                    ৳
                  </span>
                  <input
                    type="text"
                    value={product.salePrice}
                    onChange={(e) =>
                      setProduct({ ...product, salePrice: e.target.value })
                    }
                    className="w-full bg-transparent text-2xl font-medium outline-none text-black placeholder:text-zinc-200"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-50 border border-zinc-100 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label>Offer Commencement</Label>
                  <input
                    type="date"
                    value={product.saleStartDate}
                    onChange={(e) => setProduct({ ...product, saleStartDate: e.target.value })}
                    className="w-full bg-white border border-zinc-200 h-12 px-5 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-black transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Offer Termination</Label>
                  <input
                    type="date"
                    value={product.saleEndDate}
                    onChange={(e) => setProduct({ ...product, saleEndDate: e.target.value })}
                    className="w-full bg-white border border-zinc-200 h-12 px-5 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-black transition-all"
                  />
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium italic text-center">
                Leave both dates empty to create a perpetual offer without time constraints.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-8">
              <div className="space-y-4">
                <Label>Registry SKID</Label>
                <input
                  value={product.sku}
                  onChange={(e) =>
                    setProduct({ ...product, sku: e.target.value })
                  }
                  className="w-full bg-transparent text-[11px] font-bold tracking-widest uppercase outline-none border-b border-zinc-200 focus:border-black py-3 pb-1"
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
                  className="w-full bg-transparent text-[11px] font-bold tracking-widest uppercase outline-none border-b border-zinc-200 focus:border-black py-3 pb-1"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Inventory Sidebar */}
          <div className="md:col-span-4 bg-zinc-50 p-10 md:p-14 flex flex-col justify-center items-center text-center border-l border-zinc-100 space-y-6">
            <Label className="text-zinc-400">Stock Available</Label>
            <input
              value={product.inventory}
              onChange={(e) =>
                setProduct({ ...product, inventory: e.target.value })
              }
              className="w-full bg-transparent text-6xl font-light text-black outline-none text-center placeholder:text-zinc-200"
              placeholder="0"
            />
            <div className="h-px w-12 bg-zinc-200"></div>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
              Units in Inventory
            </p>
          </div>
        </div>
      </section>

      {/* Global Exit Action */}
      <section className="pt-24 border-t border-zinc-50 flex justify-end items-center gap-4">
        <Button
          className="h-12 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-none transition-all hover:bg-zinc-800 disabled:opacity-50"
          onClick={validateAndSave}
          disabled={isPending}
        >
          {isPending ? "Syncing Registry..." : "Save Changes"}
        </Button>
      </section>
    </div>
  );
});

ProductForm.displayName = "ProductForm";

export default ProductForm;
