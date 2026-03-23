"use client";

import { use, useState } from "react";
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

// Mock data for a single order
const MOCK_ORDER = {
  id: "##XI-98231",
  date: "MARCH 12, 2024",
  status: "PROCESSING",
  total: "2,450",
  items: [
    {
      id: 1,
      title: "Minimalist Ceramic Vase",
      color: "Sand White",
      size: "Large",
      price: "1,200",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1581781870027-04212e231e96?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Nordic Lounge Chair",
      color: "Ash Grey",
      size: "Standard",
      price: "3,700",
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
    }
  ],
  shipping: {
    method: "Premium Express",
    address: "Mezanur Rahman",
    phone: "+880 1712 345678",
    street: "Plot 12, Road 5, Sector 7",
    city: "Uttara, Dhaka - 1230",
    country: "Bangladesh"
  },
  payment: {
    method: "Credit Card (Visa)",
    id: "**** 4242",
    status: "PAID"
  },
  summary: {
    subtotal: "4,900",
    shipping: "0",
    tax: "0",
    total: "4,900"
  }
};

export default function OrderDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const orderId = params.id;

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
          Tracking ID: {orderId}
        </span>
      </div>

      {/* Hero Order Info - Matching User Screenshot */}
      <div className="bg-white border border-gray-100 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Order ID</p>
            <p className="text-lg font-montserrat font-bold text-black tracking-tight italic">{MOCK_ORDER.id}</p>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Placed On</p>
            <p className="text-lg font-montserrat font-bold text-black tracking-tight uppercase">{MOCK_ORDER.date}</p>
          </div>
          <div className="md:text-right lg:text-left space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Status</p>
            <span className="inline-block bg-zinc-50 text-gray-400 text-[10px] font-bold px-5 py-1.5 border border-gray-100 uppercase tracking-widest">
              {MOCK_ORDER.status}
            </span>
          </div>
          <div className="md:text-right space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Total</p>
            <p className="text-4xl font-montserrat font-bold text-black tracking-tighter">
              <span className="font-sans mr-0.5">৳</span>{MOCK_ORDER.total}
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
            {MOCK_ORDER.items.map((item) => (
              <div key={item.id} className="group flex gap-6 p-4 border border-transparent hover:border-black/5 hover:bg-gray-50/30 transition-all duration-500">
                <div className="relative w-24 h-32 shrink-0 bg-gray-50 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-[13px] font-bold uppercase tracking-tight line-clamp-1">{item.title}</h4>
                    <p className="text-[13px] font-bold tracking-tight">৳{item.price}</p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      Color: <span className="text-black">{item.color}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      Size: <span className="text-black">{item.size}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      Qty: <span className="text-black">{item.quantity}</span>
                    </p>
                  </div>
                  <Link href={`/product/${item.id}`} className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center gap-1.5">
                    View Product <ExternalLink className="w-2.5 h-2.5" />
                  </Link>
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
                <span>৳{MOCK_ORDER.summary.subtotal}</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <span>Shipping</span>
                <span>৳{MOCK_ORDER.summary.shipping}</span>
              </div>
              <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                <span>Estimated Tax</span>
                <span>৳{MOCK_ORDER.summary.tax}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between text-[14px] font-bold text-black uppercase tracking-tight">
                <span>Grand Total</span>
                <span className="text-lg italic font-montserrat">৳{MOCK_ORDER.summary.total}</span>
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
                  {MOCK_ORDER.shipping.method}
                </p>
                <p className="font-semibold text-black">{MOCK_ORDER.shipping.address}</p>
                <p className="text-gray-500">{MOCK_ORDER.shipping.street}</p>
                <p className="text-gray-500">{MOCK_ORDER.shipping.city}</p>
                <p className="text-gray-500">{MOCK_ORDER.shipping.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Settlement</h3>
              </div>
              <div className="pl-7 text-[12px]">
                 <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest mb-1">{MOCK_ORDER.payment.id}</p>
                 <p className="font-semibold text-black">{MOCK_ORDER.payment.method}</p>
                 <div className="mt-3 flex items-center gap-2 text-green-600">
                   <Clock className="w-3.5 h-3.5" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Transaction Successful</span>
                 </div>
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
