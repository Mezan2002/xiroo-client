"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { User, Mail, Phone, MapPin, Shield, Calendar, CreditCard } from "lucide-react";

export default function UserForm({ initialData = {}, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    email: initialData.email || "",
    phoneNumber: initialData.phoneNumber || "",
    role: initialData.role || "customer",
    status: initialData.status || "active",
    ...initialData
  });

  const ROLE_OPTIONS = [
    { value: "customer", label: "Customer Base" },
    { value: "admin", label: "Administrative Registry" },
  ];

  const STATUS_OPTIONS = [
    { value: "active", label: "Active Account" },
    { value: "blocked", label: "Blocked / Restricted" },
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
                Identity Profile
              </h3>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">First Name</label>
                  <div className="relative group">
                    <input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                      placeholder="Enter first name"
                      required
                    />
                    <User size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Last Name</label>
                  <div className="relative group">
                    <input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                      placeholder="Enter last name"
                      required
                    />
                    <User size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
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
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12 disabled:opacity-50"
                      placeholder="user@example.com"
                      required
                      disabled={initialData._id} // Prevent email modification for existing users in this view
                    />
                    <Mail size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Phone Number</label>
                  <div className="relative group">
                    <input 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                      placeholder="+880 1XXX XXXXXX"
                    />
                    <Phone size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Shield size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Security & Access
              </h3>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Membership Tier</label>
                  <Select 
                    options={[
                      { value: "bronze", label: "Bronze Member Registry" },
                      { value: "silver", label: "Silver Star Patron" },
                      { value: "gold", label: "Gold Sovereign Elite" },
                      { value: "platinum", label: "Platinum Legacy Tier" },
                      { value: "diamond", label: "Diamond Obsidian Absolute" },
                    ]}
                    value={formData.tier || "bronze"}
                    onChange={(val) => setFormData(prev => ({ ...prev, tier: val }))}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Loyalty Points</label>
                  <div className="relative group">
                    <input 
                      name="points"
                      type="number"
                      value={formData.points || 10}
                      onChange={handleChange}
                      className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[13px] font-bold tracking-widest pl-12"
                    />
                    <CreditCard size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Access Clearance</label>
                  <Select 
                    options={ROLE_OPTIONS}
                    value={formData.role}
                    onChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Account State</label>
                  <Select 
                    options={STATUS_OPTIONS}
                    value={formData.status}
                    onChange={(val) => setFormData(prev => ({ ...prev, status: val }))}
                  />
                </div>
              </div>

              {/* Security Badge */}
              <div className="pt-8 border-t border-gray-50 flex items-center gap-4 bg-gray-50/50 p-6">
                <Shield size={20} className="text-emerald-500 text-opacity-80" />
                <div>
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest">Protocol Verified</p>
                  <p className="text-[9px] text-gray-400 font-medium">Standard encryption laws applied.</p>
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
              {isLoading ? "Synchronizing..." : initialData._id ? "Update Profile" : "Create User Registry"}
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
