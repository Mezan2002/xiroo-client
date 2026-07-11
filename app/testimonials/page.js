"use client";

import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import TestimonialsGrid from "@/components/pages/Testimonials/TestimonialsGrid";
import TestimonialFormModal from "@/components/pages/Testimonials/TestimonialFormModal";
import { PenLine } from "lucide-react";

export default function TestimonialsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat">
      {/* Header */}
      <div className="max-w-[800px] mx-auto mb-20">
        <div className="flex flex-col gap-6 items-center text-center">
          <Breadcrumb />
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight">
            Testimonials
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <span className="w-8 h-px bg-gray-200" />
            What Our Customers Say
            <span className="w-8 h-px bg-gray-200" />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 inline-flex items-center gap-2 border border-black px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all"
          >
            <PenLine size={14} />
            Write a Testimonial
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto">
        <TestimonialsGrid />
      </div>

      {/* Trust Footer Hook */}
      <div className="max-w-[800px] mx-auto mt-24 pt-12 border-t border-gray-100 flex flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-4">
          Share Your Experience
        </p>
        <p className="text-xs tracking-widest text-gray-400">
          We value your feedback. Click the button above to leave a review.
        </p>
      </div>

      {/* Testimonial Form Modal */}
      {isFormOpen && (
        <TestimonialFormModal onClose={() => setIsFormOpen(false)} />
      )}
    </div>
  );
}
