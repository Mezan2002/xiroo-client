"use client";
import { Truck } from "lucide-react";

const Card = ({ children, title, action, className = "" }) => (
  <div className={`bg-white border border-zinc-200 rounded-none overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">{title}</h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export default function ShippingDestinationCard({ shippingAddress }) {
  return (
    <Card title="Shipping Destination">
      <div className="space-y-6">
        <div className="p-6 bg-zinc-900 text-white rounded-none border border-zinc-800 shadow-xl">
          <Truck size={18} className="mb-4 text-zinc-400" strokeWidth={1} />
          <p className="text-[13px] font-bold tracking-tight leading-relaxed uppercase">{shippingAddress}</p>
        </div>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center px-4">
          Verified Logistics Access Point
        </p>
      </div>
    </Card>
  );
}
