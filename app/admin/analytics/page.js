"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const STATS = [
  { label: "Total Sales", value: "৳8,42,500", change: "+14.2%", up: true, icon: TrendingUp },
  { label: "Conversion Rate", value: "3.24%", change: "+0.8%", up: true, icon: ShoppingBag },
  { label: "Avg. Order Value", value: "৳4,250", change: "-2.1%", up: false, icon: BarChart3 },
  { label: "Sessions", value: "12,482", change: "+18.5%", up: true, icon: Users },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-10 md:space-y-12 pb-24 animate-in fade-in duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Analytics", active: true }
        ]}
        title="Analytics" 
        icon={TrendingUp}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-100 p-6 md:p-8 space-y-4 hover:border-black transition-colors group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                <stat.icon size={20} strokeWidth={1.5} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 uppercase tracking-widest ${
                stat.up ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
              }`}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </div>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <div className="space-y-6">
          <h3 className="text-[12px] font-bold uppercase tracking-widest border-b border-gray-100 pb-4">
            Sales Over Time
          </h3>
          <div className="aspect-video bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
            <BarChart3 size={48} strokeWidth={1} />
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-[12px] font-bold uppercase tracking-widest border-b border-gray-100 pb-4">
            Top Categories
          </h3>
          <div className="aspect-video bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300">
            <TrendingUp size={48} strokeWidth={1} />
          </div>
        </div>
      </div>
    </div>
  );
}
