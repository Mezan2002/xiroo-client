"use client";
import React, { useState } from "react";
import { Plus, Users, Search, Filter, Flag, Edit, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

const MOCK_CUSTOMERS = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+880 1712 345678", orders: 12, spent: "৳42,500", joined: "Mar 2024", status: "Active", tier: "Gold" },
  { id: "2", name: "Sarah Smith", email: "sarah@example.com", phone: "+880 1612 987654", orders: 5, spent: "৳12,100", joined: "Jan 2025", status: "Active", tier: "Silver" },
  { id: "3", name: "Rahim Ahmed", email: "rahim@example.com", phone: "+880 1812 112233", orders: 1, spent: "৳2,450", joined: "Feb 2025", status: "New", tier: "New" },
  { id: "4", name: "Emma Wilson", email: "emma.w@example.com", phone: "+880 1912 445566", orders: 42, spent: "৳158,200", joined: "Nov 2023", status: "Active", tier: "Platinum" },
  { id: "5", name: "Arif Khan", email: "arif@example.com", phone: "+880 1512 778899", orders: 0, spent: "৳0", joined: "Mar 2025", status: "Pending", tier: "New" },
];

export default function AdminCustomers() {
  const router = useRouter();
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const COLUMNS = [
    { 
      key: "name", 
      label: "Customer", 
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[#37352F]">{item.name}</span>
          <span className="text-[11px] text-[#37352F80]">{item.email}</span>
        </div>
      )
    },
    { key: "phone", label: "Contact", type: "text" },
    { key: "orders", label: "Orders", type: "text" },
    { key: "spent", label: "Total Spent", type: "text" },
    { key: "status", label: "Status", type: "status" },
    { 
      key: "tier", 
      label: "Tier", 
      render: (item) => (
        <span className={`text-[12px] font-medium ${
          item.tier === 'Platinum' ? 'text-black font-bold' : 
          item.tier === 'Gold' ? 'text-amber-600' :
          item.tier === 'Silver' ? 'text-zinc-500' : 'text-zinc-400'
        }`}>
          {item.tier}
        </span>
      )
    },
    { 
      key: "actions", 
      label: "", 
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => console.log("Flagging customer:", item.id)}
            className="p-2 text-[#37352F30] hover:text-red-500 transition-colors" 
            title="Flag for Review"
          >
            <Flag size={14} />
          </button>
          <button 
            onClick={() => router.push(`/admin/customers/${item.id}`)}
            className="p-2 text-[#37352F30] hover:text-[#37352F] transition-colors" 
            title="Edit Identity"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={() => {
              setSelectedCustomer(item);
              setIsDeleteModalOpen(true);
            }}
            className="p-2 text-[#37352F30] hover:text-red-600 transition-colors" 
            title="Remove Record"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={() => router.push(`/admin/customers/${item.id}`)}
            className="p-2 text-[#37352F30] hover:text-[#37352F] transition-colors" 
            title="View Analysis"
          >
            <ExternalLink size={14} />
          </button>
        </div>
      )
    },
  ];

  const handleConfirmDelete = () => {
    setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

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
          onClick: () => router.push("/admin/customers/new")
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#37352F40] group-focus-within:text-[#37352F] transition-colors" />
          <input 
            type="text" 
            placeholder="Search customers..."
            className="w-full bg-white border border-[#EDECE9] rounded-md py-2 pl-9 pr-4 text-[13px] outline-none transition-all focus:bg-[#F7F7F5] focus:border-[#37352F20] placeholder:text-[#37352F80]"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#37352F80] hover:bg-[#F7F7F5] border border-[#EDECE9] rounded-md transition-all">
          <Filter size={14} />
          <span>Filter</span>
        </button>
      </div>
      
      <DataTable 
        columns={COLUMNS}
        data={customers}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Customer?"
        message={`Are you sure you want to remove ${selectedCustomer?.name} from the registry? All associated transactional data will be archived.`}
      />
    </div>
  );
}
