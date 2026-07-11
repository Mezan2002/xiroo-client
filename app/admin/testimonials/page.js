"use client";
import { useState } from "react";
import { useTestimonials } from "@/hooks/api/useTestimonials";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import TestimonialTable from "@/components/admin/testimonials/TestimonialTable";
import Link from "next/link";
import { Quote, Clock, CheckCircle2, XCircle, Star } from "lucide-react";

const TABS = [
  { id: "all", label: "All", icon: Quote },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "rejected", label: "Rejected", icon: XCircle },
  { id: "featured", label: "Featured", icon: Star },
];

export default function AdminTestimonialsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { useAdminTestimonials } = useTestimonials();
  const { data: response, isLoading } = useAdminTestimonials();

  const testimonials = response?.data?.testimonials || response?.data || [];

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (activeTab === "all") return true;
    if (activeTab === "featured") return testimonial.isFeatured;
    return testimonial.status === activeTab;
  });

  const getCounts = () => {
    return {
      all: testimonials.length,
      pending: testimonials.filter((t) => t.status === "pending").length,
      approved: testimonials.filter((t) => t.status === "approved").length,
      rejected: testimonials.filter((t) => t.status === "rejected").length,
      featured: testimonials.filter((t) => t.isFeatured).length,
    };
  };

  const counts = getCounts();

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-700">
        <ModuleHeader
          title="Testimonials"
          icon={Quote}
          label="Catalog"
          labelHref="/admin/products"
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Testimonials", active: true },
          ]}
        />
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 w-full bg-[#F7F7F5] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <ModuleHeader
        title="Testimonials"
        icon={Quote}
        label="Catalog"
        labelHref="/admin/products"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Testimonials", active: true },
        ]}
        primaryAction={{
          label: "Add Testimonial",
          href: "/admin/testimonials/new",
        }}
      />

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        {/* Segmented Navigation */}
        <div className="flex items-center p-1 bg-zinc-50 border border-zinc-100 w-fit">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-white text-black shadow-xs ring-1 ring-zinc-200"
                    : "text-zinc-400 hover:text-black hover:bg-white/50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] font-mono ${
                    isActive ? "text-zinc-400" : "text-zinc-300"
                  }`}
                >
                  ({counts[tab.id]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Testimonial Table */}
        <div className="bg-white border border-zinc-100">
          <TestimonialTable testimonials={filteredTestimonials} />
        </div>
      </div>
    </div>
  );
}
