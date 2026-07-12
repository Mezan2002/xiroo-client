"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Shield, AlertTriangle, CheckCircle, XCircle, Package, DollarSign } from "lucide-react";

const reliabilityColors = {
  excellent: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  good: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  borderline: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  poor: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  blocked: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const StatItem = ({ icon: Icon, label, value, color = "text-zinc-900" }) => (
  <div className="flex items-center gap-3">
    <div className="size-8 bg-zinc-50 flex items-center justify-center">
      <Icon className="w-4 h-4 text-zinc-400" />
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
      <span className={`text-[13px] font-bold ${color}`}>{value}</span>
    </div>
  </div>
);

export default function CustomerHistoryCard({ phone }) {
  const { data: customerData, isLoading } = useQuery({
    queryKey: ["customer-history", phone],
    queryFn: async () => {
      const response = await axiosInstance.get(`/customers/search?phone=${encodeURIComponent(phone)}`);
      return response.data;
    },
    enabled: !!phone && phone.length >= 3,
  });

  if (!phone) return null;

  const customer = customerData?.customer;
  const colors = customer ? reliabilityColors[customer.reliabilityStatus] || reliabilityColors.good : null;

  return (
    <div className="bg-white border border-zinc-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">Customer Profile</h3>
        {customer && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${colors?.bg} ${colors?.text} border ${colors?.border}`}>
            {customer.reliabilityStatus}
          </span>
        )}
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-5 h-5 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin mx-auto" />
            <p className="text-[11px] text-zinc-400 mt-2">Loading profile...</p>
          </div>
        ) : !customer ? (
          <div className="text-center py-4">
            <p className="text-[11px] text-zinc-400">No previous order history</p>
            <p className="text-[10px] text-zinc-300 mt-1">New customer</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Reliability Score */}
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={customer.reliabilityScore >= 70 ? "#10b981" : customer.reliabilityScore >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${customer.reliabilityScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[13px] font-black text-zinc-900">{customer.reliabilityScore}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-zinc-900">Reliability Score</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  {customer.reliabilityScore >= 90 ? "Excellent" :
                   customer.reliabilityScore >= 70 ? "Good" :
                   customer.reliabilityScore >= 40 ? "Borderline" :
                   customer.reliabilityScore >= 20 ? "Poor" : "Blocked"}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatItem icon={Package} label="Orders" value={customer.stats?.totalOrders || 0} />
              <StatItem icon={CheckCircle} label="Delivered" value={customer.stats?.deliveredOrders || 0} color="text-emerald-600" />
              <StatItem icon={XCircle} label="Refused" value={customer.stats?.refusedOrders || 0} color="text-red-600" />
              <StatItem icon={DollarSign} label="Spent" value={`৳${(customer.stats?.totalSpent || 0).toLocaleString()}`} />
            </div>

            {/* Warning */}
            {(customer.reliabilityStatus === "borderline" || customer.reliabilityStatus === "poor" || customer.reliabilityStatus === "blocked") && (
              <div className={`p-3 ${reliabilityColors[customer.reliabilityStatus]?.bg} border ${reliabilityColors[customer.reliabilityStatus]?.border}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${reliabilityColors[customer.reliabilityStatus]?.text}`} />
                  <div>
                    <p className={`text-[11px] font-bold ${reliabilityColors[customer.reliabilityStatus]?.text}`}>
                      {customer.reliabilityStatus === "blocked" ? "Blacklisted" : "Caution Required"}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">
                      {customer.reliabilityStatus === "blocked" 
                        ? "Blacklisted customer. Consider advance payment."
                        : customer.stats?.refusedOrders > 0 
                          ? `${customer.stats.refusedOrders} refused order(s).`
                          : "Mixed history detected."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
