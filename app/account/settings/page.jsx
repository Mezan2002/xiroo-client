"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Save, Shield, User } from "lucide-react";
import Link from "next/link";

import { ImageUploader } from "@/components/shared/ImageUploader";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { apiRequest } from "@/lib/api";

export default function SettingsPage() {
  const { user: currentUser, logout } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 1. Profile Update Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!response.success) throw new Error(response.message || "Update Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile Registry Updated Successfully.");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile data.");
    },
  });

  // 2. Avatar Synchronization Mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (secureUrl) => {
      const response = await apiRequest("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ profileAvatar: secureUrl }),
      });
      if (!response.success) throw new Error(response.message || "Avatar Sync Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile Registry Updated: Avatar Synced.");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to sync avatar structure.");
    },
  });

  // 3. Account Termination Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/users/me", {
        method: "DELETE",
      });
      if (!response.success) throw new Error(response.message || "Termination Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account Registry Terminated Successfully.");
      logout();
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to terminate profile registry.");
    },
  });

  const lastUpdated = currentUser?.updatedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(currentUser.updatedAt))
    : "Recently";

  const handleDeleteAccount = () => deleteAccountMutation.mutate();

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber")
        ? `+880${formData.get("phoneNumber").replace(/\s+/g, "")}`
        : "",
    };

    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== null && v !== "" && v !== undefined,
      ),
    );

    updateProfileMutation.mutate(sanitizedData);
  };

  const handleAvatarUpload = (secureUrl) => uploadAvatarMutation.mutate(secureUrl);

  if (!currentUser) return null;

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-gray-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            <span className="w-8 h-px bg-gray-200" />
            Profile Preferences
          </div>
          <h2 className="text-4xl font-montserrat font-bold text-black uppercase tracking-tight">
            Account Discovery
          </h2>
          <p className="text-[13px] text-gray-400 font-medium">
            Registry synchronized: <span className="text-black italic">{lastUpdated}</span>
          </p>
        </div>
        
        <div className="flex gap-4">
           <Link href="/account/loyalty">
              <Button variant="outline" className="rounded-none border-gray-200 text-[10px] tracking-widest px-8 h-12 hover:bg-black hover:text-white transition-all duration-500">
                 VIEW PRESTIGE
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Identity Section */}
        <div className="lg:col-span-4 space-y-10">
          <div className="sticky top-32 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-black" />
                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-black">Visual Identity</h3>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
                Your avatar serves as your prestige signature across the Xiroo ecosystem. High-fidelity assets are recommended.
              </p>
            </div>

            <div className="relative group inline-block">
               <div className="relative w-48 h-48 border border-gray-100 p-2 bg-white transition-all duration-700 group-hover:border-black">
                  <UserAvatar 
                    user={currentUser} 
                    className="w-full h-full text-4xl" 
                  />
                  <div className="absolute inset-2 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <ImageUploader 
                       onUploadSuccess={handleAvatarUpload}
                       folder="avatars"
                    >
                       <Button variant="ghost" className="text-white text-[10px] font-bold tracking-widest p-0 uppercase hover:bg-transparent">
                          Edit Identity
                       </Button>
                    </ImageUploader>
                  </div>
               </div>
               <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black text-white flex items-center justify-center">
                  <span className="text-[10px] font-bold italic">XO</span>
               </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-8">
          <form onSubmit={handleProfileUpdate} className="space-y-12 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* First Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">First Name</label>
                <input
                  name="firstName"
                  defaultValue={currentUser.firstName}
                  className="w-full h-14 bg-gray-50 border border-gray-100 px-6 text-[13px] font-medium focus:bg-white focus:border-black transition-all outline-hidden rounded-none"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Last Name</label>
                <input
                  name="lastName"
                  defaultValue={currentUser.lastName}
                  className="w-full h-14 bg-gray-50 border border-gray-100 px-6 text-[13px] font-medium focus:bg-white focus:border-black transition-all outline-hidden rounded-none"
                />
              </div>

              {/* Email - Registry Readonly */}
              <div className="space-y-3">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</label>
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest italic">Verified</span>
                 </div>
                <input
                  name="email"
                  defaultValue={currentUser.email}
                  disabled
                  className="w-full h-14 bg-gray-50 border border-gray-100 px-6 text-[13px] font-medium opacity-50 cursor-not-allowed rounded-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Phone Registry</label>
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[13px] font-bold text-gray-400 border-r border-gray-200 pr-3">+880</span>
                   <input
                    name="phoneNumber"
                    defaultValue={currentUser.phoneNumber?.replace("+880", "")}
                    className="w-full h-14 bg-gray-50 border border-gray-100 pl-20 pr-6 text-[13px] font-medium focus:bg-white focus:border-black transition-all outline-hidden rounded-none"
                    placeholder="1XXXXXXXXX"
                   />
                </div>
              </div>
            </div>

            <Button 
               type="submit" 
               disabled={updateProfileMutation.isPending}
               className="bg-black text-white hover:bg-zinc-800 px-12 h-14 tracking-widest font-bold uppercase text-[11px] rounded-none group transition-all"
            >
              {updateProfileMutation.isPending ? "SYNCHRONIZING..." : (
                <span className="flex items-center gap-3">
                  SAVE REGISTRY <Save size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Security & System */}
          <div className="mt-24 pt-16 border-t border-gray-100 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-black" />
                <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-black">Security Protocol</h3>
              </div>
              <p className="text-[13px] text-gray-500 max-w-lg leading-relaxed">
                Platform security is our highest priority. Termination of account registry is irreversible and will purge all accumulated prestige points.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="p-8 border border-gray-100 bg-gray-50/50 space-y-6">
                  <div className="flex items-center gap-3">
                     <Bell size={16} className="text-gray-400" />
                     <h4 className="text-[11px] font-bold uppercase tracking-widest">Notification Engine</h4>
                  </div>
                  <p className="text-[12px] text-gray-400 font-medium">Configure how the boutique communicates exclusive releases and prestige alerts.</p>
                  <Button variant="outline" className="w-full h-12 text-[10px] tracking-widest rounded-none border-gray-200">CONFIGURE ENGINE</Button>
               </div>

               <div className="p-8 border border-red-50 bg-red-50/10 space-y-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-red-900">Danger Zone</h4>
                  <p className="text-[12px] text-gray-400 font-medium">Permanently purge your digital footprint and prestige status from the Xiroo registry.</p>
                  <Button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    variant="outline" 
                    className="w-full h-12 text-[10px] tracking-widest rounded-none border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                  >
                    TERMINATE ACCOUNT
                  </Button>
               </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="TERMINATE ACCOUNT REGISTRY"
        message="This action is irreversible. All accumulated prestige points, order history, and digital identification will be permanently purged. Proceed with caution."
      />
    </div>
  );
}
