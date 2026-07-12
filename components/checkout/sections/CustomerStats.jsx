"use client";

import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const statusConfig = {
  excellent: {
    label: "Excellent",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: CheckCircle,
  },
  good: {
    label: "Good",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: CheckCircle,
  },
  borderline: {
    label: "Borderline",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: AlertTriangle,
  },
  poor: {
    label: "Poor",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: AlertTriangle,
  },
  blocked: {
    label: "Blocked",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: XCircle,
  },
};

export default function CustomerStats({ customerStats }) {
  if (!customerStats) return null;

  const config = statusConfig[customerStats.reliabilityStatus] || statusConfig.good;
  const StatusIcon = config.icon;

  return (
    <div className={`border ${config.borderColor} ${config.bgColor} p-6 space-y-4`}>
      <div className="flex items-center gap-3">
        <Shield className={`w-5 h-5 ${config.color}`} />
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Customer History
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <StatusIcon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color}`}>
          {config.label} Customer
        </span>
        <span className="text-xs text-gray-500">
          (Score: {customerStats.reliabilityScore}/100)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold">{customerStats.stats.totalOrders}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Orders</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-green-600">
            {customerStats.stats.deliveredOrders}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Delivered</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-red-600">
            {customerStats.stats.refusedOrders}
          </p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Refused</p>
        </div>
      </div>

      {customerStats.stats.totalSpent > 0 && (
        <div className="text-center pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Total Spent: ৳{customerStats.stats.totalSpent.toLocaleString()}
          </p>
        </div>
      )}

      {customerStats.isBlacklisted && (
        <div className="bg-red-100 border border-red-300 p-3 text-center">
          <p className="text-xs font-medium text-red-700">
            This customer has been flagged. Please contact support.
          </p>
        </div>
      )}
    </div>
  );
}
