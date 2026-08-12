"use client";

import axiosInstance from "@/lib/axios";
import { AlertTriangle, Check, ChevronRight, Package, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────
   Inline compact variant radio-button picker
───────────────────────────────────────────── */
function VariantPicker({ variants, selectedVariants, onChange }) {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="space-y-4 mt-3 pt-3 border-t border-gray-100">
      {variants.map((variant) => (
        <div key={variant.name}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">
            {variant.name}{" "}
            {!selectedVariants[variant.name] && (
              <span className="text-red-400 animate-pulse">· required</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {variant.values.map((vObj) => {
              const val = typeof vObj === "string" ? vObj : vObj.value;
              const vPrice = typeof vObj === "string" ? null : vObj.price;
              const vQty = typeof vObj === "string" ? null : vObj.quantity;
              const isSelected = selectedVariants[variant.name] === val;
              const isOos = vQty !== null && vQty !== undefined && vQty <= 0;

              return (
                <button
                  key={val}
                  type="button"
                  disabled={isOos}
                  onClick={() => onChange(variant.name, val)}
                  className={`min-w-[80px] px-3 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all flex flex-col items-center gap-0.5 ${
                    isOos
                      ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      : isSelected
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <span>{val}</span>
                  {vPrice > 0 && (
                    <span
                      className={`text-[8px] ${
                        isSelected ? "text-white/60" : "text-zinc-400"
                      }`}
                    >
                      ৳{vPrice}
                    </span>
                  )}
                  {isOos && (
                    <span className="text-[7px] text-red-300">Out of stock</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Product picker modal — browsing all products
───────────────────────────────────────────── */
function ProductPickerModal({ onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/products", {
          params: { searchTerm: search || undefined, limit: 30 },
        });
        const data = res.data?.data || res.data || [];
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-6 duration-300 sm:rounded-none shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-widest">
            Choose Replacement Product
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-[12px] focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Products list */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {isLoading ? (
            <div className="py-10 text-center">
              <p className="text-[11px] text-gray-400 animate-pulse">Loading products…</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center">
              <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-[11px] text-gray-400">No products found</p>
            </div>
          ) : (
            products.map((product) => (
              <button
                key={product._id}
                type="button"
                onClick={() => onSelect(product)}
                className="w-full flex items-center gap-3 p-3 border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-all text-left group"
              >
                {product.images?.[0] ? (
                  <div className="w-12 h-12 flex-shrink-0 relative overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    ৳{(product.salePrice || product.price)?.toLocaleString()}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Single exchange item card
───────────────────────────────────────────── */
function ExchangeItemCard({ orderItem, exchangeData, onChange, onRemove }) {
  const [showProductPicker, setShowProductPicker] = useState(false);

  const product = orderItem.product;
  const wantSame = exchangeData.wantSameProduct;
  const replacementProduct = exchangeData.replacementProduct; // full product doc
  const selectedVariants = exchangeData.selectedVariants || {};

  // Price difference calculation
  const originalPrice = orderItem.price || 0;
  const replacementPrice =
    replacementProduct
      ? (replacementProduct.salePrice || replacementProduct.price || 0)
      : 0;
  const priceDiff = replacementPrice - originalPrice;
  const hasPriceDiff = wantSame === false && replacementProduct && priceDiff > 0;

  const handleSameOrDifferent = (same) => {
    onChange({
      ...exchangeData,
      wantSameProduct: same,
      replacementProduct: same ? product : null,
      selectedVariants: {},
    });
  };

  const handleProductPick = (picked) => {
    onChange({
      ...exchangeData,
      replacementProduct: picked,
      selectedVariants: {},
    });
    setShowProductPicker(false);
  };

  const handleVariantChange = (name, val) => {
    onChange({
      ...exchangeData,
      selectedVariants: { ...selectedVariants, [name]: val },
    });
  };

  // The product whose variants we show
  const displayProduct =
    wantSame === true
      ? product
      : wantSame === false
      ? replacementProduct
      : null;

  return (
    <>
      <div className="border border-black bg-white">
        {/* Item header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {product?.images?.[0] ? (
                <div className="w-10 h-10 relative overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div>
                <p className="text-[12px] font-bold text-gray-900">
                  {product?.title || "Product"}
                </p>
                {orderItem.variant && (
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
                    {orderItem.variant}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Qty: {orderItem.quantity} · ৳
                  {orderItem.price?.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-300 hover:text-black transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step: same or different? */}
        <div className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3">
            What would you like instead?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleSameOrDifferent(true)}
              className={`py-3 px-3 border text-left transition-all ${
                wantSame === true
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center ${
                  wantSame === true
                    ? "border-white"
                    : "border-gray-300"
                }`}
              >
                {wantSame === true && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                Same Product
              </p>
              <p
                className={`text-[9px] mt-1 ${
                  wantSame === true ? "text-white/60" : "text-gray-400"
                }`}
              >
                Different size/color
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSameOrDifferent(false)}
              className={`py-3 px-3 border text-left transition-all ${
                wantSame === false
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center ${
                  wantSame === false
                    ? "border-white"
                    : "border-gray-300"
                }`}
              >
                {wantSame === false && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                Different Product
              </p>
              <p
                className={`text-[9px] mt-1 ${
                  wantSame === false ? "text-white/60" : "text-gray-400"
                }`}
              >
                Pick from catalog
              </p>
            </button>
          </div>

          {/* Different product: picker trigger */}
          {wantSame === false && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowProductPicker(true)}
                className={`w-full flex items-center gap-3 p-3 border transition-all text-left ${
                  replacementProduct
                    ? "border-black bg-gray-50"
                    : "border-dashed border-gray-300 hover:border-gray-400"
                }`}
              >
                {replacementProduct?.images?.[0] ? (
                  <div className="w-8 h-8 relative overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={replacementProduct.images[0]}
                      alt={replacementProduct.title}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-gray-300" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {replacementProduct ? (
                    <>
                      <p className="text-[11px] font-bold text-gray-900 truncate">
                        {replacementProduct.title}
                      </p>
                      <p className="text-[9px] text-gray-400">
                        ৳
                        {(
                          replacementProduct.salePrice ||
                          replacementProduct.price
                        )?.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="text-[11px] text-gray-400">
                      Tap to browse products
                    </p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>
            </div>
          )}

          {/* Variant picker for chosen product */}
          {displayProduct?.variants?.length > 0 && (
            <VariantPicker
              variants={displayProduct.variants}
              selectedVariants={selectedVariants}
              onChange={handleVariantChange}
            />
          )}

          {/* No variants notice */}
          {displayProduct && displayProduct.variants?.length === 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <p className="text-[10px] text-emerald-700">
                  No variant selection needed for this product
                </p>
              </div>
            </div>
          )}

          {/* Price difference notice */}
          {hasPriceDiff && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <div className="p-3 bg-amber-50 border border-amber-300 flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-amber-800 mb-1">
                    Price Difference Notice
                  </p>
                  <p className="text-[10px] text-amber-700 leading-relaxed mb-2">
                    The replacement product (৳{replacementPrice.toLocaleString()}) costs{" "}
                    <strong>৳{priceDiff.toLocaleString()} more</strong> than your original
                    item (৳{originalPrice.toLocaleString()}). You will be required to pay the
                    following extra charges:
                  </p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span className="text-[10px] text-amber-700">
                        <strong>Price difference:</strong>{" "}
                        ৳{priceDiff.toLocaleString()} (replacement vs. original product)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span className="text-[10px] text-amber-700">
                        <strong>Delivery charge:</strong>{" "}
                        approx. ৳100 – ৳170 (exact amount confirmed by admin)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <span className="text-[10px] text-amber-700">
                        <strong>Exchange processing fee:</strong>{" "}
                        will be confirmed by our team after review
                      </span>
                    </li>
                  </ul>
                  <p className="text-[9px] text-amber-600 mt-2 italic">
                    Our team will contact you with the final payable amount before processing.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProductPicker && (
        <ProductPickerModal
          onSelect={handleProductPick}
          onClose={() => setShowProductPicker(false)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main ExchangeItemSelector
───────────────────────────────────────────── */
export default function ExchangeItemSelector({
  orderItems,
  exchangeSelections,
  onExchangeSelectionsChange,
}) {
  const toggleItem = (orderItem) => {
    const key = `${orderItem.product._id}_${orderItem.variant || ""}`;
    const exists = exchangeSelections.find((s) => s.key === key);

    if (exists) {
      onExchangeSelectionsChange(
        exchangeSelections.filter((s) => s.key !== key)
      );
    } else {
      onExchangeSelectionsChange([
        ...exchangeSelections,
        {
          key,
          orderItem,
          wantSameProduct: undefined,
          replacementProduct: null,
          selectedVariants: {},
          originalQuantity: orderItem.quantity,
          replacementQuantity: orderItem.quantity,
        },
      ]);
    }
  };

  const updateSelection = (key, data) => {
    onExchangeSelectionsChange(
      exchangeSelections.map((s) => (s.key === key ? { ...s, ...data } : s))
    );
  };

  const removeSelection = (key) => {
    onExchangeSelectionsChange(exchangeSelections.filter((s) => s.key !== key));
  };

  const isSelected = (orderItem) => {
    const key = `${orderItem.product._id}_${orderItem.variant || ""}`;
    return exchangeSelections.some((s) => s.key === key);
  };

  const getSelection = (orderItem) => {
    const key = `${orderItem.product._id}_${orderItem.variant || ""}`;
    return exchangeSelections.find((s) => s.key === key);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Select items to exchange
        </p>
        <p className="text-[10px] text-gray-400">
          Click items you want to exchange, then configure each one
        </p>
      </div>

      {/* Un-selected items */}
      <div className="space-y-2">
        {orderItems.map((item, idx) => {
          const selected = isSelected(item);
          if (selected) return null;
          const product = item.product;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => toggleItem(item)}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 bg-white hover:border-gray-400 transition-all text-left"
            >
              <div className="w-5 h-5 border border-gray-300 flex-shrink-0 flex items-center justify-center">
              </div>

              {product?.images?.[0] ? (
                <div className="w-10 h-10 relative overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-300" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-gray-900">
                  {product?.title || "Product"}
                </p>
                {item.variant && (
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
                    {item.variant}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Qty: {item.quantity} · ৳{item.price?.toLocaleString()}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected + configured items */}
      {exchangeSelections.length > 0 && (
        <div className="space-y-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Configuring exchange for:
          </p>
          {exchangeSelections.map((sel) => (
            <ExchangeItemCard
              key={sel.key}
              orderItem={sel.orderItem}
              exchangeData={sel}
              onChange={(data) => updateSelection(sel.key, data)}
              onRemove={() => removeSelection(sel.key)}
            />
          ))}
        </div>
      )}

      {exchangeSelections.length > 0 && (
        <div className="p-4 border border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Items to exchange
            </span>
            <span className="text-[13px] font-bold">
              {exchangeSelections.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
