"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { User, Mail, Phone, MapPin, Shield, Calendar, CreditCard } from "lucide-react";

export default function CustomerForm({ initialData = {}, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    tier: initialData.tier || "New",
    status: initialData.status || "Active",
    ...initialData
  });

  const TIER_OPTIONS = [
    { value: "New", label: "New Registry" },
    { value: "Silver", label: "Silver Tier" },
    { value: "Gold", label: "Gold Tier" },
    { value: "Platinum", label: "Platinum Elite" },
  ];

  const STATUS_OPTIONS = [
    { value: "Active", label: "Active Account" },
    { value: "Inactive", label: "Deactivated" },
    { value: "Flagged", label: "Risk Flagged" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Identity & Contact */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <User size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Identity & Contact
              </h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Full Legal Name</label>
                <div className="relative group">
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                    placeholder="Enter customer name"
                    required
                  />
                  <User size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Email Address</label>
                  <div className="relative group">
                    <input 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                      placeholder="customer@example.com"
                      required
                    />
                    <Mail size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Phone Pipeline</label>
                  <div className="relative group">
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                      placeholder="+880 1XXX XXXXXX"
                    />
                    <Phone size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Shipping Registry Address</label>
                <div className="relative group">
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 resize-none"
                    placeholder="Enter full shipping logic..."
                  />
                  <MapPin size={14} className="absolute left-6 top-8 text-zinc-300 group-focus-within:text-black transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governance & Logistics */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Shield size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Governance & Logistics
              </h3>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Customer Tiering</label>
                  <Select 
                    options={TIER_OPTIONS}
                    value={formData.tier}
                    onChange={(val) => setFormData(prev => ({ ...prev, tier: val }))}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Account Status</label>
                  <Select 
                    options={STATUS_OPTIONS}
                    value={formData.status}
                    onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                  />
                </div>
              </div>

              {/* Read-only Insights */}
              <div className="pt-8 border-t border-gray-50 grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={12} className="text-zinc-300" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Lifetime Value</span>
                  </div>
                  <p className="text-[14px] font-bold tracking-tighter text-black">{formData.spent || "৳0.00"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-zinc-300" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Joined</span>
                  </div>
                  <p className="text-[14px] font-bold tracking-tighter text-black">{formData.joined || "New"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-[11px] font-bold uppercase tracking-[0.3em] rounded-none shadow-none"
              disabled={isLoading}
            >
              {isLoading ? "Synchronizing..." : initialData.id ? "Update Profile" : "Recruit Customer"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-14 text-[11px] font-bold uppercase tracking-[0.3em] rounded-none border-gray-100"
              onClick={() => window.history.back()}
            >
              Acknowledge & Return
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
