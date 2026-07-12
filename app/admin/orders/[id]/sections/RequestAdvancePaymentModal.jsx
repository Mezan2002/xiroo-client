"use client";
import { X, DollarSign } from "lucide-react";

export default function RequestAdvancePaymentModal({
  isOpen,
  onClose,
  onConfirm,
  amount,
  setAmount,
  reason,
  setReason,
  isProcessing,
  orderTotal,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white border border-zinc-200 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-[14px] font-bold text-zinc-900 tracking-tight">Request Advance Payment</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              Advance Amount (BDT)
            </label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 80"
                className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-zinc-400"
              />
            </div>
            {orderTotal && (
              <p className="text-[10px] text-zinc-400 mt-1.5">
                Order total: ৳{orderTotal.toLocaleString()} — Suggested: delivery charge (৳{Math.min(orderTotal, 80)})
              </p>
            )}
          </div>

          <div>
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer has refused orders before"
              rows={3}
              className="w-full px-4 py-2.5 border border-zinc-200 text-[12px] text-zinc-700 focus:outline-none focus:border-zinc-400 resize-none mt-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 px-4 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            className="flex-1 px-4 py-2.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            {isProcessing ? "Processing..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
