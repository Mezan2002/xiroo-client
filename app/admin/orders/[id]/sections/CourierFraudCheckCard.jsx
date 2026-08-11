"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2, Search } from "lucide-react";

const riskConfig = {
  low: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Low Risk" },
  medium: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Medium Risk" },
  high: { icon: XCircle, color: "text-orange-600", bg: "bg-orange-50", label: "High Risk" },
  very_high: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Blocked" },
  unknown: { icon: Shield, color: "text-zinc-500", bg: "bg-zinc-50", label: "Unknown" },
};

const courierDots = {
  Pathao: "bg-violet-500",
  Steadfast: "bg-blue-500",
  Redx: "bg-rose-500",
  CarryBee: "bg-amber-500",
};

export default function CourierFraudCheckCard({ phone }) {
  const [showResults, setShowResults] = useState(false);

  const { mutate: checkCourier, data: fraudData, isPending, reset } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/fraud-check/admin-check-courier", { phone });
      return response.data;
    },
    onSuccess: () => setShowResults(true),
  });

  if (!phone) return null;

  const result = fraudData;
  const risk = result ? riskConfig[result.riskLevel] || riskConfig.unknown : null;
  const RiskIcon = risk?.icon || Shield;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-400" />
          Fraud Check
        </h3>
        {result && risk && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${risk.bg} ${risk.color}`}>
            <RiskIcon className="w-3 h-3" />
            {risk.label}
          </span>
        )}
      </div>

      <div className="px-5 pb-5">
        {!showResults ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-500">Check delivery history for this phone number before dispatch.</p>
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-lg">
              <span className="text-xs text-zinc-400">Phone</span>
              <span className="text-sm font-medium text-zinc-900">{phone}</span>
            </div>
            <button
              onClick={() => checkCourier(phone)}
              disabled={isPending}
              className="w-full h-10 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              {isPending ? "Analyzing..." : "Check Stats"}
            </button>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {result.error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-700">{result.error}</p>
              </div>
            )}

            {result.totalSummary && result.totalSummary.total > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total", value: result.totalSummary.total, color: "text-zinc-900" },
                  { label: "Delivered", value: result.totalSummary.success, color: "text-emerald-600" },
                  { label: "Cancelled", value: result.totalSummary.cancel, color: "text-red-500" },
                  { label: "Rate", value: `${result.totalSummary.successRate.toFixed(0)}%`, color: result.totalSummary.successRate >= 75 ? "text-emerald-600" : result.totalSummary.successRate >= 50 ? "text-amber-600" : "text-red-600" },
                ].map((item) => (
                  <div key={item.label} className="text-center py-2 bg-zinc-50 rounded-lg">
                    <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            {result.courierData && (
              <div className="border border-zinc-100 rounded-lg overflow-hidden">
                {Object.entries(result.courierData).map(([name, data]) => {
                  const rate = data.total > 0 ? ((data.success / data.total) * 100).toFixed(0) : null;
                  const dot = courierDots[name] || "bg-zinc-400";
                  return (
                    <div key={name} className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 last:border-0">
                      <span className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className="text-sm font-medium text-zinc-900 w-24">{name}</span>
                      <span className="text-sm text-zinc-500 flex-1 text-right">{data.total} orders</span>
                      <span className="text-sm text-emerald-600 w-16 text-right">{data.success}</span>
                      <span className="text-sm text-red-500 w-16 text-right">{data.cancel}</span>
                      <span className={`text-sm font-medium w-12 text-right ${rate ? (Number(rate) >= 75 ? "text-emerald-600" : Number(rate) >= 50 ? "text-amber-600" : "text-red-600") : "text-zinc-400"}`}>
                        {rate ? `${rate}%` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => { setShowResults(false); reset(); }}
              className="w-full h-9 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-medium rounded-lg transition-colors"
            >
              Check Another
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
