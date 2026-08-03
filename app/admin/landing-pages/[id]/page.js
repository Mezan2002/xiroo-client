"use client";
import { useParams } from "next/navigation";
import { useLandingPages } from "@/hooks/api/useLandingPages";
import LandingPageForm from "@/components/admin/landing-pages/LandingPageForm";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { FileText, Loader2 } from "lucide-react";

export default function EditLandingPagePage() {
  const params = useParams();
  const id = params?.id;
  const { useLandingPage } = useLandingPages();
  const { data: response, isLoading } = useLandingPage(id);
  const landingPage = response?.data;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <ModuleHeader
          title="Edit Landing Page"
          icon={FileText}
          label="Landing Pages"
          labelHref="/admin/landing-pages"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Landing Pages", href: "/admin/landing-pages" },
            { label: "Edit", active: true },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
        </div>
      </div>
    );
  }

  if (!landingPage) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <ModuleHeader
          title="Landing Page Not Found"
          icon={FileText}
          label="Landing Pages"
          labelHref="/admin/landing-pages"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Landing Pages", href: "/admin/landing-pages" },
            { label: "Not Found", active: true },
          ]}
        />
        <div className="text-center py-20">
          <p className="text-[13px] text-zinc-400">This landing page does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <ModuleHeader
        title={`Edit: ${landingPage.title}`}
        icon={FileText}
        label="Landing Pages"
        labelHref="/admin/landing-pages"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Landing Pages", href: "/admin/landing-pages" },
          { label: landingPage.title, active: true },
        ]}
      />
      <LandingPageForm initialData={landingPage} mode="edit" />
    </div>
  );
}
