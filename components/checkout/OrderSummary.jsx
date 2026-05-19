"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";

export default function OrderSummary({ items, subtotal, shipping, total }) {
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
              <p className="text-[10px] md:text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1 md:mb-2 line-clamp-1">
                {item.variant}
              </p>
              <span className="text-sm font-medium text-black">
                ৳{(item.salePrice || item.price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Field */}
      <div className="pt-8 lg:pt-10 border-t border-gray-100">
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Coupon Code"
            className="flex-1 h-12 px-4 md:px-5 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[10px] md:text-xs font-medium uppercase tracking-wider placeholder:text-gray-300 min-w-0"
          />
          <Button variant="secondary" className="h-12 px-4 sm:px-6 shrink-0 text-[10px] sm:text-[11px]">
            Apply
          </Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 pt-8 lg:pt-10 border-t border-gray-100">
        <div className="flex justify-between items-center text-[12px] font-medium uppercase tracking-wider text-gray-400">
          <span>Subtotal</span>
          <span className="text-black">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[12px] font-medium uppercase tracking-wider text-gray-400">
          <span>Delivery Fee</span>
          <span className="text-black italic">
            {shipping === 0 ? "Free" : `৳${shipping.toLocaleString()}`}
          </span>
        </div>
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
