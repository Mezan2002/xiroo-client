"use client";
import React, { useEffect, useState } from "react";
import { Facebook, Shield, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/hooks/useToast";

export default function MarketingSettings() {
  const [settings, setSettings] = useState({
    pixelId: "",
    accessToken: "",
    testEventCode: "",
    isEnabled: false,
    isPixelIdManaged: false,
    isTokenManaged: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axiosInstance.get("/marketing");
        if (data.data) {
          setSettings({
            ...data.data,
            isPixelIdManaged: !!process.env.NEXT_PUBLIC_FB_PIXEL_ID,
            isTokenManaged: data.data.accessToken === "********************",
          });
        }
      } catch (error) {
        toast.error("Failed to fetch marketing settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.patch("/marketing", settings);
      toast.success("Marketing settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Facebook className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-black uppercase">
              Meta Integration
            </h2>
          </div>
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest max-w-md">
            Configure Facebook Pixel and Conversions API (CAPI) to track customer behavior and optimize ad performance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${settings.isEnabled ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
            {settings.isEnabled ? (
              <><CheckCircle2 className="w-3 h-3" /> System Active</>
            ) : (
              <><AlertTriangle className="w-3 h-3" /> System Inactive</>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Settings Form */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-6">
            {/* Pixel ID Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Pixel ID
                </label>
                {settings.isPixelIdManaged && (
                  <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                    Managed by ENV
                  </span>
                )}
              </div>
              <input
                type="text"
                value={process.env.NEXT_PUBLIC_FB_PIXEL_ID || settings.pixelId}
                onChange={(e) => setSettings({ ...settings, pixelId: e.target.value })}
                placeholder="e.g. 123456789012345"
                disabled={!!process.env.NEXT_PUBLIC_FB_PIXEL_ID}
                className={`w-full h-14 bg-gray-50 border-none px-6 text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none ${process.env.NEXT_PUBLIC_FB_PIXEL_ID ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* CAPI Token Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  CAPI Access Token
                </label>
                {settings.isTokenManaged && (
                  <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                    Securely Managed in ENV
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  value={settings.accessToken}
                  onChange={(e) => setSettings({ ...settings, accessToken: e.target.value })}
                  placeholder="EAAB..."
                  rows={4}
                  disabled={settings.isTokenManaged}
                  className={`w-full bg-gray-50 border-none p-6 text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none resize-none ${settings.isTokenManaged ? "opacity-50 cursor-not-allowed font-mono" : ""}`}
                />
                <Shield className={`absolute top-6 right-6 w-5 h-5 transition-colors ${settings.isTokenManaged ? "text-green-500" : "text-gray-300 pointer-events-none"}`} />
              </div>
            </div>

            {/* Test Event Code Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Test Event Code (Optional)
                </label>
                <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest cursor-help underline">
                  How to find?
                </span>
              </div>
              <input
                type="text"
                value={settings.testEventCode}
                onChange={(e) => setSettings({ ...settings, testEventCode: e.target.value })}
                placeholder="TEST12345"
                className="w-full h-14 bg-gray-50 border-none px-6 text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none"
              />
              <p className="text-[9px] text-gray-400 italic">
                Used to verify server events in Facebook Events Manager Test Events tab.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="pt-4">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.isEnabled}
                    onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                </div>
                <span className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.2em] group-hover:text-black transition-colors">
                  Enable Facebook Tracking
                </span>
              </label>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full md:w-auto h-14 px-12 bg-black text-white text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            {isSaving ? "Synchronizing..." : "Update Marketing Stack"}
          </Button>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-black text-white space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em]">
              Overview Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Pixel Status</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${settings.pixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID ? "text-green-400" : "text-yellow-400"}`}>
                  {settings.pixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID ? "Configured" : "Missing ID"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">CAPI Status</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${settings.accessToken ? "text-green-400" : "text-red-400"}`}>
                  {settings.accessToken ? "Ready" : "No Token"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Events Monitored</span>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">5 Core Events</span>
              </div>
            </div>
            
            <div className="pt-4">
              <a 
                href="https://business.facebook.com/events_manager2" 
                target="_blank" 
                className="flex items-center justify-center gap-3 w-full py-4 border border-white/20 hover:bg-white hover:text-black transition-all text-[10px] font-bold uppercase tracking-[0.2em]"
              >
                Open Events Manager <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-8 border border-gray-100 space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest">Best Practices</h4>
            <ul className="space-y-3">
              {[
                "Use the same Pixel ID for both Browser and Server (CAPI).",
                "Ensure CAPI Access Token has full 'Event Management' permissions.",
                "Always use 'Test Event Code' when verifying setup.",
                "Data is hashed (SHA256) automatically before transmission."
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[10px] text-gray-500 leading-relaxed">
                  <span className="text-black font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
