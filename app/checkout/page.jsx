"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

import { useUser } from "@/hooks/api/useUser";
import { useCart } from "@/hooks/useCart";

export default function CheckoutPage() {
  const { user, isLoading } = useUser();
  const { items, subtotal } = useCart();
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
  const [district, setDistrict] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("normal");

  const baseShipping = district === "Dhaka" ? 80 : district ? 150 : 0;
  const shipping = baseShipping + (deliveryMethod === "fast" ? 50 : 0);
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-gray-100 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            XIROO
          </Link>
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-8 md:py-12 lg:py-20">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-24">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <Link 
              href="/" 
              onClick={(e) => {
                // If we're on mobile and the cart is a sidebar, maybe just go back?
                // For now, simplicity.
              }}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 md:mb-10 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Return to store</span>
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
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-black transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
