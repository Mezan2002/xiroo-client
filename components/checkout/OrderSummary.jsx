"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import { Button } from "../ui/Button";

export default function OrderSummary({ items, subtotal, shipping, total }) {
  return (
    <div className="bg-gray-50/50 border border-gray-100 p-8 lg:p-12 space-y-10">
      <h2 className="text-[20px] font-bold uppercase tracking-widest border-b border-gray-100 pb-8">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-8">
        {items.map((item) => (
          <div key={`${item._id || item.id}-${item.variant}`} className="flex gap-6">
            <Link 
              href={`/product/${item._id || item.id}`}
              className="relative w-24 h-24 bg-white border border-gray-100 shrink-0 group/img"
            >
              <div className="w-full h-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover/img:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full z-10">
                {item.quantity}
              </span>
            </Link>
            <div className="flex flex-col justify-center min-w-0">
              <div className="line-clamp-2 mb-2">
                <Link 
                  href={`/product/${item._id || item.id}`}
                  className="text-sm font-bold text-black uppercase tracking-tight hover:underline underline-offset-4 decoration-black hover:text-zinc-600 transition-colors"
                >
                  {item.title}
                </Link>
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                {item.variant}
              </p>
              <span className="text-sm font-bold text-black">
                ৳{(item.salePrice || item.price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Field */}
      <div className="pt-10 border-t border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Coupon Code"
            className="flex-1 h-12 px-5 bg-white border border-gray-100 focus:border-black outline-none transition-all text-xs font-bold uppercase tracking-widest placeholder:text-gray-300"
          />
          <Button variant="secondary" className="h-12 px-6">Apply</Button>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 pt-10 border-t border-gray-100">
        <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-gray-400">
          <span>Subtotal</span>
          <span className="text-black">৳{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-[12px] font-bold uppercase tracking-widest text-gray-400">
          <span>Delivery Fee</span>
          <span className="text-black italic">{shipping === 0 ? "Free" : `৳${shipping.toLocaleString()}`}</span>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          <span className="text-[15px] font-bold uppercase tracking-[0.3em]">Total</span>
          <span className="text-[28px] font-bold text-black tracking-tighter">৳{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="pt-10 flex flex-col items-center gap-4 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Guaranteed Safe & Secure Checkout
        </p>
        <div className="flex gap-4 opacity-30 grayscale">
          {/* Mock mini icons for payment trust */}
          <div className="w-10 h-6 bg-gray-200 rounded-sm" />
          <div className="w-10 h-6 bg-gray-200 rounded-sm" />
          <div className="w-10 h-6 bg-gray-200 rounded-sm" />
          <div className="w-10 h-6 bg-gray-200 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
