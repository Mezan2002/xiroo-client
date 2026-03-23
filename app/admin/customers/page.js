"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import { Plus, Users } from "lucide-react";

const MOCK_CUSTOMERS = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+880 1712 345678", orders: 12, spent: "৳42,500", joined: "Mar 2024", tier: "Gold" },
  { id: 2, name: "Sarah Smith", email: "sarah@example.com", phone: "+880 1612 987654", orders: 5, spent: "৳12,100", joined: "Jan 2025", tier: "Silver" },
  { id: 3, name: "Rahim Ahmed", email: "rahim@example.com", phone: "+880 1812 112233", orders: 1, spent: "৳2,450", joined: "Feb 2025", tier: "New" },
];

const COLUMNS = [
  { key: "name", label: "Customer", type: "text" },
  { key: "email", label: "Email", type: "text" },
  { key: "orders", label: "Orders", type: "text" },
  { key: "spent", label: "Expenditure", type: "text" },
  { key: "tier", label: "Level", type: "status" },
  { key: "joined", label: "Joined", type: "text" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", active: true }
        ]}
        title="Customers" 
        icon={Users}
        primaryAction={{
          label: "Add Customer",
          icon: Plus,
          onClick: () => console.log("Add Customer")
        }}
      />
      
      <DataTable 
        columns={COLUMNS}
        data={MOCK_CUSTOMERS}
      />
    </div>
  );
}
