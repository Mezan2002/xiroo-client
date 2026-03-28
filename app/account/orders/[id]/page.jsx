"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useOrders } from "@/hooks/api/useOrders";


export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;

  const { useOrderDetail } = useOrders();
  const { 
    data: order, 
    isLoading,
    error 
  } = useOrderDetail(orderId);


  if (isLoading) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-6 w-32 bg-gray-100" />
        <div className="h-32 bg-gray-50 border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 h-96 bg-gray-50/50" />
          <div className="h-96 bg-gray-50/50" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-400 italic">Failed to retrieve order details. Please try again later.</p>
        <Link href="/account/orders">
           <Button variant="outline" className="mt-6">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  // Normalize data (handle both API and Mock-like fallback if needed)
  const orderData = {
    id: order.orderNumber || order.id || orderId,
    date: new Date(order.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    status: order.status || "PROCESSING",
    total: order.totalAmount || order.total,
    items: order.items || [],
    shipping: order.shippingAddress || {},
    payment: order.paymentInfo || {},
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/account/orders" 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back TO ORDERS
        </Link>
        <span className="text-[10px] font-mono font-semibold tracking-widest text-gray-400 uppercase">
          Tracking ID: {orderData.id}
        </span>
      </div>

      {/* Hero Order Info */}
      <div className="bg-white border border-gray-100 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order ID</p>
            <p className="text-lg font-montserrat font-bold text-black tracking-tight italic">#{orderData.id}</p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Placed On</p>
            <p className="text-lg font-montserrat font-bold text-black tracking-tight uppercase">{orderData.date}</p>
          </div>
          <div className="md:text-right lg:text-left space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</p>
            <span className="inline-block bg-zinc-50 text-gray-400 text-[10px] font-bold px-5 py-1.5 border border-gray-100 uppercase tracking-widest">
              {orderData.status}
            </span>
          </div>
          <div className="md:text-right space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total</p>
            <p className="text-4xl font-montserrat font-bold text-black tracking-tighter">
              <span className="font-sans mr-0.5">৳</span>{orderData.total}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <Package className="w-4 h-4 text-gray-400" />
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em]">Items In This Order</h3>
          </div>
          
          <div className="space-y-4">
            {orderData.items.map((item, idx) => (
              <div key={item._id || idx} className="group flex gap-6 p-4 border border-transparent hover:border-black/5 hover:bg-gray-50/30 transition-all duration-500">
                <div className="relative w-24 h-32 shrink-0 bg-gray-50 overflow-hidden text-[10px] flex items-center justify-center text-gray-300">
                  {item.image || item.product?.images?.[0] ? (
                    <Image
                      src={item.image || item.product?.images?.[0]}
                      alt={item.title || item.product?.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <Package className="w-8 h-8 opacity-20" />
                  )}
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[13px] font-bold uppercase tracking-tight line-clamp-1">{item.title || item.product?.title}</h4>
                    <p className="text-[13px] font-bold tracking-tight">৳{item.price}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {item.variant && (
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        Variant: <span className="text-black">{item.variant}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      Qty: <span className="text-black">{item.quantity}</span>
                    </p>
                  </div>
                  {item.product?._id && (
                    <Link href={`/product/${item.product._id}`} className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
                      View Product <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Order Summary */}
          <div className="bg-gray-50/50 border border-gray-100 p-8 space-y-6">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-4">Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <span>Subtotal</span>
                <span>৳{order.subtotal || orderData.total}</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <span>Shipping</span>
                <span>৳{order.shippingCost || 0}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between text-[14px] font-bold text-black uppercase tracking-tight">
                <span>Grand Total</span>
                <span className="text-lg italic font-montserrat">৳{orderData.total}</span>
              </div>
            </div>
          </div>

          {/* Logistics & Payment */}
          <div className="space-y-8">
             {/* Shipping */}
             <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-gray-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Logistics</h3>
              </div>
              <div className="pl-7 space-y-1 text-[12px]">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2 italic bg-black text-white px-2 py-0.5 inline-block">
                  {order.shippingMethod || "Standard Delivery"}
                </p>
                <p className="font-semibold text-black">{orderData.shipping.firstName} {orderData.shipping.lastName}</p>
                <p className="text-gray-500">{orderData.shipping.addressLine1}</p>
                <p className="text-gray-500">{orderData.shipping.city}, {orderData.shipping.state}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Settlement</h3>
              </div>
              <div className="pl-7 text-[12px]">
                 <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest mb-1">{orderData.payment.paymentMethod || "COD"}</p>
                 <p className="font-semibold text-black">{order.paymentStatus || "PENDING"}</p>
                 {order.paymentStatus === "PAID" && (
                   <div className="mt-3 flex items-center gap-2 text-green-600">
                     <Clock className="w-3.5 h-3.5" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Transaction Successful</span>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Footer */}
      <div className="mt-10 pt-10 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-6 italic">
          Experiencing issues with your order?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="text-[10px] px-8 tracking-[0.2em]">
            CONTACT BOUTIQUE
          </Button>
          <Button variant="outline" className="text-[10px] px-8 tracking-[0.2em]">
            RAISE DISPUTE
          </Button>
        </div>
      </div>
    </div>
  );
}
