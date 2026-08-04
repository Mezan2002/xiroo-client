"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Tag, Check } from "lucide-react";
import { Button } from "../ui/Button";

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
  discount,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  hasFreeDelivery,
}) {
  const [couponCode, setCouponCode] = useState("");

  const handleApply = () => {
    if (!couponCode.trim() || !onApplyCoupon) return;
    onApplyCoupon(couponCode.trim(), () => setCouponCode(""));
  };

  const hasDiscount = !!discount;

  return (
    <div className="bg-gray-50/50 border border-gray-100 p-5 md:p-8 lg:p-12 space-y-8 lg:space-y-10">
      <h2 className="text-[18px] lg:text-[20px] font-medium uppercase tracking-wider border-b border-gray-100 pb-6 lg:pb-8">
        Order Summary
      </h2>

      {/* Items List */}
      <div className="space-y-8">
        {items.map((item) => (
          <div
            key={`${item._id || item.id}-${item.variant}`}
            className="flex gap-4 md:gap-6"
          >
            <Link
              href={`/product/${item._id || item.id}`}
              className="relative w-20 h-20 md:w-24 md:h-24 bg-white border border-gray-100 shrink-0 group/img"
            >
              <div className="w-full h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover/img:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-black text-white text-[10px] font-medium flex items-center justify-center rounded-full z-10">
                {item.quantity}
              </span>
            </Link>
            <div className="flex flex-col justify-center min-w-0">
              <div className="line-clamp-2 mb-2">
                <Link
                  href={`/product/${item._id || item.id}`}
                  className="text-sm font-medium text-black uppercase tracking-tight hover:underline underline-offset-4 decoration-black hover:text-zinc-600 transition-colors"
                >
                  {item.title}
                </Link>
              </div>
              {item.multiItems && item.multiItems.length > 0 ? (
                <div className="flex flex-wrap gap-1 mb-1 md:mb-2">
                  {item.multiItems.map((mi, miIdx) => (
                    <span key={miIdx} className="text-[8px] md:text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-sm">
                      {Object.values(mi).join("/")}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] md:text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1 md:mb-2 line-clamp-1">
                  {item.variant}
                </p>
              )}
              <span className="text-sm font-medium text-black">
                ৳{(item.salePrice || item.price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      {onApplyCoupon && (
        <div className="pt-6 border-t border-gray-100">
          {hasDiscount ? (
            <div className="flex items-center justify-between p-3.5 bg-green-50 border border-green-200">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                  <Check className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                    {discount?.code || "COUPON"}
                  </span>
                  <span className="text-[10px] text-green-600 font-medium">
                    {discount?.type === "percentage"
                      ? `${discount.value}% off`
                      : discount?.type === "fixed"
                        ? `৳${discount.value} off`
                        : "Free shipping"}
                  </span>
                </div>
              </div>
              {onRemoveCoupon && (
                <button
                  onClick={onRemoveCoupon}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Coupon code"
                className="flex-1 h-10 px-3 bg-white border border-gray-200 focus:border-black outline-none transition-all text-[11px] font-medium uppercase tracking-wider placeholder:text-gray-300 placeholder:normal-case"
              />
              <Button
                variant="secondary"
                className="h-10 px-4 text-[10px] font-bold uppercase tracking-wider shrink-0"
                onClick={handleApply}
                disabled={isApplyingCoupon || !couponCode.trim()}
              >
                {isApplyingCoupon ? "..." : "Apply"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-4 pt-8 lg:pt-10 border-t border-gray-100">
        <div className="flex justify-between items-center text-[12px] font-medium uppercase tracking-wider text-gray-400">
          <span>Subtotal</span>
          <span className="text-black">৳{subtotal.toLocaleString()}</span>
        </div>

        {hasDiscount && (
          <div className="flex justify-between items-center text-[12px] font-medium uppercase tracking-wider">
            <span className="text-green-600">
              Discount ({discount?.code})
            </span>
            <span className="text-green-600">
              -৳{discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-[12px] font-medium uppercase tracking-wider text-gray-400">
          <span>Delivery Fee</span>
          <span
            className={`${
              shipping === null
                ? "text-gray-300 not-italic"
                : shipping === 0
                  ? "text-green-600 font-bold"
                  : "text-black"
            }`}
          >
            {shipping === null
              ? "৳80 - ৳200*"
              : shipping === 0
                ? hasFreeDelivery ? "Free Delivery" : "Free"
                : `৳${shipping.toLocaleString()}`}
          </span>
        </div>
        {shipping === null && (
          <p className="text-[9px] text-gray-300 font-medium text-right">*Estimated based on location</p>
        )}

        <div className="flex justify-between items-center pt-4 lg:pt-6 border-t border-gray-100">
          <span className="text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.3em]">
            Total
          </span>
          <span className="text-[24px] lg:text-[28px] font-medium text-black tracking-tighter">
            ৳{total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
