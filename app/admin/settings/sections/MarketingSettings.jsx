"use client";
import React, { useEffect, useState } from "react";
import { 
  Shield, CheckCircle2, Globe, Server, 
  Activity, BarChart2, RefreshCw 
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/hooks/useToast";

export default function MarketingSettings() {
  const [settings, setSettings] = useState({
    pixelId: "",
    isEnabled: false,
    isPixelIdManaged: false,
    isTokenManaged: false,
  });
  const [stats, setStats] = useState({ stats: [], summary: [] });
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const ts = Date.now();
      const [settingsRes, statsRes, logsRes] = await Promise.all([
        axiosInstance.get(`/marketing?ts=${ts}`),
        axiosInstance.get(`/marketing/stats?ts=${ts}`),
        axiosInstance.get(`/marketing/logs?ts=${ts}`),
      ]);
      
      if (settingsRes.data.data) setSettings(settingsRes.data.data);
      if (statsRes.data.data) setStats(statsRes.data.data);
      if (logsRes.data.data) setLogs(logsRes.data.data);
    } catch (error) {
      toast.error("Telemetry synchronization failed");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-4 h-4 bg-black animate-ping rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 font-montserrat">
      {/* Infrastructure Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40">Infrastructure Status</h3>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${settings.isEnabled ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
            <span className="text-sm font-bold uppercase tracking-tight">
              {settings.isEnabled ? "Secure Tracking Active" : "Tracking Engine Offline"}
            </span>
          </div>
        </div>
        
        <button 
          onClick={fetchData}
          className="group flex items-center gap-3 px-6 py-3 bg-white border border-[#EDECE9] hover:border-black transition-all"
        >
          <RefreshCw className={`w-3 h-3 text-black/40 group-hover:text-black transition-all ${isRefreshing ? "animate-spin" : ""}`} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black">Refresh Registry</span>
        </button>
      </div>

      {/* KPI Overview - Clean & Minimal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: "Page Views", key: "PageView" },
          { label: "Product Views", key: "ViewContent" },
          { label: "Add to Bag", key: "AddToCart" },
          { label: "Success Orders", key: "Purchase" },
        ].map((kpi, i) => {
          const value = stats.summary.find(s => s._id === kpi.key)?.total || 0;
          return (
            <div key={i} className="space-y-3 p-6 border border-[#EDECE9] bg-[#F9F9F8]/30">
              <p className="text-[9px] font-bold text-black/40 uppercase tracking-[0.3em]">{kpi.label}</p>
              <h4 className="text-3xl font-black tracking-tighter">{value.toLocaleString()}</h4>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Logs */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 flex items-center gap-3">
              <Activity className="w-3 h-3" /> Real-time Tracking Registry
            </h3>
          </div>

          <div className="border border-[#EDECE9] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9F9F8] border-b border-[#EDECE9]">
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Event Protocol</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Source</th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-black/40">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDECE9]">
                {logs.length > 0 ? logs.map((log, i) => (
                  <tr key={i} className="hover:bg-[#F9F9F8]/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold uppercase tracking-widest">{log.eventName}</span>
                        <span className="text-[8px] font-bold text-black/30 uppercase tracking-tighter truncate max-w-[200px]">
                          {log.url?.split('/').pop() || "System Root"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {log.source === "browser" ? <Globe className="w-3 h-3 opacity-20" /> : <Server className="w-3 h-3 opacity-20" />}
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">{log.source}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-medium text-black/40 uppercase">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-20 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-black/20 italic">
                      Awaiting telemetry signals...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Config Details */}
        <div className="lg:col-span-4 space-y-12">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/40 flex items-center gap-3">
              <Shield className="w-3 h-3" /> Security Architecture
            </h3>
            
            <div className="space-y-6">
              <div className="p-6 border border-[#EDECE9] bg-[#F9F9F8]/30 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Meta Pixel ID</p>
                    <p className="text-xs font-bold tracking-tight">
                      {settings.isPixelIdManaged 
                        ? (settings.pixelId ? `•••••••••••${settings.pixelId.slice(-4)}` : "Protected") 
                        : (settings.pixelId || "None")}
                    </p>
                  </div>
                  {settings.isPixelIdManaged && <div className="p-1 bg-black text-white rounded"><Shield className="w-3 h-3" /></div>}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${settings.isPixelIdManaged ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest ${settings.isPixelIdManaged ? "text-green-600" : "text-black/40"}`}>
                    {settings.isPixelIdManaged ? "Environment Protected" : "Manual Config"}
                  </span>
                </div>
              </div>

              <div className="p-6 border border-[#EDECE9] bg-[#F9F9F8]/30 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">Conversions API</p>
                    <p className="text-xs font-bold tracking-tight">{settings.isTokenManaged ? "Securely Encrypted" : "Credentials Missing"}</p>
                  </div>
                  {settings.isTokenManaged && <div className="p-1 bg-black text-white rounded"><Shield className="w-3 h-3" /></div>}
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${settings.isTokenManaged ? "bg-green-500" : "bg-red-500"}`} />
                  <span className={`text-[8px] font-black uppercase tracking-widest ${settings.isTokenManaged ? "text-green-600" : "text-red-500"}`}>
                    {settings.isTokenManaged ? "Server-side Relay Active" : "Credentials Missing"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-black text-white space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Sync</h4>
            <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-widest">
              Events are synchronized across Browser and Server layers automatically. 
            </p>
            <a 
              href="https://business.facebook.com/events_manager2" 
              target="_blank"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-white/20 pb-1 hover:border-white transition-all"
            >
              Open Meta Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
