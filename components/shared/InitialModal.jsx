"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, Tag, Percent, Truck } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { useDiscounts } from "@/hooks/api/useDiscounts";

export default function InitialModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const { useDiscountsQuery } = useDiscounts();
  const { data: discountsData, isLoading } = useDiscountsQuery();

  const discounts =
    discountsData?.data?.filter((d) => d.isActive && !d.isDeleted) || [];

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("xiroo_initial_modal_shown");
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    sessionStorage.setItem("xiroo_initial_modal_shown", "true");
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isVisible) return null;

  const getDiscountLabel = (discount) => {
    switch (discount.type) {
      case "percentage":
        return `${discount.value}% OFF`;
      case "fixed":
        return `৳${discount.value} OFF`;
      case "free_shipping":
        return "FREE SHIPPING";
      default:
        return "DISCOUNT";
    }
  };

  const getDiscountIcon = (type) => {
    switch (type) {
      case "percentage":
        return <Percent className="w-4 h-4" />;
      case "fixed":
        return <Tag className="w-4 h-4" />;
      case "free_shipping":
        return <Truck className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getExpiryText = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Expired";
    if (days === 1) return "Ends tomorrow";
    if (days <= 7) return `${days} days left`;
    return `Until ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="relative w-full md:w-[40%] h-64 md:h-auto overflow-hidden bg-zinc-100 hidden md:block">
          <Image
            src="/images/luxury-modal-bg.png"
            alt="Exclusive Offers"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-white/70 block mb-2">
              Exclusive Offers
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">
              Use Before <br />
              <span className="font-light italic font-serif text-white/80">
                They Expire.
              </span>
            </h2>
          </div>
        </div>

        {/* Right: Coupons */}
        <div className="relative w-full md:w-[60%] p-8 md:p-12 flex flex-col bg-white overflow-y-auto max-h-[80vh] md:max-h-none">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all duration-200"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-400">
                Available Offers
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight">
                Active Coupons
              </h3>
            </div>

            {/* Coupon List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse p-5 border border-zinc-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-3 bg-zinc-100 w-20" />
                        <div className="h-5 bg-zinc-100 w-32" />
                      </div>
                      <div className="h-8 bg-zinc-100 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : discounts.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-zinc-400 font-medium">
                  No active coupons at the moment.
                </p>
                <p className="text-xs text-zinc-300 mt-1">
                  Check back later for exclusive offers.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {discounts.map((discount) => {
                  const expiryText = getExpiryText(discount.endDate);
                  return (
                    <div
                      key={discount._id}
                      className="group relative flex items-center justify-between p-5 border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-zinc-50 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                          {getDiscountIcon(discount.type)}
                        </div>
                        <div>
                          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-900 block">
                            {getDiscountLabel(discount)}
                          </span>
                          {discount.minOrderValue > 0 && (
                            <span className="text-[10px] text-zinc-400 font-medium mt-0.5 block">
                              Min. order ৳{discount.minOrderValue}
                            </span>
                          )}
                          {expiryText && (
                            <span
                              className={`text-[10px] font-medium mt-0.5 block ${
                                expiryText === "Expired"
                                  ? "text-red-500"
                                  : "text-zinc-400"
                              }`}
                            >
                              {expiryText}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold tracking-[0.15em] text-zinc-900 select-all">
                          {discount.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(discount.code)}
                          className="flex items-center justify-center w-9 h-9 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-all duration-200"
                          title="Copy code"
                        >
                          {copiedCode === discount.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTA */}
            <Button
              onClick={closeModal}
              className="w-full py-5 text-[10px] tracking-[0.4em] uppercase font-bold bg-zinc-900 hover:bg-black text-white transition-all duration-300"
            >
              Start Shopping
            </Button>

            <p className="text-[9px] text-zinc-300 font-medium tracking-[0.1em] uppercase text-center">
              One coupon per order. Terms apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
