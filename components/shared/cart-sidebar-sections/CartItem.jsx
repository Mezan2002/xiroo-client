"use client";
import { Button } from "@/components/ui/Button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartItem({ item, updateQuantity, removeItem, onClose }) {
  const price = parseFloat(
    (item.salePrice && item.salePrice > 0 ? item.salePrice : item.price)
      ?.toString()
      .replace(/[^0-9.]/g, "") || 0
  ).toFixed(0);

  const originalPrice = parseFloat(
    item.price?.toString().replace(/[^0-9.]/g, "") || 0
  ).toFixed(0);

  return (
    <div className="flex gap-4">
      <Link
        href={`/product/${item._id || item.id}`}
        onClick={onClose}
        className="relative w-24 h-24 bg-gray-50 overflow-hidden shrink-0 border border-gray-100 group/img"
      >
        {item.image && typeof item.image === 'string' && item.image.trim() !== '' ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="96px"
            className="object-cover group-hover/img:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px] tracking-widest uppercase">
            No Image
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4 mb-1">
          <div className="line-clamp-2">
            <Link
              href={`/product/${item._id || item.id}`}
              onClick={onClose}
              className="text-[14px] font-medium text-black leading-tight hover:underline underline-offset-4"
            >
              {item.title}
            </Link>
          </div>
          <span className="text-[14px] font-medium text-black whitespace-nowrap">
            ৳{price}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[13px] text-gray-400">{item.variant}</p>
          {item.bundleId && (
            <span className="bg-red-50 text-red-600 px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-sm border border-red-100">
              Bundle
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-5">
          <p className="text-[13px] text-black font-semibold">৳{price}</p>
          {item.salePrice > 0 && (
            <p className="text-[11px] text-gray-400 line-through">৳{originalPrice}</p>
          )}
        </div>

          <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              onClick={() => updateQuantity({ id: item._id || item.id, variant: item.variant, delta: -1, bundleId: item.bundleId })}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <Minus className="w-4 h-4 stroke-[1.5]" />
            </Button>
            <span className="w-10 text-center text-[14px] text-black">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              onClick={() => updateQuantity({ id: item._id || item.id, variant: item.variant, delta: 1, bundleId: item.bundleId })}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[1.5]" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            showHoverIcon={false}
            onClick={() => removeItem({ id: item._id || item.id, variant: item.variant, bundleId: item.bundleId })}
            className="p-2 text-gray-400 hover:text-black transition-colors"
          >
            <Trash2 className="w-5 h-5 stroke-[1.5]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
