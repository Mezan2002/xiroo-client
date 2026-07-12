"use client";

import { use } from "react";
import { useCustomers } from "@/hooks/api/useCustomers";
import { useOrders } from "@/hooks/api/useOrders";
import { Shield, CheckCircle, AlertTriangle, XCircle, ArrowLeft, Ban, MessageSquare } from "lucide-react";
import Link from "next/link";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";

const statusConfig = {
  excellent: { label: "Excellent", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle },
  good: { label: "Good", color: "text-blue-600", bgColor: "bg-blue-50", icon: CheckCircle },
  borderline: { label: "Borderline", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: AlertTriangle },
  poor: { label: "Poor", color: "text-orange-600", bgColor: "bg-orange-50", icon: AlertTriangle },
  blocked: { label: "Blocked", color: "text-red-600", bgColor: "bg-red-50", icon: XCircle },
};

const statusBadgeColors = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-700",
  failed: "bg-red-100 text-red-700",
  returned: "bg-orange-100 text-orange-700",
  "on-hold": "bg-yellow-100 text-yellow-700",
  refused: "bg-red-100 text-red-700",
};

export default function CustomerDetailPage({ params }) {
  const { id } = use(params);
  const { useCustomerDetail, useCustomerOrders, updateCustomer } = useCustomers();
  const { data: customerData, isLoading } = useCustomerDetail(id);
  const customer = customerData;

  const { data: ordersData } = useCustomerOrders(customer?.phone);
  const orders = ordersData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading customer data...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Customer not found</p>
        <Link href="/admin/customers" className="text-sm text-black underline mt-4 inline-block">
          Back to Customers
        </Link>
      </div>
    );
  }

  const config = statusConfig[customer.reliabilityStatus] || statusConfig.good;
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/customers"
          className="p-2 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-medium uppercase tracking-wider">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-sm text-gray-500">{customer.phone}</p>
        </div>
        <div className="flex gap-2">
          {updateCustomer.isPending && (
            <span className="text-xs text-gray-400">Saving...</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reliability Card */}
        <div className={`border p-6 space-y-4 ${config.bgColor} border-gray-200`}>
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${config.color}`} />
            <h2 className="font-medium uppercase tracking-wider">Reliability</h2>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
            <span className={`text-lg font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
          <div className="text-3xl font-medium">
            {customer.reliabilityScore}<span className="text-sm text-gray-500">/100</span>
          </div>
          {customer.isBlacklisted && (
            <div className="bg-red-100 border border-red-300 p-3 flex items-center gap-2">
              <Ban className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">
                BLACKLISTED: {customer.blacklistReason || "No reason provided"}
              </span>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="border border-gray-200 p-6 space-y-4">
          <h2 className="font-medium uppercase tracking-wider">Order Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-medium">{customer.stats?.totalOrders || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Orders</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-green-600">{customer.stats?.deliveredOrders || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Delivered</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-red-600">{customer.stats?.refusedOrders || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Refused</p>
            </div>
            <div>
              <p className="text-2xl font-medium text-orange-600">{customer.stats?.returnedOrders || 0}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Returned</p>
            </div>
          </div>
          {customer.stats?.totalSpent > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-lg font-medium">৳{customer.stats.totalSpent.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Spent</p>
            </div>
          )}
        </div>

        {/* Notes Card */}
        <div className="border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <h2 className="font-medium uppercase tracking-wider">Notes</h2>
          </div>
          <textarea
            value={customer.notes || ""}
            onChange={(e) => updateCustomer.mutate({ id: customer._id, data: { notes: e.target.value } })}
            placeholder="Add notes about this customer..."
            className="w-full h-32 p-3 bg-gray-50 border border-gray-100 focus:border-black outline-none transition-all text-sm resize-none"
          />
        </div>
      </div>

      {/* Addresses */}
      {customer.addresses?.length > 0 && (
        <div className="border border-gray-200 p-6 space-y-4">
          <h2 className="font-medium uppercase tracking-wider">Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.addresses.map((addr, i) => (
              <div key={i} className="bg-gray-50 p-4 space-y-1">
                <p className="text-sm font-medium">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-sm text-gray-500">{addr.addressLine2}</p>}
                <p className="text-sm text-gray-500">{addr.city}, {addr.state}</p>
                <p className="text-sm text-gray-500">{addr.postalCode}</p>
                <p className="text-[10px] text-gray-400">
                  Used in {addr.orderCount} order(s)
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order History */}
      <div className="border border-gray-200 p-6 space-y-4">
        <h2 className="font-medium uppercase tracking-wider">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders found</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderId}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">৳{order.totalPrice.toLocaleString()}</p>
                  <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded ${statusBadgeColors[order.status] || statusBadgeColors.pending}`}>
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
