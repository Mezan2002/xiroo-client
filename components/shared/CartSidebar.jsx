"use client";

import {
  Minus,
  Plus,
  ShoppingBag,
  StickyNote,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

const MOCK_CART_ITEMS = [
  {
    id: 1,
    title: "Xiroo™ 4-in-1 Travel Dispensing Bottles Portable Lotion Bottle",
    price: 2150, // Updated price for Taka example
    quantity: 1,
    image: "/images/featured-product-main.png",
    variant: "Gray, Sticker English Version",
  },
];

const FREE_SHIPPING_THRESHOLD = 2000;

export function CartSidebar({ isOpen, onClose }) {
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [activeDrawer, setActiveDrawer] = useState(null); // 'note' or 'coupon'
  const [note, setNote] = useState("");
  const [coupon, setCoupon] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const updateQuantity = (id, delta) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div
      className={`fixed inset-0 z-1001 transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Backdrop Backdrop Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar Panel Container */}
      <div className="absolute inset-0 flex justify-end overflow-hidden">
        {/* Sidebar Panel */}
        <aside
          className={`h-full w-full sm:w-[450px] bg-white shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
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
                aria-label="Close cart"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </Button>
            </div>

            {/* Free Shipping Banner */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] text-gray-600">
                    {remaining > 0 ? (
                      <>
                        Add{" "}
                        <span className="font-semibold text-black">
                          ৳{remaining.toFixed(0)}
                        </span>{" "}
                        more for{" "}
                        <span className="font-semibold text-black">
                          FREE SHIPPING!
                        </span>
                      </>
                    ) : (
                      <>
                        Congratulations! You qualify for{" "}
                        <span className="font-semibold text-black">
                          FREE SHIPPING!
                        </span>
                      </>
                    )}
                  </p>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cart Content with Dimming Overlay */}
            <div className="flex-1 overflow-y-auto px-6 py-4 relative">
              {/* Dimming Overlay when Drawer is open */}
              <div
                className={`absolute inset-0 z-10 bg-black/15 transition-opacity duration-500 pointer-events-auto cursor-pointer ${
                  activeDrawer ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setActiveDrawer(null)}
              />

              {items.length > 0 ? (
                <div className="flex flex-col gap-10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-24 h-24 bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info Area */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-1">
                          <h3 className="text-[14px] font-medium text-black leading-tight line-clamp-2">
                            {item.title}
                          </h3>
                          <span className="text-[14px] font-medium text-black whitespace-nowrap">
                            ৳{item.price.toFixed(0)}
                          </span>
                        </div>

                        <p className="text-[13px] text-gray-400 mb-1">
                          {item.variant}
                        </p>
                        <p className="text-[13px] text-gray-400 mb-5">
                          ৳{item.price.toFixed(0)}
                        </p>

                        <div className="flex items-center gap-4">
                          {/* Quantity Selector Box */}
                          <div className="flex items-center border border-gray-200">
                            <Button
                              variant="ghost"
                              size="icon"
                              showHoverIcon={false}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 stroke-[1.5]" />
                            </Button>
                            <span className="w-10 text-center text-[14px] text-black">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              showHoverIcon={false}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 stroke-[1.5]" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            showHoverIcon={false}
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-black transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5 stroke-[1.5]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-10">
                  <div className="relative mb-10 text-gray-400/50">
                    <ShoppingBag className="w-24 h-24 stroke-1" />
                  </div>

                  <h3 className="text-[20px] font-medium text-black mb-3">
                    Your bag is waiting.
                  </h3>
                  <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                    Looks like you haven&apos;t added any products to your bag
                    yet.
                  </p>

                  <Button onClick={onClose}>Shop Now</Button>

                  <p className="text-[13px] text-gray-400 font-light mt-10">
                    Free delivery on orders over{" "}
                    <span className="font-semibold text-black">৳2,000</span>
                  </p>
                </div>
              )}
            </div>

            {/* Simple Footer */}
            {items.length > 0 && (
              <div className="px-6 py-8 border-t border-gray-100 bg-white relative z-20">
                {/* Interaction Row (Note / Coupon) - More Visible Design */}
                <div className="flex items-center gap-0 mb-4 border border-gray-200 rounded-sm overflow-hidden">
                  <Button
                    variant="ghost"
                    showHoverIcon={false}
                    onClick={() => setActiveDrawer("note")}
                    className="flex-1 flex items-center justify-center py-3 hover:bg-gray-50 transition-colors border-r border-gray-200 group bg-white rounded-none h-auto"
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
                    className="flex-1 flex items-center justify-center py-3 hover:bg-gray-50 transition-colors group bg-white rounded-none h-auto"
                  >
                    <Tag className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors stroke-[1.5] mr-2" />
                    <span className="text-xs font-medium text-black/60 group-hover:text-black">
                      Coupon Code
                    </span>
                  </Button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-[14px] text-gray-500 tracking-tight">
                    Estimated total
                  </span>
                  <span className="text-[22px] font-semibold text-black">
                    ৳{subtotal.toFixed(0)}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg"
                >
                  CHECK OUT
                </Button>
              </div>
            )}
          </div>

          {/* Mini Drawer (Bottom Sheet) - More Visible with Shadow */}
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
                  aria-label="Close drawer"
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
                    <Button variant="primary" className="px-8">
                      Apply
                    </Button>
                  </div>
                  <p className="text-[12px] text-gray-500 font-medium">
                    One coupon per order. Terms apply.
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
