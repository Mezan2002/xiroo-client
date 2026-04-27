"use client";
import { Package, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OrderItemList({ items }) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
        <Package className="w-4 h-4 text-gray-400" />
        <h3 className="text-[12px] font-bold uppercase tracking-[0.3em]">Items In This Order</h3>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item._id || idx} className="group flex gap-4 md:gap-6 p-3 md:p-4 border border-transparent hover:border-black/5 hover:bg-gray-50/30 transition-all duration-500">
            <div className="relative w-20 h-28 md:w-24 md:h-32 shrink-0 bg-gray-50 overflow-hidden flex items-center justify-center text-gray-300">
              {item.image || item.product?.images?.[0] ? (
                <Image src={item.image || item.product?.images?.[0]} alt={item.title || item.product?.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <Package className="w-8 h-8 opacity-20" />
              )}
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="text-[11px] md:text-[13px] font-bold uppercase tracking-tight line-clamp-2">{item.title || item.product?.title}</h4>
                <p className="text-[12px] md:text-[13px] font-bold tracking-tight">৳{item.price}</p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {item.variant && <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Variant: <span className="text-black">{item.variant}</span></p>}
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Qty: <span className="text-black">{item.quantity}</span></p>
              </div>
              {item.product?._id && (
                <Link href={`/product/${item.product._id}`} className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
                  View Product <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
