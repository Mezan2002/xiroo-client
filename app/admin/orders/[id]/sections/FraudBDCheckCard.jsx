"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";

const riskConfig = {
  low: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "LOW RISK" },
  medium: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "MEDIUM RISK" },
  high: { icon: XCircle, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", label: "HIGH RISK" },
  very_high: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "BLOCKED" },
  unknown: { icon: Shield, color: "text-zinc-500", bg: "bg-zinc-50", border: "border-zinc-200", label: "UNKNOWN" },
};

const courierColors = {
  Pathao: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  Steadfast: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Redx: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  Paperfly: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const CourierStatRow = ({ name, data }) => {
  const colors = courierColors[name] || courierColors.Paperfly;
  const successRate = data.total > 0 ? ((data.success / data.total) * 100).toFixed(1) : 0;

  return (
    <div className="p-3 bg-zinc-50 border border-zinc-100 space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${colors.bg} ${colors.text} border ${colors.border}`}>
          {name}
        </span>
        {data.customer_rating && (
          <span className={`text-[9px] font-bold uppercase tracking-wider ${
            data.customer_rating === "risky_customer" ? "text-red-600" :
            data.customer_rating === "excellent_customer" ? "text-emerald-600" : "text-zinc-500"
          }`}>
            {data.customer_rating.replace(/_/g, " ")}
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-zinc-400 font-medium uppercase">Total</p>
          <p className="text-[13px] font-black text-zinc-900">{data.total}</p>
        </div>
        <div>
          <p className="text-[10px] text-emerald-500 font-medium uppercase">Success</p>
          <p className="text-[13px] font-black text-emerald-600">{data.success}</p>
        </div>
        <div>
          <p className="text-[10px] text-red-500 font-medium uppercase">Cancel</p>
          <p className="text-[13px] font-black text-red-600">{data.cancel}</p>
        </div>
      </div>
      <div className="w-full bg-zinc-200 h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            successRate >= 75 ? "bg-emerald-500" :
            successRate >= 50 ? "bg-amber-500" : "bg-red-500"
          }`}
          style={{ width: `${successRate}%` }}
        />
      </div>
    </div>
  );
};

export default function FraudBDCheckCard({ phone }) {
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
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <Shield className="w-4 h-4 text-zinc-400" />
          FraudBD Courier Check
        </h3>
        {result && risk && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${risk.bg} ${risk.text} border ${risk.border}`}>
            {risk.label}
          </span>
        )}
      </div>

      <div className="p-6">
        {!showResults ? (
          <div className="space-y-4">
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Check courier delivery history for this phone number to assess fraud risk before dispatch.
            </p>
            <div className="p-3 bg-zinc-50 border border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Phone</span>
                <span className="text-[12px] font-mono font-bold text-zinc-900">{phone}</span>
              </div>
            </div>
            <button
              onClick={() => checkCourier(phone)}
              disabled={isPending}
              className="w-full h-11 bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Courier Stats
                </>
              )}
            </button>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {result.error ? (
              <div className="p-4 bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-amber-700">Notice</p>
                    <p className="text-[10px] text-amber-600 mt-1">{result.error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Total Summary */}
                {result.totalSummary && (
                  <div className="p-4 bg-zinc-900 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Overall Summary</span>
                      <div className="flex items-center gap-1.5">
                        {result.totalSummary.successRate >= 75 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        ) : result.totalSummary.successRate >= 50 ? (
                          <Minus className="w-3.5 h-3.5 text-amber-400" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                        )}
                        <span className={`text-[11px] font-bold ${
                          result.totalSummary.successRate >= 75 ? "text-emerald-400" :
                          result.totalSummary.successRate >= 50 ? "text-amber-400" : "text-red-400"
                        }`}>
                          {result.totalSummary.successRate.toFixed(1)}% Success
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[9px] text-zinc-500 font-medium uppercase">Total Orders</p>
                        <p className="text-[18px] font-black">{result.totalSummary.total}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-emerald-400 font-medium uppercase">Delivered</p>
                        <p className="text-[18px] font-black text-emerald-400">{result.totalSummary.success}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-red-400 font-medium uppercase">Cancelled</p>
                        <p className="text-[18px] font-black text-red-400">{result.totalSummary.cancel}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Courier Breakdown */}
                {result.courierData && (
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Courier Breakdown</span>
                    <div className="space-y-3">
                      {Object.entries(result.courierData).map(([name, data]) => (
                        <CourierStatRow key={name} name={name} data={data} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className={`p-4 border ${risk.border} ${risk.bg}`}>
                  <div className="flex items-start gap-2">
                    <RiskIcon className={`w-4 h-4 mt-0.5 ${risk.color}`} />
                    <div>
                      <p className={`text-[11px] font-bold ${risk.color}`}>
                        Recommendation: {result.recommendation.toUpperCase()}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-1">
                        {result.recommendation === "approve" && "Customer has good delivery history. Safe to dispatch."}
                        {result.recommendation === "verify" && "Mixed history detected. Consider requiring advance payment."}
                        {result.recommendation === "reject" && "High risk customer. Strongly recommend advance payment or rejection."}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => { setShowResults(false); reset(); }}
              className="w-full h-10 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Check Another Number
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
