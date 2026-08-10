"use client";

import { X, Package, Check } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

export default function BundleSuggestionModal({ items, onAccept, onDecline }) {
  const [isOpen, setIsOpen] = useState(false);

  const eligibleItems = useMemo(() => {
    return items.filter(
      (item) =>
        !item.bundleId && item.category?.bundleOfferEnabled !== false
    );
  }, [items]);

  const totalEligibleQuantity = useMemo(
    () => eligibleItems.reduce((sum, item) => sum + item.quantity, 0),
    [eligibleItems]
  );

  const subtotal = useMemo(() => {
    return eligibleItems.reduce((sum, item) => {
      const price =
        item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
      const numericPrice = parseFloat(
        price?.toString().replace(/[^0-9.]/g, "") || 0
      );
      return sum + numericPrice * item.quantity;
    }, 0);
  }, [eligibleItems]);

  const discountUnlocked = totalEligibleQuantity >= 2;
  const freeShippingUnlocked = totalEligibleQuantity >= 3;
  const discountPercentage = 10;

  const discountedTotal = discountUnlocked
    ? subtotal * (1 - discountPercentage / 100)
    : subtotal;

  const savings = subtotal - discountedTotal;

  useEffect(() => {
    if (totalEligibleQuantity >= 2 && !isOpen) {
      const dismissed = sessionStorage.getItem("bundle_suggestion_dismissed");
      if (!dismissed) {
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [totalEligibleQuantity]);

  if (!isOpen || totalEligibleQuantity < 2) return null;

  const handleAccept = () => {
    setIsOpen(false);
    onAccept(eligibleItems);
  };

  const handleDecline = () => {
    setIsOpen(false);
    sessionStorage.setItem("bundle_suggestion_dismissed", "true");
    onDecline();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDecline}
      />

      <div className="relative w-full sm:max-w-lg bg-white sm:mx-4 overflow-hidden animate-in slide-in-from-bottom duration-300 sm:animate-in sm:fade-in sm:zoom-in-95 sm:duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Package size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black">
                Create a Bundle & Save!
              </h3>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                {totalEligibleQuantity} eligible items in your cart ({eligibleItems.length} {eligibleItems.length === 1 ? 'product' : 'products'})
              </p>
            </div>
          </div>
          <button
            onClick={handleDecline}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items List */}
        <div className="px-5 py-4 max-h-[30vh] overflow-y-auto space-y-3">
          {eligibleItems.map((item, index) => {
            const price =
              item.salePrice && item.salePrice > 0
                ? item.salePrice
                : item.price;
            return (
              <div
                key={`${item._id || item.id}-${item.variant}-${index}`}
                className="flex items-center gap-3"
              >
                <div className="relative w-12 h-12 bg-gray-100 overflow-hidden flex-shrink-0">
                  {(item.image || item.images?.[0]) && (
                    <Image
                      src={item.image || item.images?.[0]}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-black truncate">
                    {item.title}
                  </p>
                  {item.variant && item.variant !== "Standard" && (
                    <p className="text-[10px] text-gray-400">{item.variant}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[12px] font-bold text-black">
                    ×{item.quantity}
                  </p>
                  <p className="text-[10px] text-gray-400">৳{price}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Discount Tiers */}
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                discountUnlocked
                  ? "bg-black"
                  : "border border-gray-300 bg-white"
              }`}
            >
              {discountUnlocked && <Check size={10} className="text-white" />}
            </div>
            <p
              className={`text-[11px] font-bold ${
                discountUnlocked ? "text-black" : "text-gray-400"
              }`}
            >
              Buy 2+ items → <span className="text-emerald-600">10% OFF</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                freeShippingUnlocked
                  ? "bg-black"
                  : "border border-gray-300 bg-white"
              }`}
            >
              {freeShippingUnlocked && (
                <Check size={10} className="text-white" />
              )}
            </div>
            <p
              className={`text-[11px] font-bold ${
                freeShippingUnlocked ? "text-black" : "text-gray-400"
              }`}
            >
              Buy 3+ items →{" "}
              <span className="text-emerald-600">10% OFF + Free Delivery</span>
            </p>
          </div>
        </div>

        {/* Price Comparison & Actions */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                Current Total
              </p>
              <p className="text-lg font-bold text-black">৳{subtotal}</p>
            </div>
            {discountUnlocked && (
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                  Bundle Price
                </p>
                <p className="text-lg font-bold text-emerald-600">
                  ৳{discountedTotal.toFixed(0)}
                </p>
                <p className="text-[10px] text-emerald-600 font-bold">
                  Save ৳{savings.toFixed(0)}
                  {freeShippingUnlocked && " + Free Delivery"}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleAccept}
              className="flex-1 h-11 bg-black text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              <Package size={14} />
              {discountUnlocked ? "Create Bundle & Save" : "Create Bundle"}
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 h-11 bg-white border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-[0.15em] hover:border-gray-400 hover:text-black transition-colors"
            >
              No Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
