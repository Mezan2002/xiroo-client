"use client";

import { Save, Shield, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import IdentitySection from "./sections/IdentitySection";
import { useSettingsLogic } from "./sections/useSettingsLogic";

export default function SettingsPage() {
  const { currentUser, lastUpdated, isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteAccount, handleProfileUpdate, handleAvatarUpload } = useSettingsLogic();

  if (!currentUser) return null;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            <span className="w-8 h-px bg-gray-200" />Profile Preferences
          </div>
          <h2 className="text-4xl font-montserrat font-bold text-black uppercase tracking-tight">Account Discovery</h2>
          <p className="text-[13px] text-gray-400 font-medium">Registry synchronized: <span className="text-black italic">{lastUpdated}</span></p>
        </div>
        <Link href="/account/loyalty"><Button variant="outline" className="rounded-none border-gray-200 text-[10px] tracking-widest px-8 h-12 hover:bg-black hover:text-white transition-all duration-500">VIEW PRESTIGE</Button></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <IdentitySection currentUser={currentUser} handleAvatarUpload={handleAvatarUpload} />

        <div className="lg:col-span-8">
          <form onSubmit={handleProfileUpdate} className="space-y-12 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">First Name</label><input name="firstName" defaultValue={currentUser.firstName} className="w-full h-14 bg-gray-50 border border-gray-100 px-6 text-[13px] font-medium focus:bg-white focus:border-black transition-all outline-none" /></div>
              <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Last Name</label><input name="lastName" defaultValue={currentUser.lastName} className="w-full h-14 bg-gray-50 border border-gray-100 px-6 text-[13px] font-medium focus:bg-white focus:border-black transition-all outline-none" /></div>
              <div className="space-y-3"><div className="flex justify-between"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</label><span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest italic">Verified</span></div><input defaultValue={currentUser.email} disabled className="w-full h-14 bg-gray-50 border border-gray-100 px-6 text-[13px] font-medium opacity-50 cursor-not-allowed" /></div>
              <div className="space-y-3"><label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Phone Registry</label><div className="relative"><span className="absolute left-6 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400 border-r border-gray-200 pr-3">+880</span><input name="phoneNumber" defaultValue={currentUser.phoneNumber?.replace("+880", "")} className="w-full h-14 bg-gray-50 border border-gray-100 pl-20 pr-6 text-[13px] font-medium focus:bg-white focus:border-black transition-all outline-none" placeholder="1XXXXXXXXX" /></div></div>
            </div>
            <Button type="submit" className="bg-black text-white hover:bg-zinc-800 px-12 h-14 tracking-widest font-bold uppercase text-[11px] group transition-all"><span className="flex items-center gap-3">SAVE REGISTRY <Save size={14} className="group-hover:translate-x-1 transition-transform" /></span></Button>
          </form>

          <div className="mt-24 pt-16 border-t border-gray-100 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3"><Shield className="w-5 h-5 text-black" /><h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-black">Security Protocol</h3></div>
              <p className="text-[13px] text-gray-500 max-w-lg leading-relaxed">Platform security is our highest priority. Termination is irreversible.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="p-8 border border-gray-100 bg-gray-50/50 space-y-6"><div className="flex items-center gap-3"><Bell size={16} className="text-gray-400" /><h4 className="text-[11px] font-bold uppercase tracking-widest">Notification Engine</h4></div><p className="text-[12px] text-gray-400 font-medium">Configure boutique communications.</p><Button variant="outline" className="w-full h-12 text-[10px] tracking-widest border-gray-200">CONFIGURE ENGINE</Button></div>
               <div className="p-8 border border-red-50 bg-red-50/10 space-y-6"><h4 className="text-[11px] font-bold uppercase tracking-widest text-red-900">Danger Zone</h4><p className="text-[12px] text-gray-400 font-medium">Purge your digital footprint from the registry.</p><Button onClick={() => setIsDeleteModalOpen(true)} variant="outline" className="w-full h-12 text-[10px] tracking-widest border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all">TERMINATE ACCOUNT</Button></div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteAccount} title="TERMINATE ACCOUNT REGISTRY" message="This action is irreversible. All accumulated prestige points and identification will be permanently purged." />
    </div>
  );
}
