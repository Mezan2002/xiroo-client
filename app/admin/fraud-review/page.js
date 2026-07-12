"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Shield, CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/admin/shared/DataTable";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";

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

const fraudStatusColors = {
  flagged: "bg-yellow-100 text-yellow-700",
  blocked: "bg-red-100 text-red-700",
  cleared: "bg-green-100 text-green-700",
};

export default function FraudReviewPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["fraud-orders", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await axiosInstance.get("/fraud-check/orders", { params });
      return response.data;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["fraud-stats"],
    queryFn: async () => {
      const response = await axiosInstance.get("/fraud-check/stats");
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await axiosInstance.patch(`/fraud-check/orders/${orderId}/approve`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraud-orders"] });
      queryClient.invalidateQueries({ queryKey: ["fraud-stats"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await axiosInstance.patch(`/fraud-check/orders/${orderId}/reject`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraud-orders"] });
      queryClient.invalidateQueries({ queryKey: ["fraud-stats"] });
    },
  });

  const orders = data?.orders || [];
  const stats = statsData || {};

  const columns = [
    {
      key: "orderId",
      label: "Order ID",
      render: (row) => (
        <Link
          href={`/admin/orders/${row._id}`}
          className="font-medium hover:underline flex items-center gap-1"
        >
          {row.orderId}
          <ExternalLink size={10} className="text-gray-400" />
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => (
        <div>
          <p className="text-sm">
            {row.guestInfo?.firstName} {row.guestInfo?.lastName}
          </p>
          <p className="text-xs text-gray-500">{row.guestInfo?.phone}</p>
        </div>
      ),
    },
    {
      key: "totalPrice",
      label: "Total",
      render: (row) => (
        <span className="font-medium">৳{row.totalPrice.toLocaleString()}</span>
      ),
    },
    {
      key: "fraudStatus",
      label: "Fraud Status",
      render: (row) => (
        <span className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded ${fraudStatusColors[row.fraudStatus] || fraudStatusColors.flagged}`}>
          {row.fraudStatus}
        </span>
      ),
    },
    {
      key: "riskScore",
      label: "Risk Score",
      render: (row) => (
        <span className={`font-medium ${row.riskScore >= 70 ? "text-red-600" : row.riskScore >= 40 ? "text-yellow-600" : "text-green-600"}`}>
          {row.riskScore}/100
        </span>
      ),
    },
    {
      key: "fraudFlags",
      label: "Flags",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.fraudFlags?.slice(0, 2).map((flag, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-[9px] font-medium uppercase tracking-wider rounded">
              {flag.replace(/_/g, " ")}
            </span>
          ))}
          {row.fraudFlags?.length > 2 && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-[9px] font-medium rounded">
              +{row.fraudFlags.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => approveMutation.mutate(row._id)}
            disabled={approveMutation.isPending}
            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 transition-colors rounded"
            title="Approve"
          >
            <CheckCircle size={14} />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to reject this order? It will be cancelled and inventory restored.")) {
                rejectMutation.mutate(row._id);
              }
            }}
            disabled={rejectMutation.isPending}
            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 transition-colors rounded"
            title="Reject"
          >
            <XCircle size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Fraud Review"
        subtitle="Review flagged and blocked orders"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Flagged</span>
          </div>
          <p className="text-2xl font-medium">{stats.flagged || 0}</p>
        </div>
        <div className="border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Blocked</span>
          </div>
          <p className="text-2xl font-medium">{stats.blocked || 0}</p>
        </div>
        <div className="border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Cleared</span>
          </div>
          <p className="text-2xl font-medium">{stats.cleared || 0}</p>
        </div>
        <div className="border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-medium">{stats.total || 0}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 bg-gray-50 border border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
        >
          <option value="">All Flagged/Blocked</option>
          <option value="flagged">Flagged Only</option>
          <option value="blocked">Blocked Only</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyMessage="No flagged or blocked orders"
      />
    </div>
  );
}
