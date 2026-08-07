"use client";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import AdminOrderConfirmModal from "@/components/checkout/sections/AdminOrderConfirmModal";
import BundleSuggestionModal from "@/components/checkout/BundleSuggestionModal";
import { ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import { useDeliveryFee } from "@/hooks/api/useDeliverySettings";
import { useDiscounts } from "@/hooks/api/useDiscounts";
import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

export default function CheckoutPage() {
  const { user, isLoading } = useUser();
  const {
    items,
    subtotal,
    total: cartTotal,
    discount,
    discountAmount,
    autoBundleDiscountAmount,
    isBundleFreeShipping,
    note,
    setNote,
    applyDiscount,
    removeDiscount,
    convertItemsToBundle,
  } = useCart();
  const { validateDiscount } = useDiscounts();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Info, 2: Delivery & Payment
  const [district, setDistrict] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("normal");
  const checkoutFiredRef = useRef(false);
  const paymentInfoFiredRef = useRef(false);

  // Admin: show test event ID modal on mount
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const adminModalShownRef = useRef(false);

  useEffect(() => {
    if (adminModalShownRef.current) return;
    if (!isLoading && user?.role === "admin") {
      adminModalShownRef.current = true;
      setAdminModalOpen(true);
    }
  }, [user, isLoading]);

  const handleAdminModalConfirm = (testEventCode) => {
    if (testEventCode) {
      sessionStorage.setItem("admin_test_event_code", testEventCode);
    } else {
      sessionStorage.removeItem("admin_test_event_code");
    }
    setAdminModalOpen(false);
  };

  const { data: deliveryFeeData, isLoading: feeLoading } =
    useDeliveryFee(district);

  const hasFreeDelivery = items.some((item) => item.isFreeDelivery) || itemCount >= 3;

  const shipping = !district
    ? null
    : isBundleFreeShipping || discount?.type === "free_shipping" || hasFreeDelivery
      ? 0
      : deliveryFeeData
        ? deliveryMethod === "fast"
          ? deliveryFeeData.fast
          : deliveryFeeData.normal
        : null;

  const total = cartTotal + (shipping || 0);

  const handleApplyCoupon = (code, onSuccess) => {
    validateDiscount.mutate(
      { code, currentOrderValue: subtotal || 0 },
      {
        onSuccess: (discountData) => {
          applyDiscount(discountData);
          if (onSuccess) onSuccess();
        },
        onError: (err) => {
          toast.error(
            err?.response?.data?.message || err.message || "Invalid coupon",
          );
        },
      },
    );
  };

  const handleRemoveCoupon = () => {
    removeDiscount();
  };

  const handleBundleAccept = (eligibleItems) => {
    convertItemsToBundle(eligibleItems, items);
  };

  const handleBundleDecline = () => {};

  // InitiateCheckout — fire once when user arrives at checkout
  useEffect(() => {
    if (checkoutFiredRef.current) return;
    if (window.trackFacebookEvent && items?.length > 0) {
      checkoutFiredRef.current = true;
      window.trackFacebookEvent(
        "InitiateCheckout",
        {
          content_ids: items
            .map(
              (item) =>
                item?.product?._id ||
                item?.product?.id ||
                item?._id ||
                item?.id,
            )
            .filter(Boolean),
          content_type: "product",
          value: total,
          currency: "BDT",
          num_items: items.length,
        },
        {
          email: user?.email,
          phone: user?.phoneNumber || user?.phone || "",
          firstName: user?.firstName,
          lastName: user?.lastName,
          externalId: user?._id || user?.id || "",
        },
      );
    }
  }, [items, total, user?.email, user?.firstName, user?.lastName, user?.phoneNumber, user?.phone, user?._id]);

  // AddPaymentInfo — fire once when user reaches step 2 (Delivery & Payment)
  useEffect(() => {
    if (paymentInfoFiredRef.current) return;
    if (step === 2 && window.trackFacebookEvent) {
      paymentInfoFiredRef.current = true;
      window.trackFacebookEvent(
        "AddPaymentInfo",
        {
          content_ids: items
            .map(
              (item) =>
                item?.product?._id ||
                item?.product?.id ||
                item?._id ||
                item?.id,
            )
            .filter(Boolean),
          content_type: "product",
          value: total,
          currency: "BDT",
          num_items: items.length,
        },
        {
          email: user?.email,
          phone: user?.phoneNumber || user?.phone || "",
          firstName: user?.firstName,
          lastName: user?.lastName,
          externalId: user?._id || user?.id || "",
        },
      );
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-gray-100 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-medium tracking-tighter">
            XIROO
          </Link>
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              Secure Checkout
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8 md:py-12 lg:py-20">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 md:mb-10 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-medium uppercase tracking-wider">
                Return to store
              </span>
            </Link>

            <CheckoutForm
              step={step}
              setStep={setStep}
              setProductDistrict={setDistrict}
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              discount={discount}
              discountAmount={discountAmount}
              note={note}
              setNote={setNote}
              deliveryFeeData={deliveryFeeData}
              hasFreeDelivery={hasFreeDelivery}
            />
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-10">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                discount={discount}
                discountAmount={discountAmount}
                autoBundleDiscountAmount={autoBundleDiscountAmount}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                isApplyingCoupon={validateDiscount.isPending}
                hasFreeDelivery={hasFreeDelivery}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            <Link
              href="/privacy"
              className="hover:text-black transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-black transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/shipping"
              className="hover:text-black transition-colors"
            >
              Shipping Policy
            </Link>
          </div>
        </div>
      </footer>

      {/* Bundle Suggestion Modal — shown when 2+ eligible non-bundled items in cart */}
      <BundleSuggestionModal
        items={items}
        onAccept={handleBundleAccept}
        onDecline={handleBundleDecline}
      />

      {/* Admin Test Event ID Modal — shown on mount for admin users */}
      <AdminOrderConfirmModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onConfirm={handleAdminModalConfirm}
      />
    </div>
  );
}
