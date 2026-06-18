"use client";
import { Button } from "@/components/ui/Button";
import { StickyNote, Tag, X } from "lucide-react";

export default function CartSummary({
  subtotal,
  discount,
  discountAmount,
  autoBundleDiscountAmount,
  total,
  removeDiscount,
  setActiveDrawer,
  onClose,
}) {
  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-white relative z-20">
      <div className="flex items-center gap-0 mb-4 border border-gray-200 rounded-sm overflow-hidden">
        <Button
          variant="ghost"
          showHoverIcon={false}
          onClick={() => setActiveDrawer("note")}
          className="flex-1 flex items-center justify-center py-3 hover:bg-gray-50 transition-colors border-r border-gray-200 group bg-white rounded-none h-10!"
        >
          <StickyNote className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors stroke-[1.5] mr-2" />
          <span className="text-xs font-medium text-black/60 group-hover:text-black">
            Add Note
          </span>
        </Button>
        <Button
          variant="ghost"
          showHoverIcon={false}
          onClick={() => setActiveDrawer("coupon")}
          className="flex-1 flex items-center justify-center py-3 hover:bg-gray-50 transition-colors group bg-white rounded-none h-10!"
        >
          <Tag className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors stroke-[1.5] mr-2" />
          <span className="text-xs font-medium text-black/60 group-hover:text-black">
            Coupon Code
          </span>
        </Button>
      </div>

      <div className="flex justify-between items-center mb-2">
        <span className="text-[14px] text-gray-500 tracking-tight">Subtotal</span>
        <span className="text-[16px] font-medium text-black">
          ৳{Number(subtotal || 0).toFixed(0)}
        </span>
      </div>

      {autoBundleDiscountAmount > 0 && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[14px] text-green-600 tracking-tight flex items-center gap-2">
            Bundle Discount (10%)
          </span>
          <span className="text-[16px] font-medium text-green-600">
            -৳{Number(autoBundleDiscountAmount || 0).toFixed(0)}
          </span>
        </div>
      )}

      {discount && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[14px] text-green-600 tracking-tight flex items-center gap-2">
            Discount ({discount.code})
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              className="h-4 w-4 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-none ml-2"
              onClick={removeDiscount}
            >
              <X className="w-3 h-3" />
            </Button>
          </span>
          <span className="text-[16px] font-medium text-green-600">
            -৳{Number(discountAmount || 0).toFixed(0)}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 mt-2 pt-2 border-t border-gray-100">
        <span className="text-[14px] font-bold tracking-tight text-black">
          Estimated total
        </span>
        <span className="text-[22px] font-semibold text-black">
          ৳{Number(total || subtotal || 0).toFixed(0)}
        </span>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="w-full shadow-lg h-6!"
        href="/checkout"
        onClick={onClose}
      >
        CHECK OUT
      </Button>
    </div>
  );
}
