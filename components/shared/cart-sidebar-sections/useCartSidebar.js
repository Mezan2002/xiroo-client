"use client";
import { useDiscounts } from "@/hooks/api/useDiscounts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useEffect, useState } from "react";

export const useCartSidebar = (isOpen) => {
  const cart = useCart();
  const { validateDiscount } = useDiscounts();
  const { toast } = useToast();

  const [activeDrawer, setActiveDrawer] = useState(null);
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

  const handleApplyCoupon = () => {
    if (!coupon) return;
    validateDiscount.mutate(
      { code: coupon, currentOrderValue: cart.subtotal || 0 },
      {
        onSuccess: (res) => {
          cart.applyDiscount(res.data);
          setActiveDrawer(null);
          setCoupon("");
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || err.message || "Invalid Coupon");
        },
      }
    );
  };

  return {
    ...cart,
    activeDrawer,
    setActiveDrawer,
    note,
    setNote,
    coupon,
    setCoupon,
    handleApplyCoupon,
    isApplyingCoupon: validateDiscount.isPending,
  };
};
