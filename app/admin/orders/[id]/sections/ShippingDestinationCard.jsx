"use client";
import { MapPin } from "lucide-react";

export default function ShippingDestinationCard({ shippingAddress }) {
  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Shipping Address</h3>
      </div>
      <div className="p-6">
        <div className="p-4 bg-zinc-50 border border-zinc-100">
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-zinc-400 mt-0.5 shrink-0" strokeWidth={1.5} />
            <p className="text-[12px] font-bold text-zinc-900 tracking-tight leading-relaxed uppercase">
              {shippingAddress || "No address provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
