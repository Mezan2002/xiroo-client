"use client";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, X } from "lucide-react";
import CartDrawers from "./cart-sidebar-sections/CartDrawers";
import CartItem from "./cart-sidebar-sections/CartItem";
import CartSummary from "./cart-sidebar-sections/CartSummary";
import FreeShippingBanner from "./cart-sidebar-sections/FreeShippingBanner";
import { useCartSidebar } from "./cart-sidebar-sections/useCartSidebar";

export function CartSidebar({ isOpen, onClose }) {
  const {
    items,
    subtotal,
    discount,
    discountAmount,
    total,
    updateQuantity,
    removeItem,
    removeDiscount,
    activeDrawer,
    setActiveDrawer,
    note,
    setNote,
    coupon,
    setCoupon,
    handleApplyCoupon,
    isApplyingCoupon,
  } = useCartSidebar(isOpen);

  return (
    <div
      className={`fixed inset-0 z-1001 transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div className="absolute inset-0 flex justify-end overflow-hidden">
        <aside
          className={`h-full w-full sm:w-[450px] bg-white shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-[24px] font-medium text-black">Cart</h2>
                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-[12px] font-medium text-gray-400">
                  {items.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                showHoverIcon={false}
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </Button>
            </div>

            {/* Free Shipping Banner */}
            {items.length > 0 && <FreeShippingBanner subtotal={subtotal} />}

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 relative">
              <div
                className={`absolute inset-0 z-10 bg-black/15 transition-opacity duration-500 pointer-events-auto cursor-pointer ${activeDrawer ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={() => setActiveDrawer(null)}
              />

              {items.length > 0 ? (
                <div className="flex flex-col gap-10">
                  {items.map((item) => (
                    <CartItem
                      key={`${item._id || item.id}-${item.variant}`}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      onClose={onClose}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-10">
                  <ShoppingBag className="w-24 h-24 stroke-1 text-gray-400/50 mb-10" />
                  <h3 className="text-[20px] font-medium text-black mb-3">
                    Your bag is waiting.
                  </h3>
                  <p className="text-sm text-gray-500 mb-10">
                    Looks like you haven&apos;t added any products to your bag
                    yet.
                  </p>
                  <Button onClick={onClose}>Shop Now</Button>
                  <p className="text-[12px] text-gray-400 font-light mt-10">
                    Free delivery on orders over{" "}
                    <span className="font-semibold text-black">৳2,000</span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <CartSummary
                subtotal={subtotal}
                discount={discount}
                discountAmount={discountAmount}
                total={total}
                removeDiscount={removeDiscount}
                setActiveDrawer={setActiveDrawer}
                onClose={onClose}
              />
            )}
          </div>

          <CartDrawers
            activeDrawer={activeDrawer}
            setActiveDrawer={setActiveDrawer}
            note={note}
            setNote={setNote}
            coupon={coupon}
            setCoupon={setCoupon}
            handleApplyCoupon={handleApplyCoupon}
            isApplyingCoupon={isApplyingCoupon}
          />
        </aside>
      </div>
    </div>
  );
}
