"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import CustomerForm from "@/components/admin/customers/CustomerForm";
import DataTable from "@/components/admin/shared/DataTable";
import { User, ShoppingBag, Clock, ShieldCheck } from "lucide-react";

const MOCK_DETAIL = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "+880 1712 345678",
  address: "Block A, House 42, Road 7, Banani, Dhaka 1213",
  orders: 12,
  spent: "৳42,500",
  joined: "14 Mar 2024",
  tier: "Gold",
  status: "Active"
};

const ORDER_HISTORY = [
  { id: "#ORD-8512", date: "22 Mar 2024", total: "৳12,500", status: "Delivered", items: 3 },
  { id: "#ORD-8409", date: "10 Feb 2024", total: "৳8,200", status: "Delivered", items: 2 },
  { id: "#ORD-8215", date: "15 Jan 2024", total: "৳21,800", status: "Delivered", items: 7 },
];

const ORDER_COLUMNS = [
  { key: "id", label: "Registry ID", type: "text" },
  { key: "date", label: "Transaction Date", type: "text" },
  { key: "items", label: "Volume", type: "text" },
  { key: "total", label: "Expenditure", type: "text" },
  { key: "status", label: "Logistics State", type: "status" },
];

export default function CustomerDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    // Simulate async API fetch
    const timer = setTimeout(() => {
      setCustomer(MOCK_DETAIL);
    }, 100);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    console.log("Updating Identity:", data);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/customers");
    }, 1500);
  };

  if (!customer) return null;

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          { label: "Profile Refinement", active: true }
        ]}
        title="Identity Analysis" 
        icon={User}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
        <div className="xl:col-span-8 space-y-16">
          <section className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <ShieldCheck size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Identity Profile
              </h3>
            </div>
            <CustomerForm 
              initialData={customer}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Clock size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Transactional Lineage
              </h3>
            </div>
            <div className="border border-gray-50 bg-white p-1">
              <DataTable 
                columns={ORDER_COLUMNS}
                data={ORDER_HISTORY}
              />
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 space-y-10">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <ShoppingBag size={16} className="text-zinc-300" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
              Market Intelligence
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-8 bg-[#FDFDFB] border border-gray-100 space-y-2">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Lifetime Liquidity</p>
              <p className="text-[24px] font-bold tracking-tighter text-black">{customer.spent}</p>
            </div>
            
            <div className="p-8 bg-white border border-gray-50 space-y-2">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Order Frequency</p>
              <p className="text-[24px] font-bold tracking-tighter text-zinc-400">{customer.orders} <span className="text-[11px] uppercase tracking-widest font-medium ml-1">Transactions</span></p>
            </div>

            <div className="p-8 bg-black space-y-2">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Reward Tier</p>
              <div className="flex items-center justify-between">
                <p className="text-[20px] font-bold tracking-[0.2em] text-white uppercase">{customer.tier}</p>
                <div className="w-8 h-8 rounded-none border border-zinc-800 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
