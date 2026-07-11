"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import { Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTestimonials } from "@/hooks/api/useTestimonials";

export default function NewTestimonialPage() {
  const router = useRouter();
  const { createTestimonial } = useTestimonials();

  const handleSubmit = (data) => {
    createTestimonial.mutate(data, {
      onSuccess: () => {
        router.push("/admin/testimonials");
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Testimonials", href: "/admin/testimonials" },
          { label: "New", active: true },
        ]}
        title="New Testimonial"
        icon={Quote}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <TestimonialForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={createTestimonial.isPending}
        />
      </div>
    </div>
  );
}
