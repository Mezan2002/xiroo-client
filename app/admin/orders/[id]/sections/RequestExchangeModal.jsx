"use client";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { useProducts } from "@/hooks/api/useProducts";
import { useMemo, useEffect } from "react";

export default function RequestExchangeModal({
  isOpen,
  onClose,
  onConfirm,
  order,
  exchangeReason,
  setExchangeReason,
  exchangeItems,
  setExchangeItems,
  exchangeAdminNote,
  setExchangeAdminNote,
  isProcessing,
}) {
  const { useAllProducts } = useProducts();
  const { data: productsData } = useAllProducts({ limit: 500 });
  const products = useMemo(
    () => productsData?.data?.data || productsData?.data || [],
    [productsData]
  );

  useEffect(() => {
    if (isOpen && order?.items?.length > 0 && exchangeItems.length === 0) {
      setExchangeItems(
        order.items.map((item) => ({
          originalProduct: item.product?._id || item.product,
          originalVariant: item.variant || "",
          originalQuantity: item.quantity,
          replacementProduct: "",
          replacementVariant: [],
          replacementQuantity: 1,
        }))
      );
    }
  }, [isOpen, order]);

  if (!isOpen) return null;

  const updateItem = (idx, updates) => {
    setExchangeItems((prev) =>
      prev.map((ei, i) => (i === idx ? { ...ei, ...updates } : ei))
    );
  };

  const getVariantOptions = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product?.variants?.length) return [];
    const opts = [];
    product.variants.forEach((v) => {
      v.values?.forEach((val) => {
        opts.push({
          value: val.value,
          label: v.name ? `${v.name}: ${val.value}` : val.value,
        });
      });
    });
    return opts;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-100 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-zinc-900">Request Exchange</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Select items to exchange and their replacements</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Reason for Exchange *
            </label>
            <textarea
              value={exchangeReason}
              onChange={(e) => setExchangeReason(e.target.value)}
              placeholder="Why is this order being exchanged?"
              rows={2}
              className="w-full px-4 py-3 border border-zinc-200 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Exchange Items *
              </label>
              <button
                onClick={() =>
                  setExchangeItems((prev) => [
                    ...prev,
                    {
                      originalProduct: "",
                      originalVariant: "",
                      originalQuantity: 1,
                      replacementProduct: "",
                      replacementVariant: [],
                      replacementQuantity: 1,
                    },
                  ])
                }
                className="flex items-center gap-1 text-[10px] font-bold text-violet-600 hover:text-violet-800 uppercase tracking-wider"
              >
                <Plus size={10} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {exchangeItems.map((item, idx) => (
                <div key={idx} className="p-4 border border-zinc-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Item {idx + 1}
                    </span>
                    {exchangeItems.length > 1 && (
                      <button
                        onClick={() => setExchangeItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-zinc-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Original Product
                      </label>
                      <Select
                        value={item.originalProduct}
                        onChange={(val) => updateItem(idx, { originalProduct: val, originalVariant: "" })}
                        placeholder="Select product"
                        options={
                          order.items?.map((oi) => ({
                            value: oi.product?._id || oi.product,
                            label: `${oi.product?.title || "Unknown"}${oi.variant ? ` (${oi.variant})` : ""} x${oi.quantity}`,
                          })) || []
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Replacement Product *
                      </label>
                      <Select
                        value={item.replacementProduct}
                        onChange={(val) =>
                          updateItem(idx, { replacementProduct: val, replacementVariant: [] })
                        }
                        placeholder="Select replacement"
                        options={products.map((p) => ({
                          value: p._id,
                          label: `${p.title} - ৳${p.salePrice || p.price}`,
                        }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Original Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.originalQuantity}
                        onChange={(e) =>
                          updateItem(idx, { originalQuantity: Number(e.target.value) || 1 })
                        }
                        className="w-full px-3 py-2 border border-zinc-200 text-[11px] text-zinc-900 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Replacement Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.replacementQuantity}
                        onChange={(e) =>
                          updateItem(idx, { replacementQuantity: Number(e.target.value) || 1 })
                        }
                        className="w-full px-3 py-2 border border-zinc-200 text-[11px] text-zinc-900 focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                  </div>

                  {item.replacementProduct && getVariantOptions(item.replacementProduct).length > 0 && (
                    <div>
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                        Replacement Variants
                      </label>
                      <MultiSelect
                        value={item.replacementVariant}
                        onChange={(val) => updateItem(idx, { replacementVariant: val })}
                        placeholder="Select variants"
                        options={getVariantOptions(item.replacementProduct)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Admin Note (Optional)
            </label>
            <textarea
              value={exchangeAdminNote}
              onChange={(e) => setExchangeAdminNote(e.target.value)}
              placeholder="Internal note about this exchange..."
              rows={2}
              className="w-full px-4 py-3 border border-zinc-200 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 px-6 py-4 border-t border-zinc-100 bg-white flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!exchangeReason.trim() || exchangeItems.length === 0 || isProcessing}
            className="px-4 py-2 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? <Loader2 size={10} className="animate-spin" /> : null}
            {isProcessing ? "Processing..." : "Submit Exchange Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
