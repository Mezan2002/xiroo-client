"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import UserForm from "@/components/admin/users/UserForm";
import { UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

export default function NewUser() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("/users/create-user", {
        method: "POST",
        body: JSON.stringify({ user: data }),
      });
      if (response.success) {
        toast.success("User Registry Created Successfully.");
        router.push("/admin/users");
      }
    } catch (err) {
      toast.error(err.message || "Failed to create user registry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "New Registry", active: true }
        ]}
        title="Identity Creation" 
        icon={UserPlus}
      />

      <div className="max-w-5xl mx-auto">
        <UserForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
