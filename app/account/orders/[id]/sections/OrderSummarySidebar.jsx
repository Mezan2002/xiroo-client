"use client";
import { Truck, CreditCard, Clock } from "lucide-react";

export default function OrderSummarySidebar({ orderData, subtotal, shippingCost, originalOrder }) {
  return (
    <div className="space-y-10">
      <div className="bg-gray-50/50 border border-gray-100 p-5 md:p-8 space-y-6">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] border-b border-gray-200 pb-4">Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <span>Subtotal</span><span>৳{subtotal}</span>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <span>Delivery cost</span><span>{shippingCost === 0 ? "Free" : `৳${shippingCost}`}</span>
          </div>
          <div className="pt-4 border-t border-gray-200 flex justify-between text-[14px] font-bold text-black uppercase tracking-tight">
            <span>Grand Total</span><span className="text-lg italic font-montserrat">৳{orderData.total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-gray-400" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Logistics</h3>
          </div>
          <div className="pl-7 space-y-1 text-[12px]">
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2 italic bg-black text-white px-2 py-0.5 inline-block">
              {originalOrder.shippingMethod || "Standard Delivery"}
            </p>
            <p className="font-semibold text-black">{orderData.shipping.firstName} {orderData.shipping.lastName}</p>
            <p className="text-gray-500">{orderData.shipping.addressLine1}</p>
            <p className="text-gray-500">{orderData.shipping.city}, {orderData.shipping.state}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">Settlement</h3>
          </div>
          <div className="pl-7 text-[12px]">
            <p className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-widest mb-1">
              {orderData.payment.paymentMethod || "COD"}
            </p>
            <p className="font-semibold text-black">{originalOrder.paymentStatus || "PENDING"}</p>
            {originalOrder.paymentStatus === "PAID" && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Transaction Successful</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
