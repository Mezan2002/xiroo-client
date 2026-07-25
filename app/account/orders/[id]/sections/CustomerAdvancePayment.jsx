"use client";
import { Clock, CheckCircle, AlertCircle, Phone, Mail } from "lucide-react";
import { useStoreSettings } from "@/hooks/api/useStoreSettings";

const statusConfig = {
  pending: {
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-500",
    title: "Advance Payment Required",
    subtitle: "Please complete the advance payment to proceed with your order.",
  },
  paid: {
    icon: CheckCircle,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "text-emerald-500",
    title: "Advance Payment Confirmed",
    subtitle: "Your payment has been received. Your order is now being processed.",
  },
  waived: {
    icon: CheckCircle,
    bg: "bg-zinc-50",
    border: "border-zinc-200",
    iconColor: "text-zinc-500",
    title: "Advance Payment Waived",
    subtitle: "The advance payment requirement has been waived. Your order is being processed.",
  },
};

export default function CustomerAdvancePayment({ advancePayment, orderId }) {
  const { settings: storeSettings } = useStoreSettings();
  const whatsapp = storeSettings?.contact?.whatsapp || "8801XXXXXXXXX";
  const supportEmail = storeSettings?.contact?.supportEmail || "support@xiroo.shop";

  if (!advancePayment?.required) return null;

  const config = statusConfig[advancePayment.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} p-6 sm:p-8`}>
      <div className="flex items-start gap-4">
        <div className={`shrink-0 ${config.iconColor}`}>
          <StatusIcon className="w-8 h-8" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-[14px] font-bold text-zinc-900 tracking-tight">
              {config.title}
            </h3>
            <p className="text-[12px] text-zinc-600 mt-1">
              {config.subtitle}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Amount:</span>
            <span className="text-[24px] font-black text-zinc-900">৳{advancePayment.amount?.toLocaleString()}</span>
          </div>

          {advancePayment.reason && (
            <div className="bg-white/50 border border-zinc-100 p-4">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Reason</span>
              <p className="text-[12px] text-zinc-700 mt-1">{advancePayment.reason}</p>
            </div>
          )}

          {advancePayment.status === "pending" && (
            <div className="space-y-4 pt-2">
              <div className="bg-white border border-zinc-100 p-5 space-y-4">
                <h4 className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">How to Pay</h4>
                <ol className="space-y-3 text-[12px] text-zinc-600">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center">1</span>
                    <span>Transfer <strong className="text-zinc-900">৳{advancePayment.amount}</strong> via bKash / Nagad / Bank Transfer</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center">2</span>
                    <span>Send payment screenshot to us via WhatsApp or email</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-black text-white text-[10px] font-bold flex items-center justify-center">3</span>
                    <span>Include your Order ID: <strong className="text-zinc-900 font-mono">{orderId}</strong></span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Pay via WhatsApp
                </a>
                <a
                  href={`mailto:${supportEmail}?subject=Advance Payment - Order ${orderId}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Pay via Email
                </a>
              </div>
            </div>
          )}

          {advancePayment.status === "paid" && (
            <div className="pt-2">
              <p className="text-[11px] text-emerald-600 font-bold">
                Payment confirmed on {advancePayment.paidAt ? new Date(advancePayment.paidAt).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Your order is now being processed and will be shipped soon.
              </p>
            </div>
          )}

          {advancePayment.status === "waived" && (
            <div className="pt-2">
              <p className="text-[11px] text-zinc-500 font-bold">
                The advance payment requirement has been waived by our team.
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Your order is being processed normally.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
