"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/api/useUser";
import { useAuth } from "@/hooks/api/useAuth";
import { useToast } from "@/hooks/useToast";

export const useSettingsLogic = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser, updateProfile, syncAvatar, deleteAccount } = useUser();
  const { logout } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const lastUpdated = currentUser?.updatedAt
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true,
      }).format(new Date(currentUser.updatedAt))
    : "Recently";

  const handleDeleteAccount = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account Registry Terminated Successfully.");
        logout();
        router.push("/");
      },
      onError: (err) => toast.error(err.message || "Failed to terminate profile registry.")
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phoneNumber: formData.get("phoneNumber") ? `+880${formData.get("phoneNumber").replace(/\s+/g, "")}` : "",
    };
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v));
    updateProfile.mutate(sanitizedData, {
      onSuccess: () => toast.success("Profile Registry Updated Successfully."),
      onError: (err) => toast.error(err.message || "Failed to update profile data.")
    });
  };

  const handleAvatarUpload = (secureUrl) => {
    syncAvatar.mutate(secureUrl, {
      onSuccess: () => toast.success("Profile Registry Updated: Avatar Synced."),
      onError: (err) => toast.error(err.message || "Failed to sync avatar structure.")
    });
  };

  return { currentUser, lastUpdated, isDeleteModalOpen, setIsDeleteModalOpen, handleDeleteAccount, handleProfileUpdate, handleAvatarUpload };
};
