"use client";

import { useState } from "react";
import { useFraudCheck } from "@/hooks/api/useFraudCheck";
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, Phone, Truck, BarChart3 } from "lucide-react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";

const riskColors = {
  low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: CheckCircle },
  medium: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: AlertTriangle },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: AlertTriangle },
  very_high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
  unknown: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: AlertTriangle },
};

const recommendationColors = {
  approve: "bg-green-100 text-green-700",
  verify: "bg-yellow-100 text-yellow-700",
  reject: "bg-red-100 text-red-700",
};

const courierColors = {
  Pathao: "bg-emerald-50 border-emerald-200",
  Steadfast: "bg-blue-50 border-blue-200",
  Redx: "bg-purple-50 border-purple-200",
  Paperfly: "bg-amber-50 border-amber-200",
};

const ratingLabels = {
  excellent_customer: { label: "Excellent", color: "text-green-600" },
  good_customer: { label: "Good", color: "text-blue-600" },
  risky_customer: { label: "Risky", color: "text-red-600" },
  neutral: { label: "Neutral", color: "text-gray-600" },
};

export default function CourierCheckPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const { useCourierCheck } = useFraudCheck();
  const courierCheck = useCourierCheck();

  const handleCheck = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 11) return;
    courierCheck.mutate(phone, {
      onSuccess: (data) => setResult(data),
    });
  };

  const risk = result ? riskColors[result.riskLevel] || riskColors.unknown : null;
  const RiskIcon = risk?.icon || AlertTriangle;

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Courier Check"
        subtitle="Check customer parcel acceptance data via FraudBD"
      />

      {/* Search Form */}
      <form onSubmit={handleCheck} className="border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4" />
          <h2 className="font-medium uppercase tracking-wider text-sm">Customer Phone Number</h2>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
                setPhone(val);
                setResult(null);
              }}
              placeholder="01XXXXXXXXX"
              className="w-full h-11 px-4 bg-gray-50 border border-gray-100 focus:border-black outline-none transition-all text-sm font-mono tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={!phone || phone.length < 11 || courierCheck.isPending}
            className="h-11 px-6 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {courierCheck.isPending ? (
              <>Checking...</>
            ) : (
              <>
                <Search size={14} />
                Check
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
          Enter 11-digit Bangladeshi phone number starting with 01[3-9]
        </p>
      </form>

      {/* Error */}
      {result?.error && (
        <div className="border border-red-200 bg-red-50 p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700">{result.error}</p>
        </div>
      )}

      {/* Results */}
      {result && !result.error && (
        <div className="space-y-6">
          {/* Risk Assessment Header */}
          <div className={`border p-6 ${risk.bg} ${risk.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiskIcon className={`w-6 h-6 ${risk.text}`} />
                <div>
                  <h2 className="font-medium uppercase tracking-wider text-sm">Risk Assessment</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Phone: {result.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded ${risk.text} ${risk.bg} border ${risk.border}`}>
                  {result.riskLevel.replace("_", " ")}
                </span>
                <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                  Recommendation:{" "}
                  <span className={`px-1.5 py-0.5 rounded ${recommendationColors[result.recommendation]}`}>
                    {result.recommendation}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Total Summary */}
          {result.totalSummary && (
            <div className="border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <h2 className="font-medium uppercase tracking-wider text-sm">Overall Summary</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-2xl font-medium">{result.totalSummary.total}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Parcels</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-green-600">{result.totalSummary.success}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Delivered</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-red-600">{result.totalSummary.cancel}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cancelled</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-green-600">{result.totalSummary.successRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Success Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-red-600">{result.totalSummary.cancelRate.toFixed(1)}%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Cancel Rate</p>
                </div>
              </div>
            </div>
          )}

          {/* Courier-wise Data */}
          {result.courierData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <h2 className="font-medium uppercase tracking-wider text-sm">Courier-wise Breakdown</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.courierData).map(([courier, data]) => (
                  <div
                    key={courier}
                    className={`border p-5 space-y-3 ${courierColors[courier] || "bg-gray-50 border-gray-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{courier}</h3>
                      {data.customer_rating && (
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${ratingLabels[data.customer_rating]?.color || "text-gray-500"}`}>
                          {ratingLabels[data.customer_rating]?.label || data.customer_rating}
                        </span>
                      )}
                    </div>

                    {data.message ? (
                      <p className="text-xs text-gray-500 italic">{data.message}</p>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-lg font-medium">{data.total}</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Total</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-green-600">{data.success}</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Success</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-red-600">{data.cancel}</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider">Cancel</p>
                          </div>
                        </div>

                        {data.success_rate !== undefined && (
                          <div className="pt-2 border-t border-black/5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Success Rate</span>
                              <span className={`text-sm font-medium ${data.success_rate >= 75 ? "text-green-600" : data.success_rate >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                                {data.success_rate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-black/5 mt-1">
                              <div
                                className={`h-full ${data.success_rate >= 75 ? "bg-green-500" : data.success_rate >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${Math.min(data.success_rate, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {data.risk_level && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Risk:</span>
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${
                              data.risk_level === "low" ? "text-green-600" :
                              data.risk_level === "medium" ? "text-yellow-600" :
                              "text-red-600"
                            }`}>
                              {data.risk_level}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !courierCheck.isPending && (
        <div className="border border-gray-200 p-12 text-center">
          <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Enter a phone number to check courier parcel acceptance data</p>
          <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-wider">
            Data sourced from Pathao, Steadfast, Redx & Paperfly
          </p>
        </div>
      )}
    </div>
  );
}
