"use client";
import { Clock, CheckCircle, XCircle, DollarSign } from "lucide-react";

const statusConfig = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Pending" },
  paid: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Paid" },
  waived: { icon: XCircle, color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-200", label: "Waived" },
};

export default function AdvancePaymentCard({ advancePayment, onConfirm, onWaive, isConfirming, isWaiving }) {
  if (!advancePayment?.required) return null;

  const config = statusConfig[advancePayment.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className={`border ${config.border} ${config.bg} overflow-hidden`}>
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Advance Payment
        </h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 ${config.bg} border ${config.border}`}>
          <StatusIcon className={`w-3 h-3 ${config.color}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Amount</span>
            <p className="text-[16px] font-black text-zinc-900 mt-1">৳{advancePayment.amount?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Requested</span>
            <p className="text-[11px] font-bold text-zinc-700 mt-1">
              {advancePayment.requestedAt ? new Date(advancePayment.requestedAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        {advancePayment.reason && (
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Reason</span>
            <p className="text-[11px] text-zinc-600 mt-1">{advancePayment.reason}</p>
          </div>
        )}

        {advancePayment.status === "pending" && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={isConfirming}
              className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </button>
            <button
              onClick={onWaive}
              disabled={isWaiving}
              className="px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 disabled:bg-zinc-100 text-zinc-700 text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              {isWaiving ? "Waiving..." : "Waive"}
            </button>
          </div>
        )}

        {advancePayment.status === "paid" && (
          <p className="text-[10px] text-emerald-600 font-bold">
            Confirmed at {advancePayment.paidAt ? new Date(advancePayment.paidAt).toLocaleDateString() : "N/A"}
          </p>
        )}

        {advancePayment.status === "waived" && (
          <p className="text-[10px] text-zinc-500 font-bold">
            Waived at {advancePayment.waivedAt ? new Date(advancePayment.waivedAt).toLocaleDateString() : "N/A"}
          </p>
        )}
      </div>
    </div>
  );
}
