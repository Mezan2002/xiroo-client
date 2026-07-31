"use client";

import { Button } from "@/components/ui/Button";
import { Check, CheckCircle2, Copy, Download, Lock, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useOrders } from "@/hooks/api/useOrders";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";
import ReceiptTemplate from "@/components/checkout/ReceiptTemplate";

const ReceiptFeatures = dynamic(() => import("@/components/checkout/ReceiptFeatures"), { ssr: false });

import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { useOrderDetail } = useOrders();
  const { data: order, isLoading } = useOrderDetail(orderId);
  const { settings: storeSettings } = useStoreSettings();
  const receiptRef = useRef(null);
  const pdfRef = useRef(null);
  const purchaseFiredRef = useRef(false);
  const whatsapp = storeSettings?.contact?.whatsapp || "8801XXXXXXXXX";
  const supportEmail = storeSettings?.contact?.supportEmail || "support@xiroo.shop";
  
  const firePurchaseEvent = (retryCount = 0) => {
    if (purchaseFiredRef.current) return;
    if (!order) return;

    if (typeof window !== "undefined" && window.trackFacebookEvent) {
      purchaseFiredRef.current = true;

      const email = order.guestInfo?.email || order.user?.email || '';
      const phone = order.guestInfo?.phone || order.user?.phoneNumber || order.user?.phone || '';
      const firstName = order.guestInfo?.firstName || order.user?.firstName || '';
      const lastName = order.guestInfo?.lastName || order.user?.lastName || '';
      const userId = order.user?._id || order.user || '';

      const addressParts = order.shippingAddress?.split(',').map((s) => s.trim()) || [];
      const city = addressParts[1] || '';
      const state = addressParts[2] || '';
      const zip = addressParts[3]?.replace(/[^0-9-]/g, '') || '';

      const customerData = {
        email,
        phone,
        firstName,
        lastName,
        externalId: userId || email,
        city,
        state,
        zip,
      };

      window.trackFacebookEvent("Purchase", {
        content_ids: order.items.map(item => item.product?._id || item.product),
        content_type: "product",
        value: Number(order.totalPrice) || 0,
        currency: "BDT",
        num_items: order.items.length
      }, customerData, order.facebookEventId || null);
    } else if (retryCount < 20) {
      // Retry up to 20 times (2 seconds total) waiting for pixel to load
      setTimeout(() => firePurchaseEvent(retryCount + 1), 100);
    }
  };

  useEffect(() => {
    firePurchaseEvent();
  }, [order]);
  
  if (isLoading) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-black animate-spin stroke-1" />
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gray-500">
            Synchronizing Registry...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-medium uppercase tracking-wider">Order Not Found</h1>
          <p className="text-gray-600 text-sm max-w-sm mx-auto">
            We couldn&apos;t find the order record you&apos;re looking for. It may still be processing or the link is invalid.
          </p>
          <Link href="/">
            <Button className="h-14 px-10 tracking-wider font-medium uppercase text-[12px]">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Breakdown using authoritative order data
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = order.shippingFee || (order.totalPrice - subtotal);
  const discount = order.discount || null;
  const discountAmount = discount?.amount ? Math.round(discount.amount * 100) / 100 : 0;

  // Group items by product ID and variant
  const groupedItems = order.items.reduce((acc, item) => {
    const productId = item.product?._id || item.product;
    const variant = item.variant || "Standard";
    const key = `${productId}-${variant}`;
    
    if (acc[key]) {
      acc[key].quantity += item.quantity;
      // We assume price is the same for the same variant
    } else {
      acc[key] = { ...item };
    }
    return acc;
  }, {});

  const displayItems = Object.values(groupedItems);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="px-6 pt-24 pb-12 flex justify-center">
        <div className="w-full bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col lg:flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Left Column: Confirmation & Info */}
          <div className="flex-1 p-8 lg:p-14 space-y-12">
            <div className="space-y-8">
              <div className="w-14 h-14 rounded-full border border-black/5 flex items-center justify-center bg-black/5">
                <CheckCircle2 className="w-8 h-8 text-black stroke-1" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-medium tracking-tighter text-black uppercase leading-none">
                  Order
                  <br />
                  Confirmed.
                </h1>
                <p className="text-gray-500 text-sm max-w-xs font-medium leading-relaxed">
                  Thank you,{" "}
                  <span className="text-black font-medium underline decoration-black/10 underline-offset-4">
                    {order.user?.firstName || order.user?.name || "Customer"}
                  </span>
                  . Your order is secure and we&apos;re getting it ready for
                  handover.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/" className="flex-1 min-w-[200px]">
                <Button className="w-full h-14 bg-black text-white hover:bg-zinc-800 tracking-wider font-medium uppercase text-[12px] rounded-none">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account/orders" className="flex-1 min-w-[200px]">
                <Button
                  variant="outline"
                  className="w-full h-14 border-gray-200 text-black tracking-wider font-medium uppercase text-[12px] rounded-none"
                >
                  See My Orders
                </Button>
              </Link>
            </div>

            {/* Note for guest users to track their order */}
            {(!order.user || typeof order.user === "string") && (
              <div className="p-5 mt-2 bg-yellow-50/50 border border-yellow-100 text-center">
                <p className="text-[12px] font-medium text-gray-600 leading-relaxed uppercase tracking-wider">
                  Guest Checkout? <br/> 
                  Please copy your Order ID <strong className="text-black select-all ml-1">{order.orderId || order._id}</strong>. <br/>
                  You can paste it on the <Link href="/track-order" className="text-black font-medium underline decoration-black/20 hover:decoration-black underline-offset-4 transition-all">Track Order</Link> page to monitor your status.
                </p>
              </div>
            )}

            {/* Advance Payment Notice */}
            {order.advancePayment?.required && order.advancePayment?.status === "pending" && (
              <div className="p-6 bg-amber-50 border border-amber-200 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="text-[13px] font-bold text-amber-800 uppercase tracking-wider">
                      Advance Payment Required
                    </h3>
                    <p className="text-[12px] text-amber-700 leading-relaxed">
                      Your order requires an advance payment of <strong className="text-amber-900">৳{order.advancePayment.amount?.toLocaleString()}</strong> before processing.
                    </p>
                    <p className="text-[11px] text-amber-600">
                      Reason: {order.advancePayment.reason || "Customer reliability check"}
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-amber-100 p-4 space-y-3">
                  <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">How to Pay</p>
                  <ol className="space-y-2 text-[11px] text-amber-700">
                    <li className="flex gap-2">
                      <span className="shrink-0 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">1</span>
                      <span>Transfer <strong>৳{order.advancePayment.amount}</strong> via bKash / Nagad</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="shrink-0 w-4 h-4 bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">2</span>
                      <span>Send screenshot to WhatsApp or email with Order ID</span>
                    </li>
                  </ol>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-bold uppercase tracking-wider text-center transition-colors"
                  >
                    Pay via WhatsApp
                  </a>
                  <a
                    href={`mailto:${supportEmail}?subject=Advance Payment - Order ${order.orderId}`}
                    className="flex-1 px-4 py-2.5 border border-amber-300 hover:bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider text-center transition-colors"
                  >
                    Pay via Email
                  </a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Estimated Delivery
                </label>
                <div className="text-sm text-black font-medium uppercase">
                  {order.deliveryMethod === 'fast' ? "1 Business Day" : "2-3 Business Days"}
                </div>
                <div className="text-[11px] text-gray-600 font-medium font-montserrat uppercase">
                  {order.deliveryMethod === 'fast' ? "FAST DELIVERY" : "STANDARD DELIVERY"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                  Payment Details
                </label>
                <div className="text-sm text-black font-medium uppercase">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </div>
                <div className="text-[11px] text-gray-600 font-medium italic">
                  Status: {order.paymentStatus}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Delivery To
              </label>
              <div className="space-y-1">
                <div className="text-black font-medium uppercase tracking-tight">
                  {order.user?.firstName} {order.user?.lastName}
                </div>
                <div className="text-[12px] text-gray-600 font-medium">
                  {order.user?.email}
                </div>
              </div>
              <div className="pt-4 space-y-1">
                <div className="text-[12px] text-gray-600 font-medium leading-relaxed uppercase tracking-wider">
                  {order.shippingAddress}
                  <br />
                  BANGLADESH
                </div>
              </div>
            </div>

            <div className="flex gap-10 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <Lock className="w-3 h-3" />
                Secure Delivery
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <Check className="w-3 h-3" />
                Registry Synchronized
              </div>
            </div>
          </div>

          <div ref={receiptRef} className="w-full lg:w-[400px] bg-gray-50/50 flex flex-col border-l border-gray-100">
            {/* Hidden Receipt Template for PDF Export */}
            <ReceiptTemplate 
              order={order} 
              subtotal={subtotal} 
              delivery={delivery} 
              discount={discount}
              discountAmount={discountAmount}
              receiptRef={pdfRef} 
            />

            <div className="p-8 lg:p-12 flex-1">
              <ReceiptFeatures order={order} receiptRef={pdfRef} />

              {/* Order Items */}
              <div className="space-y-8">
                {displayItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="relative w-16 h-16 bg-white border border-gray-100 shrink-0 overflow-hidden">
                      {/* item.product is likely populated by backend now */}
                      <Image
                        src={item.product?.images?.[0] || "/images/placeholder.png"}
                        alt={item.product?.title || "Product"}
                        fill
                        className="object-cover group-hover:scale-110 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[11px] font-medium text-black uppercase tracking-wider leading-normal line-clamp-2">
                          {item.product?.title || "Product Registry Title"}
                          {item.variant && item.variant !== "Standard" && (
                            <span className="block text-[10px] text-gray-600 mt-0.5">
                              Variant: {item.variant}
                            </span>
                          )}
                        </h3>
                        <span className="text-[12px] font-medium text-black tracking-wider">
                          ৳{item.price}
                        </span>
                      </div>
                      <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                        Qty {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-8 lg:p-12 bg-gray-100/30 space-y-4">
              <div className="flex justify-between items-center text-[11px] font-medium uppercase tracking-wider text-gray-500">
                <span>Subtotal</span>
                <span className="text-black">৳{subtotal}</span>
              </div>
              {discount && (
                <div className="flex justify-between items-center text-[11px] font-medium uppercase tracking-wider">
                  <span className="text-gray-500">
                    Discount ({discount.code})
                  </span>
                  <span className="text-emerald-600">
                    {discount.type === 'free_shipping' ? 'Free Shipping' : `-৳${discountAmount.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-[11px] font-medium uppercase tracking-wider text-gray-500">
                <span>Delivery</span>
                <span className="text-black">৳{delivery}</span>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.2em] leading-none">
                    Total
                  </label>
                  <div className="text-3xl font-medium text-black tracking-tighter">
                    ৳{order.totalPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-12 h-12 text-black animate-spin stroke-1" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
