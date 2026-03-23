"use client";

import { Button } from "@/components/ui/Button";
import { Check, Copy, Download, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOCK_ORDER = {
  id: "XR-673DCC7F",
  date: "Mar 22, 2026",
  estimatedDelivery: "Mar 24 - Mar 26, 2026",
  paymentMethod: "Cash on Delivery",
  customer: {
    name: "John Doe",
    email: "test@example.com",
    phone: "+880 1712 345678",
    address: "House 24, Road 12, Banani",
    district: "Dhaka",
    upazila: "Banani",
    zip: "1212",
  },
  items: [
    {
      id: 1,
      title: "Xiroo™ 4-in-1 Travel Dispensing Bottles",
      price: 2150,
      quantity: 1,
      image: "/images/featured-product-main.png",
      variant: "Gray, Sticker English Version",
    },
  ],
  subtotal: 2150,
  delivery: 80,
  taxes: 0,
  total: 2230,
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="px-6 pt-24 flex justify-center">
        <div className="w-full bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col lg:flex-row overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Left Column: Confirmation & Info */}
          <div className="flex-1 p-8 lg:p-14 space-y-12">
            <div className="space-y-8">
              <div className="w-14 h-14 rounded-full border border-black/5 flex items-center justify-center bg-black/5">
                <Check className="w-6 h-6 text-black" />
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
                    {MOCK_ORDER.customer.name}
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
                <div className="text-sm text-black font-bold">
                  {MOCK_ORDER.estimatedDelivery}
                </div>
                <div className="text-[10px] text-gray-500 font-medium">
                  Standard Delivery
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  Payment Details
                </label>
                <div className="text-sm text-black font-bold">
                  {MOCK_ORDER.paymentMethod}
                </div>
                <div className="text-[10px] text-gray-500 font-medium italic">
                  Billing address: Same as delivery
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                Delivery To
              </label>
              <div className="space-y-1">
                <div className="text-black font-bold uppercase tracking-tight">
                  {MOCK_ORDER.customer.name}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {MOCK_ORDER.customer.email}
                </div>
                <div className="text-[11px] text-gray-500 font-medium">
                  {MOCK_ORDER.customer.phone}
                </div>
              </div>
              <div className="pt-4 space-y-1">
                <div className="text-[11px] text-gray-600 font-medium leading-relaxed uppercase tracking-widest">
                  {MOCK_ORDER.customer.address}
                  <br />
                  {MOCK_ORDER.customer.upazila}, {MOCK_ORDER.customer.district}{" "}
                  — {MOCK_ORDER.customer.zip}
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
                Payment Verified
              </div>
            </div>
          </div>

          {/* Right Column: Receipt Section */}
          <div className="w-full lg:w-[400px] bg-gray-50/50 flex flex-col border-l border-gray-100">
            <div className="p-8 lg:p-12 flex-1">
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none">
                    Receipt
                  </label>
                  <div className="flex items-center gap-2 text-black/80 font-bold text-[13px] tracking-tight">
                    {MOCK_ORDER.id}
                    <Copy className="w-3 h-3 text-gray-400 hover:text-black transition-colors cursor-pointer" />
                  </div>
                </div>
                <Download className="w-5 h-5 text-gray-400 hover:text-black transition-colors cursor-pointer" />
              </div>

              {/* Order Items */}
              <div className="space-y-8">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-16 h-16 bg-white border border-gray-100 shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-[10px] font-bold text-black uppercase tracking-widest leading-normal">
                          {item.title}
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
                <span className="text-black">৳{MOCK_ORDER.subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Delivery</span>
                <span className="text-black">৳{MOCK_ORDER.delivery}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <span>Taxes</span>
                <span className="text-black">৳{MOCK_ORDER.taxes}.00</span>
              </div>

              <div className="h-px bg-gray-200 my-4" />

              <div className="flex justify-between items-end pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none">
                    Total Paid
                  </label>
                  <div className="text-3xl font-bold text-black tracking-tighter">
                    ৳{MOCK_ORDER.total}
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
