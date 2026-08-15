"use client";
import { useState, useEffect } from "react";
import { X, Package, CheckCircle2, Pencil } from "lucide-react";
import Image from "next/image";

export default function PartialDeliveryModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  isProcessing,
  currentShippingFee = 0,
}) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [editedPrices, setEditedPrices] = useState({});
  const [shippingFee, setShippingFee] = useState(currentShippingFee);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndices([]);
      setEditedPrices({});
      setShippingFee(currentShippingFee);
    }
  }, [isOpen, currentShippingFee]);

  const toggleItem = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const selectAll = () => {
    if (selectedIndices.length === items.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(items.map((_, i) => i));
    }
  };

  const getItemPrice = (idx) => {
    return editedPrices[idx] !== undefined ? editedPrices[idx] : items[idx].price;
  };

  const deliveredSubtotal = selectedIndices.reduce(
    (sum, idx) => sum + getItemPrice(idx) * items[idx].quantity,
    0
  );

  const deliveredTotal = deliveredSubtotal + (Number(shippingFee) || 0);

  const handlePriceChange = (idx, value) => {
    const num = parseFloat(value);
    setEditedPrices((prev) => ({
      ...prev,
      [idx]: isNaN(num) ? 0 : num,
    }));
  };

  const handleConfirm = () => {
    const priceOverrides = {};
    let hasOverrides = false;
    for (const idx of selectedIndices) {
      const edited = getItemPrice(idx);
      if (edited !== items[idx].price) {
        priceOverrides[idx] = edited;
        hasOverrides = true;
      }
    }
    onConfirm(selectedIndices, {
      priceOverrides: hasOverrides ? priceOverrides : null,
      shippingFee: Number(shippingFee) || 0,
    });
    setSelectedIndices([]);
    setEditedPrices({});
  };

  const handleClose = () => {
    setSelectedIndices([]);
    setEditedPrices({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white border border-zinc-200 w-full max-w-lg shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[14px] font-bold text-zinc-900 tracking-tight">
              Partial Delivery
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Select delivered items &amp; adjust prices if needed
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Select All */}
          <button
            onClick={selectAll}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-zinc-200 hover:border-zinc-400 transition-colors text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-700"
          >
            <span>
              {selectedIndices.length === items.length
                ? "Deselect All"
                : "Select All"}
            </span>
            <span className="font-mono">
              {selectedIndices.length}/{items.length}
            </span>
          </button>

          {/* Items */}
          <div className="space-y-2">
            {items.map((item, idx) => {
              const isSelected = selectedIndices.includes(idx);
              const currentPrice = getItemPrice(idx);
              const isPriceEdited =
                editedPrices[idx] !== undefined &&
                editedPrices[idx] !== item.price;
              return (
                <div
                  key={idx}
                  className={`w-full border transition-all ${
                    isSelected
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-zinc-200 hover:border-zinc-300 bg-white"
                  }`}
                >
                  {/* Main row - clickable to toggle selection */}
                  <div
                    onClick={() => toggleItem(idx)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-zinc-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="relative w-10 h-10 bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.product?.images?.[0] ? (
                        <Image
                          fill
                          src={item.product.images[0]}
                          alt=""
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <Package
                          size={14}
                          strokeWidth={1}
                          className="text-zinc-200"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[12px] font-bold truncate ${
                          isSelected ? "text-emerald-900" : "text-zinc-900"
                        }`}
                      >
                        {item.product?.title || "Unknown"}
                      </p>
                      {item.variant && item.variant !== "Standard" && (
                        <p className="text-[10px] text-zinc-400">
                          {item.variant}
                        </p>
                      )}
                    </div>

                    {/* Qty & Static Total */}
                    <div className="text-right shrink-0">
                      <p
                        className={`text-[12px] font-bold font-mono ${
                          isSelected ? "text-emerald-700" : "text-zinc-700"
                        }`}
                      >
                        ৳{(currentPrice * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        x{item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Editable price row - only when selected */}
                  {isSelected && (
                    <div className="px-4 pb-3 flex items-center gap-2">
                      <Pencil
                        size={10}
                        className={
                          isPriceEdited ? "text-amber-500" : "text-zinc-300"
                        }
                      />
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        Unit Price
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={currentPrice}
                        onChange={(e) => {
                          e.stopPropagation();
                          handlePriceChange(idx, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`w-24 bg-transparent border-b text-right text-[12px] font-bold py-0.5 outline-none font-mono ${
                          isPriceEdited
                            ? "border-amber-300 text-amber-600"
                            : "border-zinc-200 text-zinc-900 focus:border-black"
                        }`}
                      />
                      {isPriceEdited && (
                        <span className="text-[9px] text-zinc-400 line-through font-mono">
                          ৳{item.price}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Shipping Fee */}
          {selectedIndices.length > 0 && (
            <div className="px-4 py-3 bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  Delivery Fee
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-zinc-400 font-mono">
                    ৳
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    className="w-20 bg-transparent border-b border-zinc-200 text-right text-[12px] font-bold text-zinc-900 py-0.5 outline-none font-mono focus:border-black"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 space-y-3 shrink-0">
          {/* Summary */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 font-medium">Items Subtotal</span>
              <span className="text-zinc-700 font-bold font-mono">
                ৳{deliveredSubtotal.toLocaleString()}
              </span>
            </div>
            {Number(shippingFee) > 0 && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-medium">Shipping</span>
                <span className="text-zinc-700 font-bold font-mono">
                  ৳{Number(shippingFee).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-[12px] pt-1.5 border-t border-zinc-200">
              <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
                {selectedIndices.length} of {items.length} items
              </span>
              <span className="font-black text-zinc-900 font-mono">
                ৳{deliveredTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing || selectedIndices.length === 0}
              className="flex-1 px-4 py-2.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
            >
              {isProcessing ? "Processing..." : "Confirm Partial Delivery"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
