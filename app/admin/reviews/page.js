"use client";
import ReviewDashboard from "@/components/admin/reviews/ReviewDashboard";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { MessageSquare } from "lucide-react";

export default function AdminReviewsPage() {
  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
        <ModuleHeader
          title="Review Moderation"
          icon={MessageSquare}
          label="Catalog"
          labelHref="/admin/products"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Reviews", active: true },
          ]}
        />

        <ReviewDashboard />
      </div>
    </>
  );
}
