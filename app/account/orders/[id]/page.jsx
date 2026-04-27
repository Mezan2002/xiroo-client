"use client";

import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import OrderDetailHero from "./sections/OrderDetailHero";
import OrderItemList from "./sections/OrderItemList";
import OrderSummarySidebar from "./sections/OrderSummarySidebar";
import { useOrderDetailLogic } from "./sections/useOrderDetailLogic";

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { orderData, subtotal, shippingCost, isLoading, error, order } = useOrderDetailLogic(params.id);

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

  if (error || !orderData) {
    return (
      <div className="py-24 text-center">
        <p className="text-gray-400 italic">Failed to retrieve order details. Please try again later.</p>
        <Link href="/account/orders"><Button variant="outline" className="mt-6">Back to Orders</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Link href="/account/orders" className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors">
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back TO ORDERS
        </Link>
        <span className="text-[10px] font-mono font-semibold tracking-widest text-gray-400 uppercase">Tracking ID: {orderData.id}</span>
      </div>

      <OrderDetailHero orderData={orderData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <OrderItemList items={orderData.items} />
        <OrderSummarySidebar orderData={orderData} subtotal={subtotal} shippingCost={shippingCost} originalOrder={order} />
      </div>

      <div className="mt-10 pt-10 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-6 italic">Experiencing issues with your order?</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="w-full sm:w-auto text-[10px] px-8 tracking-[0.2em] h-12">CONTACT BOUTIQUE</Button>
          <Button variant="outline" className="w-full sm:w-auto text-[10px] px-8 tracking-[0.2em] h-12">RAISE DISPUTE</Button>
        </div>
      </div>
    </div>
  );
}
