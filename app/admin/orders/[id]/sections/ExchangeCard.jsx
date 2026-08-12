"use client";
import { ArrowRightLeft, CheckCircle2, Truck, PackageCheck, XCircle, Loader2, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const exchangeStatusStyles = {
  requested: {
    badge: "bg-violet-50 border-violet-200",
    icon: "text-violet-600",
    label: "text-violet-600",
    text: "Exchange Requested",
  },
  accepted: {
    badge: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    label: "text-blue-600",
    text: "Exchange Accepted",
  },
  shipped: {
    badge: "bg-cyan-50 border-cyan-200",
    icon: "text-cyan-600",
    label: "text-cyan-600",
    text: "Exchange Shipped",
  },
  delivered: {
    badge: "bg-emerald-50 border-emerald-200",
    icon: "text-emerald-600",
    label: "text-emerald-600",
    text: "Exchange Delivered",
  },
  rejected: {
    badge: "bg-rose-50 border-rose-200",
    icon: "text-rose-600",
    label: "text-rose-600",
    text: "Exchange Rejected",
  },
};

const exchangeStatusIcon = {
  requested: ArrowRightLeft,
  accepted: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  rejected: XCircle,
};

export default function ExchangeCard({
  exchange,
  onUpdateStatus,
  isUpdating,
}) {
  const [adminNote, setAdminNote] = useState("");

  if (!exchange) return null;

  const styles = exchangeStatusStyles[exchange.status] || exchangeStatusStyles.requested;
  const Icon = exchangeStatusIcon[exchange.status] || ArrowRightLeft;

  const nextActions = {
    requested: [
      { status: "accepted", label: "Accept Exchange", primary: true },
      { status: "rejected", label: "Reject" },
    ],
    accepted: [
      { status: "shipped", label: "Mark as Shipped", primary: true },
      { status: "rejected", label: "Reject" },
    ],
    shipped: [
      { status: "delivered", label: "Mark as Delivered", primary: true },
    ],
  };

  const actions = nextActions[exchange.status] || [];
  const totalPriceDiff = exchange.items?.reduce((sum, item) => sum + (item.priceDifference || 0), 0) || 0;

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={14} className="text-violet-600" />
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em]">Exchange Details</h3>
        </div>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border ${styles.badge}`}>
          <Icon size={10} className={styles.icon} />
          <span className={`text-[9px] font-bold uppercase tracking-widest ${styles.label}`}>
            {styles.text}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Reason</p>
          <p className="text-[12px] text-zinc-700 leading-relaxed">{exchange.reason}</p>
        </div>

        <div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Exchange Items</p>
          <div className="space-y-3">
            {exchange.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-100">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Original</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.originalProduct?.images?.[0] ? (
                        <Image fill src={item.originalProduct.images[0]} alt="" sizes="32px" className="object-cover" />
                      ) : (
                        <Package size={10} strokeWidth={1} className="text-zinc-200" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-zinc-900 truncate">{item.originalProduct?.title || "Unknown"}</p>
                      {item.originalVariant && <p className="text-[9px] text-zinc-400">{item.originalVariant}</p>}
                      <p className="text-[9px] text-zinc-400">Qty: {item.originalQuantity}</p>
                    </div>
                  </div>
                </div>

                <ArrowRightLeft size={12} className="text-zinc-300 shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Replacement</p>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 bg-white border border-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.replacementProduct?.images?.[0] ? (
                        <Image fill src={item.replacementProduct.images[0]} alt="" sizes="32px" className="object-cover" />
                      ) : (
                        <Package size={10} strokeWidth={1} className="text-zinc-200" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-zinc-900 truncate">{item.replacementProduct?.title || "Unknown"}</p>
                      {item.replacementVariant && <p className="text-[9px] text-zinc-400">{item.replacementVariant}</p>}
                      <p className="text-[9px] text-zinc-400">Qty: {item.replacementQuantity}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {totalPriceDiff !== 0 && (
          <div className={`flex items-center justify-between px-4 py-2.5 ${totalPriceDiff > 0 ? "bg-amber-50 border border-amber-200" : "bg-emerald-50 border border-emerald-200"}`}>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${totalPriceDiff > 0 ? "text-amber-600" : "text-emerald-600"}`}>
              {totalPriceDiff > 0 ? "Customer Pays Extra" : "Customer Gets Refund"}
            </span>
            <span className={`text-[13px] font-black font-mono ${totalPriceDiff > 0 ? "text-amber-700" : "text-emerald-700"}`}>
              {totalPriceDiff > 0 ? "+" : ""}৳{Math.abs(totalPriceDiff).toLocaleString()}
            </span>
          </div>
        )}

        {exchange.adminNote && (
          <div className="px-4 py-3 bg-violet-50 border border-violet-200">
            <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-1">Admin Note</p>
            <p className="text-[11px] text-violet-800">{exchange.adminNote}</p>
          </div>
        )}

        {actions.length > 0 && (
          <div className="space-y-3 pt-2">
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Admin note (optional)..."
              rows={2}
              className="w-full px-3 py-2 border border-zinc-200 text-[11px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 resize-none"
            />
            <div className="flex items-center gap-2">
              {actions.map((action) => (
                <button
                  key={action.status}
                  onClick={() => {
                    onUpdateStatus(action.status);
                    setAdminNote("");
                  }}
                  disabled={isUpdating}
                  className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                    action.primary
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {isUpdating ? <Loader2 size={10} className="animate-spin" /> : null}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-[9px] text-zinc-300 space-y-0.5">
          {exchange.requestedAt && <p>Requested: {new Date(exchange.requestedAt).toLocaleString()}</p>}
          {exchange.acceptedAt && <p>Accepted: {new Date(exchange.acceptedAt).toLocaleString()}</p>}
          {exchange.shippedAt && <p>Shipped: {new Date(exchange.shippedAt).toLocaleString()}</p>}
          {exchange.deliveredAt && <p>Delivered: {new Date(exchange.deliveredAt).toLocaleString()}</p>}
          {exchange.rejectedAt && <p>Rejected: {new Date(exchange.rejectedAt).toLocaleString()}</p>}
        </div>
      </div>
    </div>
  );
}
