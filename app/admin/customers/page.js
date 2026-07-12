"use client";

import { useState } from "react";
import { useCustomers } from "@/hooks/api/useCustomers";
import { Search, Users } from "lucide-react";
import DataTable from "@/components/admin/shared/DataTable";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import Link from "next/link";

const statusColors = {
  excellent: "bg-green-100 text-green-700",
  good: "bg-blue-100 text-blue-700",
  borderline: "bg-yellow-100 text-yellow-700",
  poor: "bg-orange-100 text-orange-700",
  blocked: "bg-red-100 text-red-700",
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { useAllCustomers } = useCustomers();

  const { data, isLoading } = useAllCustomers({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  });

  const customers = data?.customers || [];

  const columns = [
    {
      key: "phone",
      label: "Phone",
      render: (row) => (
        <span className="font-medium">{row.phone}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <span>{row.firstName} {row.lastName}</span>
      ),
    },
    {
      key: "stats.totalOrders",
      label: "Orders",
      render: (row) => (
        <span className="font-medium">{row.stats?.totalOrders || 0}</span>
      ),
    },
    {
      key: "stats.deliveredOrders",
      label: "Delivered",
      render: (row) => (
        <span className="text-green-600">{row.stats?.deliveredOrders || 0}</span>
      ),
    },
    {
      key: "stats.refusedOrders",
      label: "Refused",
      render: (row) => (
        <span className="text-red-600">{row.stats?.refusedOrders || 0}</span>
      ),
    },
    {
      key: "reliabilityStatus",
      label: "Status",
      render: (row) => (
        <span className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider rounded ${statusColors[row.reliabilityStatus] || statusColors.good}`}>
          {row.reliabilityStatus}
        </span>
      ),
    },
    {
      key: "reliabilityScore",
      label: "Score",
      render: (row) => (
        <span className="font-medium">{row.reliabilityScore}/100</span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <Link
          href={`/admin/customers/${row._id}`}
          className="text-[10px] font-medium uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Customers"
        subtitle="Manage customer records and reliability scores"
        primaryAction={{
          label: "View Fraud Review",
          onClick: () => window.location.href = "/admin/fraud-review",
        }}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by phone, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 bg-gray-50 border border-gray-100 focus:border-black outline-none transition-all text-sm font-medium"
        >
          <option value="">All Status</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="borderline">Borderline</option>
          <option value="poor">Poor</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        emptyMessage="No customers found"
      />
    </div>
  );
}
