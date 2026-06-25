"use client";

import { Button } from "@/components/ui/Button";
import { Check, CheckCircle2, Copy, Download, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useOrders } from "@/hooks/api/useOrders";
import ReceiptTemplate from "@/components/checkout/ReceiptTemplate";

const ReceiptFeatures = dynamic(() => import("@/components/checkout/ReceiptFeatures"), { ssr: false });

import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { useOrderDetail } = useOrders();
  const { data: order, isLoading } = useOrderDetail(orderId);
  const receiptRef = useRef(null);
  const pdfRef = useRef(null);
  
  useEffect(() => {
    if (order && window.trackFacebookEvent) {
      // Extract customer data for Advanced Matching
      const customerData = {
        email: order.customerEmail || order.user?.email || order.guestInfo?.email || '',
        phone: order.customerPhone || order.user?.phoneNumber || order.guestInfo?.phone || '',
        firstName: order.customerFirstName || order.user?.firstName || order.guestInfo?.firstName || '',
        lastName: order.customerLastName || order.user?.lastName || order.guestInfo?.lastName || '',
        externalId: order.user?._id || order.user || '',
      };

      window.trackFacebookEvent("Purchase", {
        content_ids: order.items.map(item => item.product?._id || item.product),
        content_type: "product",
        value: order.totalPrice,
        currency: "BDT",
        num_items: order.items.length
      }, customerData);
    }
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
