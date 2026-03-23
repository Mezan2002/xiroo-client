"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import CustomerForm from "@/components/admin/customers/CustomerForm";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewCustomer() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    console.log("Recruiting Customer:", data);
    // Simulate API logic
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/customers");
    }, 1500);
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Customers", href: "/admin/customers" },
          { label: "Manual Recruitment", active: true }
        ]}
        title="Identity Drafting" 
        icon={UserPlus}
      />

      <div className="max-w-6xl">
        <CustomerForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
