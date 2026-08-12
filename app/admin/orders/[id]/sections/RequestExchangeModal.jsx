"use client";
import { X, Plus, Trash2, Loader2, Upload, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { useProducts } from "@/hooks/api/useProducts";
import { useMemo, useEffect, useRef } from "react";

export default function RequestExchangeModal({
  isOpen,
  onClose,
  onConfirm,
  order,
  isEditing,
  exchangeReason,
  setExchangeReason,
  exchangeItems,
  setExchangeItems,
  exchangeAdminNote,
  setExchangeAdminNote,
  exchangeAttachments,
  setExchangeAttachments,
  exchangeFee,
  setExchangeFee,
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

  const fileRef = useRef(null);

  const extraCost = useMemo(() => {
    if (!products.length || !exchangeItems.length) return exchangeFee || 0;
    let total = 0;
    for (const item of exchangeItems) {
      if (!item.originalProduct || !item.replacementProduct) continue;
      const origProd = products.find((p) => p._id === item.originalProduct);
      const replProd = products.find((p) => p._id === item.replacementProduct);
      if (!origProd || !replProd) continue;
      const now = new Date();
      const origPrice = origProd.salePrice && (!origProd.saleEndDate || new Date(origProd.saleEndDate) > now) ? origProd.salePrice : origProd.price;
      const replPrice = replProd.salePrice && (!replProd.saleEndDate || new Date(replProd.saleEndDate) > now) ? replProd.salePrice : replProd.price;
      total += (replPrice * item.replacementQuantity) - (origPrice * item.originalQuantity);
    }
    return total + (exchangeFee || 0);
  }, [exchangeItems, products, exchangeFee]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "image",
      name: file.name,
    }));
    setExchangeAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (idx) => {
    setExchangeAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  const updateItem = (idx, updates) => {
    setExchangeItems((prev) =>
      prev.map((ei, i) => (i === idx ? { ...ei, ...updates } : ei))
    );
  };

  const getVariantGroups = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (!product?.variants?.length) return [];
    return product.variants.map((v) => ({
      name: v.name,
      values: v.values?.map((val) => (typeof val === "string" ? val : val.value)) || [],
    }));
  };

  const toggleVariant = (idx, variantName, value) => {
    const current = exchangeItems[idx]?.replacementVariant || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateItem(idx, { replacementVariant: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-zinc-100 bg-white flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-zinc-900">{isEditing ? "Edit Exchange" : "Request Exchange"}</h3>
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

                  {item.replacementProduct && getVariantGroups(item.replacementProduct).length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        Replacement Variants
                      </label>
                      {getVariantGroups(item.replacementProduct).map((group) => (
                        <div key={group.name} className="space-y-1.5">
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{group.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {group.values.map((val) => {
                              const isSelected = item.replacementVariant?.includes(val);
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => toggleVariant(idx, group.name, val)}
                                  className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                    isSelected
                                      ? "bg-black text-white border-black"
                                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"
                                  }`}
                                >
                                  {val}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Exchange / Shipping Fee (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-zinc-400 font-medium">৳</span>
              <input
                type="number"
                min="0"
                step="1"
                value={exchangeFee}
                onChange={(e) => setExchangeFee(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full pl-7 pr-4 py-2.5 border border-zinc-200 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400"
              />
            </div>
            <p className="text-[9px] text-zinc-400 mt-1">Additional fee for shipping or exchange processing</p>
          </div>

          {extraCost !== 0 && (
            <div className={`px-4 py-3 ${extraCost > 0 ? "bg-amber-50 border border-amber-200" : "bg-emerald-50 border border-emerald-200"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${extraCost > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                  {extraCost > 0 ? "Customer Pays Extra" : "Customer Gets Refund"}
                </span>
                <span className={`text-[16px] font-black font-mono ${extraCost > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                  {extraCost > 0 ? "+" : ""}৳{Math.abs(extraCost).toLocaleString()}
                </span>
              </div>
              {exchangeFee > 0 && (
                <div className="mt-2 pt-2 border-t border-dashed flex justify-between text-[10px]">
                  <span className={extraCost > 0 ? "text-amber-600" : "text-emerald-600"}>Product Difference</span>
                  <span className={`font-bold font-mono ${extraCost > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    ৳{Math.abs(extraCost - exchangeFee).toLocaleString()}
                  </span>
                </div>
              )}
              {exchangeFee > 0 && (
                <div className="flex justify-between text-[10px]">
                  <span className={extraCost > 0 ? "text-amber-600" : "text-emerald-600"}>Exchange / Shipping Fee</span>
                  <span className={`font-bold font-mono ${extraCost > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    ৳{exchangeFee.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Attachments (Optional)
            </label>
            <div className="space-y-3">
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-300 hover:border-zinc-400 text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                <Upload size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Upload Images or Videos</span>
              </button>
              {exchangeAttachments.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {exchangeAttachments.map((att, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-full aspect-square bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                        {att.type === "image" ? (
                          <img src={att.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Video size={20} className="text-zinc-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                      {att.name && (
                        <p className="text-[9px] text-zinc-400 mt-1 truncate">{att.name}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
            {isProcessing ? "Processing..." : isEditing ? "Update Exchange" : "Submit Exchange Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
