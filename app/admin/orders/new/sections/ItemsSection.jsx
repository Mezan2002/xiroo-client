"use client";
import { useProducts } from "@/hooks/api/useProducts";
import { Loader2, Package, Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SectionHeader = ({ label, title, action }) => (
  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-12">
    <div className="space-y-2">
      <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
        {label}
      </h2>
      <p className="text-2xl font-light text-black tracking-tight">{title}</p>
    </div>
    {action}
  </div>
);

const ProductSearchDropdown = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const { useSearchProducts, useAllProducts } = useProducts();
  const { data: searchResponse, isLoading: isSearchLoading } =
    useSearchProducts(query);
  const { data: allResponse, isLoading: isAllLoading } = useAllProducts({
    limit: 12,
  });

  const resolveProducts = (resp) => {
    const d = resp?.data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    return [];
  };
  const products = query
    ? resolveProducts(searchResponse)
    : resolveProducts(allResponse);
  const isLoading = query ? isSearchLoading : isAllLoading;

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 w-full min-w-[400px] bg-white border border-black shadow-2xl z-[100] mt-2 animate-in slide-in-from-top-2 duration-200"
    >
      <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
        <Search size={14} className="text-zinc-400" />
        <input
          autoFocus
          placeholder="Type product name or SKU..."
          className="flex-1 bg-transparent outline-none text-[13px] font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isLoading && (
          <Loader2 size={14} className="animate-spin text-zinc-400" />
        )}
      </div>
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {products.length > 0 ? (
          products.map((p) => (
            <button
              key={p._id}
              onClick={() => onSelect(p)}
              className="w-full p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors text-left group border-b border-zinc-50 last:border-0"
            >
              <div className="w-10 h-10 relative bg-zinc-100 shrink-0">
                {p.images?.[0] && (
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-black truncate">
                  {p.title}
                </p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {p.sku}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold text-black">
                  ৳{p.salePrice || p.price}
                </p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                  {p.inventory} in stock
                </p>
              </div>
            </button>
          ))
        ) : query ? (
          <div className="p-12 text-center text-zinc-400 italic text-[12px]">
            No products found for &quot;{query}&quot;
          </div>
        ) : (
          <div className="p-12 text-center text-zinc-400 italic text-[12px]">
            Start typing to search...
          </div>
        )}
      </div>
    </div>
  );
};

const getVariantCombinations = (attributeGroups, selectedVariants) => {
  const selectedArrays = attributeGroups
    .map((group) => {
      const vals = selectedVariants[group.name];
      if (!vals || vals.length === 0) return [null];
      return vals;
    })
    .filter((arr) => arr.length > 0);

  if (selectedArrays.length === 0) return [];

  return selectedArrays.reduce(
    (acc, curr) =>
      acc.flatMap((combo) =>
        curr.map((val) => (combo ? `${combo} / ${val}` : val))
      ),
    [""]
  );
};

