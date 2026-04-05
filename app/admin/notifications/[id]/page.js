"use client";
import React from "react";
import { 
  Bell, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Zap, 
  ArrowRight, 
  Activity, 
  Clock, 
  Database,
  Shield,
  CornerUpLeft,
  X
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

const MOCK_NOTIFICATION = {
  id: "1",
  type: "Inventory",
  title: "Low Stock Alert: Xiroo™ LED Cap Lamp",
  message: "Stock level for SKU: XR-LMP-01 has dropped below the threshold of 5 units (Current: 3). Immediate restocking is advised to maintain operational velocity.",
  time: "1 hour ago",
  source: "Inventory Engine v2.4",
  impact: "Medium - Potential lost sales if not restocked within 24 hours.",
  data: {
    sku: "XR-LMP-01",
    current_stock: 3,
    reorder_point: 5,
    last_restock: "2026-03-10",
    supplier: "Xiroo Global Logistics"
  }
};

export default function NotificationDetail() {
  const router = useRouter();
  const { id } = useParams();

  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  
  return (
    <div className="fixed inset-0 top-0 left-0 lg:left-64 bg-white flex overflow-hidden font-montserrat antialiased select-none z-50">
      {/* Main Diagnostic Hub */}
      <div className="flex-1 flex flex-col bg-[#F7F7F5] relative border-r border-[#EDECE9] overflow-y-auto custom-scrollbar">
        {/* Boutique Header */}
        <div className="bg-white border-b border-[#EDECE9] p-8 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#37352F80] hover:text-black transition-colors group"
            >
              <CornerUpLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Back to Pulse
            </button>
            <button 
              onClick={() => setIsInfoOpen(true)}
              className="lg:hidden p-2 text-[#37352F80] hover:text-black transition-colors"
            >
              <Activity size={18} />
            </button>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-[20px] md:text-[26px] font-bold text-black tracking-tight leading-none uppercase">
                Diagnostic Analysis
              </h1>
              <p className="text-[10px] md:text-[11px] text-[#37352F] font-bold tracking-wide opacity-80">
                Intelligence ID: <span className="text-black">XRO-NOTIF-00{id || "1"}</span>
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center rounded-none shadow-xl shadow-black/10">
              <Bell className="w-[18px] h-[18px] md:w-5 md:h-5" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Content Stream */}
        <div className="p-4 md:p-10 space-y-8 md:space-y-10 max-w-5xl mx-auto w-full">
          <div className="bg-white border border-[#EDECE9] rounded-none p-6 md:p-10 space-y-10 md:space-y-16 relative overflow-hidden shadow-sm shadow-black/5">
             {/* Aesthetic Accent */}
             <div className="absolute top-0 right-0 p-6 opacity-[0.02]">
                <Shield size={140} />
             </div>

             {/* Incident Summary */}
             <div className="space-y-6 relative z-10">
               <div className="flex items-start gap-5">
                 <div className="w-12 h-12 bg-red-50 flex items-center justify-center rounded-none border border-red-100 shrink-0">
                   <AlertCircle size={24} className="text-red-700" strokeWidth={1.5} />
                 </div>
                 <div className="space-y-1 pt-0.5">
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-700">Priority Critical</span>
                     <span className="w-1 h-1 bg-[#EDECE9] rounded-full" />
                     <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#37352F80]">{MOCK_NOTIFICATION.time}</span>
                   </div>
                   <h2 className="text-[18px] md:text-[22px] font-bold text-black tracking-tight leading-tight">{MOCK_NOTIFICATION.title}</h2>
                 </div>
               </div>
               <p className="text-[13px] md:text-[14px] leading-relaxed text-[#37352F] font-bold max-w-3xl border-l-[3px] border-black pl-5 md:pl-8 ml-2 opacity-90">
                 {MOCK_NOTIFICATION.message}
               </p>
             </div>

             {/* Diagnostic Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 border-t border-[#EDECE9] pt-8 md:pt-12 relative z-10">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-3 text-[#37352F80]">
                    <Database size={14} />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Source Engine</span>
                  </div>
                  <p className="text-[14px] md:text-[16px] font-bold text-black leading-none">{MOCK_NOTIFICATION.source}</p>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center gap-3 text-[#37352F80]">
                    <Activity size={14} />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Operational Impact</span>
                  </div>
                  <p className="text-[13px] md:text-[15px] font-bold text-black leading-relaxed">{MOCK_NOTIFICATION.impact}</p>
                </div>
             </div>

             {/* Technical Registry Data */}
             <div className="bg-[#F7F7F5] border-y border-[#EDECE9] -mx-6 md:-mx-10 p-6 md:p-10 relative z-10">
                <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 border-b border-[#EDECE9]">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-black">Payload Diagnostic Registry</span>
                  <Database size={14} className="text-[#37352F40]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                   {Object.entries(MOCK_NOTIFICATION.data).map(([key, value]) => (
                     <div key={key} className="space-y-2">
                       <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#37352F80]">{key.replace('_', ' ')}</span>
                       <div className="p-2 md:p-2.5 bg-white border border-[#EDECE9] font-mono text-[11px] md:text-[12px] font-bold text-black shadow-sm">
                         {String(value)}
                       </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Footer Interaction */}
             <div className="pt-2 relative z-10">
                <Button 
                   onClick={() => router.push(`/admin/products/${MOCK_NOTIFICATION.data.sku}`)}
                   className="bg-black text-white px-6 md:px-10 h-12 rounded-none text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-4 hover:shadow-2xl shadow-black/10 transition-all active:scale-95 w-full md:w-auto justify-center"
                >
                   Inspect Registry <ArrowRight size={16} />
                </Button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isInfoOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden animate-in fade-in transition-opacity"
          onClick={() => setIsInfoOpen(false)}
        />
      )}

      {/* Right Sidebar: Operational Diagnostics */}
      <div className={`
        fixed lg:sticky top-0 right-0 lg:right-auto z-50 lg:z-auto
        w-[320px] md:w-[340px] h-screen
        border-l border-[#EDECE9] flex flex-col bg-white overflow-y-auto custom-scrollbar
        transition-transform duration-300 ease-in-out
        ${isInfoOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsInfoOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-[#37352F40] hover:text-black transition-colors"
        >
          <X size={18} />
        </button>

        {/* Core Identity / Source */}
        <div className="p-8 md:p-10 text-center space-y-4 md:space-y-6 border-b border-[#EDECE9] bg-[#F7F7F5]/40">
           <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-[#EDECE9] flex items-center justify-center mx-auto shadow-2xl shadow-black/5 shrink-0">
              <Shield className="w-[22px] h-[22px] md:w-6 md:h-6" strokeWidth={1.5} />
           </div>
           <div className="space-y-1.5">
              <h3 className="text-[14px] md:text-[16px] font-bold text-black tracking-tight leading-none uppercase">Xiroo Core</h3>
              <p className="text-[9px] md:text-[10px] text-[#37352F80] font-bold uppercase tracking-widest leading-none">Security Origin 01</p>
           </div>
        </div>

        {/* Resolution Suite */}
        <div className="p-8 space-y-10 flex-1">
           <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#37352F80]">Resolution Hub</h4>
              <div className="space-y-2.5">
                {[
                  { label: "Mark as Fixed", icon: CheckCircle2, color: "text-green-700", bg: "hover:bg-green-50" },
                  { label: "Snooze Intelligence", icon: Clock, color: "text-blue-700", bg: "hover:bg-blue-50" },
                  { label: "Purge permanent", icon: Trash2, color: "text-red-700", bg: "hover:bg-red-50" }
                ].map((action, idx) => (
                  <button 
                    key={idx}
                    className={`w-full bg-white p-4 text-left border border-[#EDECE9] rounded-none hover:border-black transition-all flex items-center justify-between group ${action.bg}`}
                  >
                    <div className="flex items-center gap-4">
                      <action.icon size={16} className={action.color} />
                      <span className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">{action.label}</span>
                    </div>
                    <Zap size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#37352F80]" />
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-6 pt-10 border-t border-[#EDECE9]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#37352F80]">Core Health</h4>
              <div className="bg-black text-white p-6 rounded-none space-y-6 relative overflow-hidden shadow-2xl shadow-black/20 text-center">
                 <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Activity size={60} />
                 </div>
                 <div className="space-y-3 relative z-10">
                    <div className="flex items-end justify-center gap-4">
                       <span className="text-[28px] font-bold tracking-tighter leading-none">98.4%</span>
                       <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-400 mb-0.5 flex items-center gap-1.5 animate-pulse">
                          <div className="w-1 h-1 bg-green-400 rounded-full" />
                          Optimal
                       </span>
                    </div>
                    <div className="w-full h-0.5 bg-white/10 rounded-none overflow-hidden">
                       <div className="w-[98.4%] h-full bg-white" />
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                       Systems synchronized and operational.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Audit Disclaimer */}
        <div className="p-6 border-t border-[#EDECE9] bg-[#F7F7F5]/40">
           <p className="text-[9px] text-[#37352F80] leading-relaxed italic font-bold text-center uppercase tracking-widest opacity-60">
             * Administrative Audit Tracking Active
           </p>
        </div>
      </div>
    </div>
  );
}
