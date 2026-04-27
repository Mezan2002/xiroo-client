"use client";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export default function CartDrawers({
  activeDrawer,
  setActiveDrawer,
  note,
  setNote,
  coupon,
  setCoupon,
  handleApplyCoupon,
  isApplyingCoupon,
}) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-102 bg-white border-t border-gray-200 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.1)] transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        activeDrawer ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[15px] font-semibold text-black uppercase tracking-widest">
            {activeDrawer === "note" ? "Order Note" : "Discount Coupon"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            showHoverIcon={false}
            onClick={() => setActiveDrawer(null)}
            className="p-1.5 bg-gray-50 rounded-full text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-4 h-4 stroke-2" />
          </Button>
        </div>

        {activeDrawer === "note" ? (
          <div className="space-y-5">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Special instructions for your order..."
              className="w-full h-40 p-5 text-[14px] bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all resize-none placeholder:text-gray-300"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={() => setActiveDrawer(null)}
              className="w-full shadow-md"
            >
              Save Note
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex gap-3">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 p-4.5 text-[14px] bg-gray-50 border border-gray-200 focus:border-black focus:bg-white outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest"
              />
              <Button
                variant="primary"
                className="px-8"
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon}
              >
                {isApplyingCoupon ? "Applying..." : "Apply"}
              </Button>
            </div>
            <p className="text-[12px] text-gray-500 font-medium">
              One coupon per order. Terms apply.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
