"use client";

import { Save, User, Shield, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <User className="w-5 h-5 text-black stroke-[1.5]" />
          <h2 className="text-xl font-montserrat font-semibold">Public Profile</h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="space-y-3 group">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-black transition-colors">First Name</label>
            <input 
              type="text" 
              defaultValue="Mezanur" 
              className="w-full h-14 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none px-6 text-sm font-medium transition-all"
            />
          </div>
          <div className="space-y-3 group">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-black transition-colors">Last Name</label>
            <input 
              type="text" 
              defaultValue="Rahman" 
              className="w-full h-14 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none px-6 text-sm font-medium transition-all"
            />
          </div>
          <div className="space-y-3 group md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-black transition-colors">Email Address</label>
            <input 
              type="email" 
              defaultValue="mezan@xiroo.com" 
              className="w-full h-14 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none px-6 text-sm font-medium transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <Button variant="primary" className="px-10 h-14">
              <Save className="w-4 h-4 mr-3" />
              UPDATE PROFILE
            </Button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <Shield className="w-5 h-5 text-black stroke-[1.5]" />
          <h2 className="text-xl font-montserrat font-semibold">Security Secret</h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div className="space-y-3 group">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-black transition-colors">Current Secret</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-14 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none px-6 text-sm font-medium transition-all"
            />
          </div>
          <div className="space-y-3 group">
            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-focus-within:text-black transition-colors">New Secret</label>
            <input 
              type="password" 
              placeholder="Minimum 8 characters" 
              className="w-full h-14 bg-gray-50 border border-transparent focus:border-black focus:bg-white outline-none px-6 text-sm font-medium transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <Button variant="outline" className="px-10 h-14">
              CHANGE SECRET
            </Button>
          </div>
        </form>
      </div>

      {/* Notifications Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <Bell className="w-5 h-5 text-black stroke-[1.5]" />
          <h2 className="text-xl font-montserrat font-semibold">Communications</h2>
        </div>
        
        <div className="bg-gray-50/50 border border-gray-100 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-bold text-black uppercase tracking-wider mb-1">Stock Alerts</p>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium italic">Notify me when wishlist items are back</p>
            </div>
            <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100 flex justify-between items-center italic">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">Last updated: 2 hours ago</p>
        <button className="text-[10px] text-red-300 hover:text-red-500 font-bold uppercase tracking-[0.3em] transition-colors">Delete Account Permanently</button>
      </div>
    </div>
  );
}
