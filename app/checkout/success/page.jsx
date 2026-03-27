"use client";

import { Button } from "@/components/ui/Button";
import { Check, CheckCircle2, Copy, Download, Lock, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import ReceiptTemplate from "@/components/checkout/ReceiptTemplate";

const ReceiptFeatures = dynamic(() => import("@/components/checkout/ReceiptFeatures"), { ssr: false });

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest(`/orders/${orderId}`);
        if (response.success) {
          setOrder(response.data);
        } else {
          toast.error("Failed to retrieve order record.");
        }
      } catch (error) {
        console.error("Order fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-black animate-spin stroke-1" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
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
          <h1 className="text-2xl font-bold uppercase tracking-widest">Order Not Found</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            We couldn&apos;t find the order record you&apos;re looking for. It may still be processing or the link is invalid.
          </p>
          <Link href="/">
            <Button className="h-14 px-10 tracking-widest font-bold uppercase text-[11px]">
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
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-black uppercase leading-none">
                  Order
                  <br />
                  Confirmed.
                </h1>
                <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
                  Thank you,{" "}
                  <span className="text-black font-bold underline decoration-black/10 underline-offset-4">
                    {order.user?.firstName || order.user?.name || "Customer"}
                  </span>
                  . Your order is secure and we&apos;re getting it ready for
                  handover.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/" className="flex-1 min-w-[200px]">
                <Button className="w-full h-14 bg-black text-white hover:bg-zinc-800 tracking-widest font-bold uppercase text-[11px] rounded-none">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account/orders" className="flex-1 min-w-[200px]">
                <Button
                  variant="outline"
                  className="w-full h-14 border-gray-200 text-black tracking-widest font-bold uppercase text-[11px] rounded-none"
                >
                  See My Orders
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-gray-100">
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Estimated Delivery
                </label>
                <div className="text-sm text-black font-bold uppercase">
                  {order.deliveryMethod === 'fast' ? "1 Business Day" : "2-3 Business Days"}
                </div>
                <div className="text-[10px] text-gray-500 font-medium font-montserrat uppercase">
                  {order.deliveryMethod === 'fast' ? "FAST DELIVERY" : "STANDARD DELIVERY"}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Payment Details
                </label>
                <div className="text-sm text-black font-bold uppercase">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </div>
                <div className="text-[10px] text-gray-500 font-medium italic">
                  Status: {order.paymentStatus}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Delivery To
              </label>
              <div className="space-y-1">
                <div className="text-black font-bold uppercase tracking-tight">
                  {order.user?.firstName} {order.user?.lastName}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {order.user?.email}
                </div>
              </div>
              <div className="pt-4 space-y-1">
                <div className="text-[11px] text-gray-600 font-bold leading-relaxed uppercase tracking-widest">
                  {order.shippingAddress}
                  <br />
                  BANGLADESH
                </div>
              </div>
            </div>

            <div className="flex gap-10 pt-10 border-t border-gray-100">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Lock className="w-3 h-3" />
                Secure Delivery
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
                {order.items.map((item, idx) => (
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
                        <h3 className="text-[10px] font-bold text-black uppercase tracking-widest leading-normal line-clamp-2">
                          {item.product?.title || "Product Registry Title"}
                        </h3>
                        <span className="text-[11px] font-bold text-black tracking-widest">
                          ৳{item.price}
                        </span>
                      </div>
                      <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Qty {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-8 lg:p-12 bg-gray-100/30 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Subtotal</span>
                <span className="text-black">৳{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Delivery</span>
                <span className="text-black">৳{delivery}</span>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">
                    Total
                  </label>
                  <div className="text-3xl font-bold text-black tracking-tighter">
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
