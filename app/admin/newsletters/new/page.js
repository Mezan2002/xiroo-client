"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import NewsletterForm from "@/components/admin/newsletters/NewsletterForm";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewNewsletterPage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    console.log("Registering Marketing Campaign:", data);
    router.push("/admin/newsletters");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Newsletters", href: "/admin/newsletters" },
          { label: "Draft", active: true }
        ]}
        title="Creative Drafting"
        icon={Mail}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <NewsletterForm 
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
