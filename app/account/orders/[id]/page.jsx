"use client";

import { Button } from "@/components/ui/Button";
import { useOrders } from "@/hooks/api/useOrders";
import {
  ChevronLeft,
  Clock,
  CreditCard,
  ExternalLink,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;

  const { useOrderDetail } = useOrders();
  const { data: order, isLoading, error } = useOrderDetail(orderId);

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
        <p className="text-gray-400 italic">
          Failed to retrieve order details. Please try again later.
        </p>
        <Link href="/account/orders">
          <Button variant="outline" className="mt-6">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  // Normalize data (handle both API and Mock-like fallback if needed)
  const orderData = {
    id: order.orderNumber || order.orderId || order.id || orderId,
    date: new Date(
      order.createdAt || order.date || Date.now(),
    ).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    status: order.status || "PROCESSING",
    total: order.totalPrice || order.totalAmount || order.total || 0,
    items: order.items || [],
    shipping: order.shippingAddress || {},
    payment: order.paymentInfo || {},
  };

  // Clean calculations derived from API responses
  const shippingCost =
    order.shippingFee || order.shippingPrice || order.shippingCost || 0;
  const subtotal =
    order.itemsPrice || order.subtotal || orderData.total - shippingCost;

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
      <div className="bg-white border border-gray-100 p-5 sm:p-8 md:p-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          <div className="space-y-2 md:space-y-4">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Order ID
            </p>
            <p className="text-[13px] md:text-lg font-montserrat font-bold text-black tracking-tight italic break-all">
              #{orderData.id}
            </p>
          </div>
          <div className="space-y-2 md:space-y-4">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Placed On
            </p>
            <p className="text-[13px] md:text-lg font-montserrat font-bold text-black tracking-tight uppercase">
              {orderData.date}
            </p>
          </div>
          <div className="space-y-2 md:space-y-4 md:text-right lg:text-left">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Status
            </p>
            <span className="inline-block bg-zinc-50 text-gray-400 text-[9px] md:text-[10px] font-bold px-3 md:px-5 py-1 md:py-1.5 border border-gray-100 uppercase tracking-widest">
              {orderData.status}
            </span>
          </div>
          <div className="space-y-1 md:space-y-4 md:text-right">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Total
            </p>
            <p className="text-2xl md:text-4xl font-montserrat font-bold text-black tracking-tighter">
              <span className="mr-0.5">৳</span>
              {orderData.total}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <Package className="w-4 h-4 text-gray-400" />
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em]">
              Items In This Order
            </h3>
          </div>

          <div className="space-y-4">
            {orderData.items.map((item, idx) => (
              <div
                key={item._id || idx}
                className="group flex gap-4 md:gap-6 p-3 md:p-4 border border-transparent hover:border-black/5 hover:bg-gray-50/30 transition-all duration-500"
              >
                <div className="relative w-20 h-28 md:w-24 md:h-32 shrink-0 bg-gray-50 overflow-hidden text-[10px] flex items-center justify-center text-gray-300">
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
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1 md:mb-2">
                    <h4 className="text-[11px] md:text-[13px] font-bold uppercase tracking-tight line-clamp-2 md:line-clamp-1">
                      {item.title || item.product?.title}
                    </h4>
                    <p className="text-[12px] md:text-[13px] font-bold tracking-tight shrink-0 text-right">
                      ৳{item.price}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {item.variant && (
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        Variant:{" "}
                        <span className="text-black">{item.variant}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      Qty: <span className="text-black">{item.quantity}</span>
                    </p>
                  </div>
                  {item.product?._id && (
                    <Link
                      href={`/product/${item.product._id}`}
                      className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1.5"
                    >
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
          <div className="bg-gray-50/50 border border-gray-100 p-5 md:p-8 space-y-6">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-4">
              Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <span>Delivery cost</span>
                <span>{shippingCost === 0 ? "Free" : `৳${shippingCost}`}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between text-[14px] font-bold text-black uppercase tracking-tight">
                <span>Grand Total</span>
                <span className="text-lg italic font-montserrat">
                  ৳{orderData.total}
                </span>
              </div>
            </div>
          </div>

          {/* Logistics & Payment */}
          <div className="space-y-8">
            {/* Shipping */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-gray-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Logistics
                </h3>
              </div>
              <div className="pl-7 space-y-1 text-[12px]">
                <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2 italic bg-black text-white px-2 py-0.5 inline-block">
                  {order.shippingMethod || "Standard Delivery"}
                </p>
                <p className="font-semibold text-black">
                  {orderData.shipping.firstName} {orderData.shipping.lastName}
                </p>
                <p className="text-gray-500">
                  {orderData.shipping.addressLine1}
                </p>
                <p className="text-gray-500">
                  {orderData.shipping.city}, {orderData.shipping.state}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
                  Settlement
                </h3>
              </div>
              <div className="pl-7 text-[12px]">
                <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest mb-1">
                  {orderData.payment.paymentMethod || "COD"}
                </p>
                <p className="font-semibold text-black">
                  {order.paymentStatus || "PENDING"}
                </p>
                {order.paymentStatus === "PAID" && (
                  <div className="mt-3 flex items-center gap-2 text-green-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Transaction Successful
                    </span>
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
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-[10px] px-8 tracking-[0.2em] h-12"
          >
            CONTACT BOUTIQUE
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto text-[10px] px-8 tracking-[0.2em] h-12"
          >
            RAISE DISPUTE
          </Button>
        </div>
      </div>
    </div>
  );
}