const ProductBundleCard = ({
  product,
  attributeGroups,
  bundleItems,
  onAdd,
  onRemove,
}) => {
  const [selectedVariants, setSelectedVariants] = useState({});

  const toggleVariant = (groupName, value) => {
    setSelectedVariants((prev) => {
      const current = prev[groupName] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [groupName]: next };
    });
  };

  const combinations = getVariantCombinations(attributeGroups, selectedVariants);
  const hasVariants = attributeGroups.length > 0;
  const hasSelections = combinations.length > 0;

  const totalQuantityInBundle = bundleItems
    .filter((i) => i.product._id === product._id)
    .reduce((sum, i) => sum + i.quantity, 0);

  const getComboQuantity = (variantStr) =>
    bundleItems.find(
      (i) => i.product._id === product._id && i.variant === variantStr
    )?.quantity || 0;

  const handleAddAll = () => {
    if (!hasSelections) return;
    combinations.forEach((combo) => onAdd(product, combo));
  };

  return (
    <div className="bg-white p-4 border border-zinc-100 flex flex-col gap-3">
      <div className="aspect-square bg-zinc-50 relative">
        {product.images?.[0] && (
          <Image src={product.images[0]} alt="" fill className="object-cover" />
        )}
        {totalQuantityInBundle > 0 && (
          <div className="absolute top-2 right-2 z-10 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
            {totalQuantityInBundle}
          </div>
        )}
      </div>
      <div>
        <p className="text-[13px] font-bold text-black line-clamp-1">
          {product.title}
        </p>
        <p className="text-[11px] text-zinc-400 font-medium">
          ৳{product.salePrice || product.price}
        </p>
      </div>
      {attributeGroups.map((group) => (
        <div key={group.name}>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
            {group.name}
            {(selectedVariants[group.name] || []).length === 0 && (
              <span className="text-red-400 ml-1">Required</span>
            )}
          </p>
          <div className="flex flex-wrap gap-1">
            {group.values.map((val) => {
              const isSelected = (
                selectedVariants[group.name] || []
              ).includes(val.value);
              return (
                <button
                  key={val.value}
                  onClick={() => toggleVariant(group.name, val.value)}
                  className={`px-2 py-1 text-[10px] font-bold border transition-all ${
                    isSelected
                      ? "bg-black text-white border-black"
                      : "border-zinc-200 text-zinc-500 hover:border-black"
                  }`}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {hasSelections && (
        <div className="flex flex-col gap-1">
          {combinations.map((combo) => {
            const qty = getComboQuantity(combo);
            return (
              <div
                key={combo}
                className="flex items-center justify-between bg-zinc-50 border border-zinc-100 px-2 py-1.5"
              >
                <span className="text-[10px] font-bold text-black">
                  {combo}
                </span>
                {qty === 0 ? (
                  <button
                    onClick={() => onAdd(product, combo)}
                    className="text-[9px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRemove(product, combo)}
                      className="w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 hover:border-black transition-colors text-[10px]"
                    >
                      -
                    </button>
                    <span className="text-[11px] font-bold text-black w-4 text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => onAdd(product, combo)}
                      className="w-5 h-5 flex items-center justify-center bg-white border border-zinc-200 hover:border-black transition-colors text-[10px]"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {totalQuantityInBundle === 0 ? (
        <button
          onClick={handleAddAll}
          disabled={!hasSelections}
          className={`w-full h-8 text-[11px] font-bold uppercase tracking-widest transition-colors ${
            hasSelections
              ? "bg-black text-white hover:bg-zinc-800"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          }`}
        >
          {hasVariants && !hasSelections ? "Select Variants" : "Add"}
        </button>
      ) : (
        <div className="flex items-center justify-between h-8 bg-zinc-100 px-2">
          <button
            onClick={() => {
              const lastCombo = combinations.find(
                (c) => getComboQuantity(c) > 0
              );
              if (lastCombo) onRemove(product, lastCombo);
            }}
            className="w-6 h-6 flex items-center justify-center bg-white hover:bg-zinc-200 transition-colors"
          >
            -
          </button>
          <span className="text-[12px] font-bold">{totalQuantityInBundle}</span>
          <button
            onClick={handleAddAll}
            className="w-6 h-6 flex items-center justify-center bg-white hover:bg-zinc-200 transition-colors"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

const BundleCreatorModal = ({ onClose, onConfirm }) => {
  const { useAllProducts } = useProducts();
  const { data: productsData, isLoading } = useAllProducts({ limit: 1000 });
  const allProducts = (() => {
    const d = productsData?.data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    return [];
  })();

  const [bundleItems, setBundleItems] = useState([]);
  const [search, setSearch] = useState("");

  const handleAddProduct = (product, variantName) => {
    setBundleItems((prev) => {
      const existing = prev.find(
        (i) => i.product._id === product._id && i.variant === variantName,
      );
      if (existing) {
        return prev.map((i) =>
          i.product._id === product._id && i.variant === variantName
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        { product, variant: variantName || "Standard", quantity: 1 },
      ];
    });
  };

  const handleRemoveProduct = (product, variantName) => {
    setBundleItems((prev) => {
      const existing = prev.find(
        (i) => i.product._id === product._id && i.variant === variantName,
      );
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.product._id === product._id && i.variant === variantName
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        );
      }
      return prev.filter(
        (i) => !(i.product._id === product._id && i.variant === variantName),
      );
    });
  };

  const totalBundleQuantity = bundleItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const filteredProducts = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-black tracking-tight">
              Create Bundle
            </h2>
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">
              Select products &amp; attributes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors text-black rounded-full font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-4 border-b border-zinc-50">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-50 p-3 text-sm outline-none focus:ring-1 focus:ring-black transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <ProductBundleCard
                  key={product._id}
                  product={product}
                  attributeGroups={product.variants || []}
                  bundleItems={bundleItems}
                  onAdd={handleAddProduct}
                  onRemove={handleRemoveProduct}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Selected:{" "}
              <span className="text-black text-[14px]">
                {totalBundleQuantity}
              </span>{" "}
              items
            </div>
            {totalBundleQuantity >= 2 && (
              <span className="text-[10px] bg-black text-white px-2 py-1 uppercase tracking-widest font-bold">
                10% Off
              </span>
            )}
            {totalBundleQuantity >= 3 && (
              <span className="text-[10px] bg-black text-white px-2 py-1 uppercase tracking-widest font-bold">
                Free Ship
              </span>
            )}
          </div>
          <button
            disabled={totalBundleQuantity === 0}
            onClick={() => onConfirm(bundleItems)}
            className="h-10 px-8 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Confirm Bundle
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ItemsSection({
  items,
  addItem,
  removeItem,
  updateItem,
  subtotal,
  shippingFee,
  total,
  setOrder,
  metrics,
}) {
  const [activeSearchId, setActiveSearchId] = useState(null);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);

  const { useAllProducts } = useProducts();
  const { data: productsData } = useAllProducts({ limit: 1000 });
  const allProducts = (() => {
    const d = productsData?.data;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.data)) return d.data;
    return [];
  })();

  const handleProductSelect = (id, product) => {
    updateItem(id, "product", product._id);
    updateItem(id, "name", product.title);
    updateItem(id, "price", product.salePrice || product.price);
    updateItem(
      id,
      "variant",
      product.variants?.[0]?.values?.[0]?.value || "Standard",
    );
    updateItem(id, "image", product.images?.[0] || "");
    setActiveSearchId(null);
  };

  const handleBundleConfirm = (bundleItems) => {
    const bundleId = `bundle_${Date.now()}`;
    bundleItems.forEach((item) => {
      addItem(item.product, bundleId, item.variant, item.quantity);
    });
    setIsBundleModalOpen(false);
  };

  return (
    <section>
      <SectionHeader
        label="Block 02"
        title="Order Registry"
        action={
          <div className="flex gap-4">
            <button
              onClick={() => setIsBundleModalOpen(true)}
              className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest flex items-center gap-2"
            >
              <Package size={14} /> Create Bundle
            </button>
            <button
              onClick={() => addItem()}
              className="text-[11px] font-bold text-zinc-400 hover:text-black uppercase tracking-widest flex items-center gap-2"
            >
              <Plus size={14} /> Add Manual Item
            </button>
          </div>
        }
      />
      {items.length === 0 ? (
        <div className="bg-zinc-50 border border-zinc-100 p-20 text-center group hover:border-black transition-colors cursor-pointer flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsBundleModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              <Package size={14} /> Create Bundle
            </button>
            <button
              onClick={() => addItem()}
              className="flex items-center gap-2 px-6 py-3 border border-zinc-200 text-black text-[11px] font-bold uppercase tracking-widest hover:border-black transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <table className="w-full text-left">
            <thead className="border-b border-zinc-100">
              <tr>
                <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Item Narrative
                </th>
                <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                  Qty
                </th>
                <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                  Unit Price
                </th>
                <th className="pb-6 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                  Total
                </th>
                <th className="pb-6 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {items.map((item) => (
                <tr key={item.id} className="group relative">
                  <td className="py-6 pr-6">
                    <div className="relative flex items-center gap-4">
                      {item.bundleId && (
                        <div
                          className="w-5 h-5 flex items-center justify-center bg-black text-white text-[9px] font-bold shrink-0 absolute -top-2 -left-2 z-10 rounded-full"
                          title="Bundle Item"
                        >
                          B
                        </div>
                      )}
                      <div className="w-12 h-12 relative bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center overflow-hidden">
                        {(item.image || allProducts.find(p => p._id === item.product)?.images?.[0]) ? (
                          <Image 
                            src={item.image || allProducts.find(p => p._id === item.product)?.images?.[0]} 
                            alt="" 
                            fill 
                            className="object-cover" 
                          />
                        ) : (
                          <Package size={18} className="text-zinc-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <input
                            readOnly
                            value={item.name}
                            placeholder="Search product..."
                            onClick={() => setActiveSearchId(item.id)}
                            className="bg-transparent border-b border-zinc-100 focus:border-black outline-none w-full text-[14px] font-medium py-1 cursor-pointer truncate"
                          />
                          <button
                            onClick={() => setActiveSearchId(item.id)}
                            className="text-zinc-300 hover:text-black transition-colors shrink-0"
                          >
                            <Search size={14} />
                          </button>
                        </div>
                        {item.variant && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-50 border border-zinc-100 px-2 py-0.5">
                              Variant: {item.variant}
                            </span>
                          </div>
                        )}
                        {activeSearchId === item.id && (
                          <ProductSearchDropdown
                            onSelect={(p) => handleProductSelect(item.id, p)}
                            onClose={() => setActiveSearchId(null)}
                          />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="w-16 bg-zinc-50 border-b border-zinc-200 text-center text-[13px] font-bold py-1 outline-none"
                    />
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <input
                        placeholder="0.00"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className={`w-24 bg-transparent border-b text-right text-[13px] font-medium py-1 outline-none ${
                          item.originalPrice && item.price !== item.originalPrice
                            ? "border-amber-300 text-amber-600"
                            : "border-zinc-100"
                        }`}
                      />
                      {item.originalPrice && item.price !== item.originalPrice && (
                        <span className="text-[9px] font-medium text-zinc-400 line-through">
                          orig: ৳{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 pl-6 text-right text-[14px] font-bold text-black">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                  <td className="py-6 pl-6 text-right">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col items-end gap-6 pt-12 border-t border-zinc-100">
            <div className="w-full max-w-[300px] space-y-4">
              <div className="flex justify-between items-center opacity-60">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  Raw Subtotal
                </span>
                <span className="text-[14px] font-bold text-black">
                  ৳{metrics?.rawSubtotal?.toLocaleString() || 0}
                </span>
              </div>
              {metrics?.autoBundleDiscountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    Bundle Discount
                  </span>
                  <span className="text-[14px] font-bold">
                    -৳{metrics.autoBundleDiscountAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  Shipping Fee
                </span>
                {metrics?.isBundleFreeShipping ? (
                  <span className="text-[13px] font-bold text-green-600">
                    Free
                  </span>
                ) : (
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) =>
                      setOrder((prev) => ({
                        ...prev,
                        shippingFee: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-20 bg-zinc-50 border-b border-zinc-200 text-right text-[13px] font-bold py-1 outline-none"
                  />
                )}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                <span className="text-[12px] font-black text-black uppercase tracking-widest">
                  Total Registry
                </span>
                <span className="text-2xl font-light text-black">
                  ৳{total.toLocaleString()}
                </span>
              </div>
              {items.some(item => item.originalPrice && item.price !== item.originalPrice) && (
                <div className="flex items-center gap-2 pt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                    Admin Price Override Active
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isBundleModalOpen && (
        <BundleCreatorModal
          onClose={() => setIsBundleModalOpen(false)}
          onConfirm={handleBundleConfirm}
        />
      )}
    </section>
  );
}
