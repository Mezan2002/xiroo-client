"use client";
import React, { useState, useEffect } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import {
  ArrowUpRight,
  BarChart3,
  Clock,
  ExternalLink,
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  Zap,
  Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Revenue", value: "৳0", icon: TrendingUp, key: "totalRevenue" },
    { label: "Total Orders", value: "0", icon: ShoppingBag, key: "totalOrders" },
    { label: "Pending Registry", value: "0", icon: Clock, key: "pending" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiRequest("/orders/stats");
        if (response.success) {
          const data = response.data;
          
          // Map status distribution for pending
          const pendingCount = data.statusDistribution.find(s => s._id === 'pending')?.count || 0;

          setStats([
            { label: "Total Revenue", value: `৳${data.totalRevenue.toLocaleString()}`, icon: TrendingUp },
            { label: "Total Orders", value: data.totalOrders.toString(), icon: ShoppingBag },
            { label: "Pending Registry", value: pendingCount.toString(), icon: Clock },
          ]);
        }
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-12 pb-24">
      <ModuleHeader
        label="System Monitoring"
        title="Dashboard"
        icon={LayoutDashboard}
        tabs={["Overview", "Live", "Reports"]}
      />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-50 animate-pulse border border-black/5"></div>
          ))
        ) : (
          stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative p-8 bg-white border border-black/5 hover:border-black transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <stat.icon size={24} strokeWidth={1.5} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                <h3 className="text-4xl font-extrabold tracking-tight text-black">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Activity feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} /> Recent Activity
            </h3>
            <Button
              variant="ghost"
              icon={ExternalLink}
              className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black"
            >
              View All
            </Button>
          </div>

          <div className="space-y-2">
             <div className="p-12 text-center border-2 border-dashed border-gray-50 italic text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                Activity Feed Synchronizing...
             </div>
          </div>
        </div>

        {/* Live Pulse */}
        <div className="space-y-8">
          <div className="flex items-center border-b border-black/5 pb-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-yellow-500 fill-yellow-500" /> Live
              Store Pulse
            </h3>
          </div>

          <div className="aspect-4/5 bg-black p-8 flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>

            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Active Sessions
              </p>
              <h4 className="text-6xl font-extrabold tracking-tighter">0</h4>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    All systems normal
                  </span>
                </div>
                <BarChart3 size={20} className="text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
