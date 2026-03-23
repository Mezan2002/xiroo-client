"use client";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  BarChart3,
  LayoutDashboard,
  Zap,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";

const STATS = [
  { label: "Total Revenue", value: "৳2,43,500", change: "+12.5%", icon: TrendingUp },
  { label: "Active Orders", value: "48", change: "+4", icon: ShoppingBag },
  { label: "New Customers", value: "124", change: "+18%", icon: Users },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-12 pb-24">
      <ModuleHeader 
        label="System Monitoring" 
        title="Dashboard" 
        icon={LayoutDashboard}
        tabs={["Overview", "Live", "Reports"]}
        primaryAction={{
          label: "Add Product",
          icon: Plus,
          onClick: () => console.log("Add Product")
        }}
      />

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="group relative p-8 bg-white border border-black/5 hover:border-black transition-all cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1">
                <ArrowUpRight size={12} />
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-4xl font-extrabold tracking-tight text-black">{stat.value}</h3>
            </div>
          </div>
        ))}
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
            {[
              { id: "2814", user: "John Doe", action: "placed an order for", item: "String Cap Lamp", time: "2 mins ago", price: "৳2,450" },
              { id: "2813", user: "Sarah Smith", action: "registered as a", item: "new customer", time: "15 mins ago" },
              { id: "2812", user: "Rahim Ahmed", action: "placed an order for", item: "Travel Bottles", time: "1 hour ago", price: "৳12,100" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-6 hover:bg-black/5 transition-all border border-transparent hover:border-black/5 group">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-black/10">
                    {activity.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-black">
                      {activity.user} <span className="font-medium text-black/40">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mt-1">{activity.time}</p>
                  </div>
                </div>
                {activity.price && (
                  <div className="text-right">
                    <p className="text-[13px] font-extrabold text-black">{activity.price}</p>
                    <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Paid via bKash</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Pulse */}
        <div className="space-y-8">
          <div className="flex items-center border-b border-black/5 pb-4">
            <h3 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-yellow-500 fill-yellow-500" /> Live Store Pulse
            </h3>
          </div>
          
          <div className="aspect-4/5 bg-black p-8 flex flex-col justify-between text-white relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Sessions</p>
              <h4 className="text-6xl font-extrabold tracking-tighter">142</h4>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Top Product</p>
                <p className="text-xs font-bold uppercase tracking-tight">Xiroo™ LED Cap Lamp</p>
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">All systems normal</span>
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
