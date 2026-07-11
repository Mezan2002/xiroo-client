"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import TestimonialForm from "@/components/admin/testimonials/TestimonialForm";
import { Quote } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTestimonials } from "@/hooks/api/useTestimonials";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { useTestimonial, updateTestimonial } = useTestimonials();
  const { data: response, isLoading } = useTestimonial(id);

  const testimonial = response?.data;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <ModuleHeader
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Testimonials", href: "/admin/testimonials" },
            { label: "Edit", active: true },
          ]}
          title="Edit Testimonial"
          icon={Quote}
        />
        <div className="bg-white border-x border-zinc-100 px-12 py-16">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-zinc-50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <ModuleHeader
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Testimonials", href: "/admin/testimonials" },
            { label: "Edit", active: true },
          ]}
          title="Edit Testimonial"
          icon={Quote}
        />
        <div className="bg-white border-x border-zinc-100 px-12 py-16 text-center">
          <p className="text-zinc-400">Testimonial not found</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (data) => {
    updateTestimonial.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push("/admin/testimonials");
        },
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Testimonials", href: "/admin/testimonials" },
          { label: "Edit", active: true },
        ]}
        title="Edit Testimonial"
        icon={Quote}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <TestimonialForm
          initialData={testimonial}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={updateTestimonial.isPending}
        />
      </div>
    </div>
  );
}
