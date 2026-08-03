"use client";
import LandingPageForm from "@/components/admin/landing-pages/LandingPageForm";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { FileText } from "lucide-react";

export default function NewLandingPagePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <ModuleHeader
        title="New Landing Page"
        icon={FileText}
        label="Landing Pages"
        labelHref="/admin/landing-pages"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Pages", href: "/admin/landing-pages" },
          { label: "New", active: true },
        ]}
      />
      <LandingPageForm mode="create" />
    </div>
  );
}
