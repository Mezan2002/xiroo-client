"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTestimonials } from "@/hooks/api/useTestimonials";
import TestimonialCard from "./TestimonialCard";
import ReviewModal from "@/components/pages/Product/Reviews/ReviewModal";

export default function Testimonials() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  const { useFeaturedTestimonials } = useTestimonials();
  const { data: response, isLoading } = useFeaturedTestimonials(5);

  const testimonials = response?.data || response || [];

  const handleCardClick = (testimonial, mappedReview) => {
    const displayTestimonials = testimonials.slice(0, 5);
    const idx = displayTestimonials.findIndex((t) => t._id === testimonial._id);
    setModalIndex(idx);
    setSelectedReview(mappedReview);
  };

  const handlePrev = () => {
    const displayTestimonials = testimonials.slice(0, 5);
    const newIdx = (modalIndex - 1 + displayTestimonials.length) % displayTestimonials.length;
    setModalIndex(newIdx);
    const t = displayTestimonials[newIdx];
    setSelectedReview({
      name: t.customerName,
      userImage: t.avatar,
      title: "",
      body: t.content,
      rating: t.rating,
      verified: t.isVerified,
      images: t.images || [],
      date: t.createdAt
        ? new Date(t.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    });
  };

  const handleNext = () => {
    const displayTestimonials = testimonials.slice(0, 5);
    const newIdx = (modalIndex + 1) % displayTestimonials.length;
    setModalIndex(newIdx);
    const t = displayTestimonials[newIdx];
    setSelectedReview({
      name: t.customerName,
      userImage: t.avatar,
      title: "",
      body: t.content,
      rating: t.rating,
      verified: t.isVerified,
      images: t.images || [],
      date: t.createdAt
        ? new Date(t.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    });
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  if (isLoading) {
    return (
      <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-mono tracking-[0.12em] font-medium text-black uppercase">
            What People Say
          </h2>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`break-inside-avoid mb-4 lg:mb-6 bg-zinc-50 animate-pulse ${
                i % 3 === 0 ? "h-64" : i % 2 === 0 ? "h-80" : "h-48"
              }`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  // Take only first 5 for homepage
  const displayTestimonials = testimonials.slice(0, 5);

  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
        <span className="text-[10px] font-bold tracking-[0.4em] text-gray-400 uppercase mb-3">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-mono tracking-[0.12em] font-medium text-black uppercase">
          What People Say About Us
        </h2>
      </div>

      {/* Masonry Grid - CSS Columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
        {displayTestimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial._id}
            testimonial={testimonial}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* See All Button */}
      <div className="flex justify-center mt-12">
        <Link
          href="/testimonials"
          className="group inline-flex items-center gap-3 border border-black px-8 py-3 transition-all hover:bg-black hover:text-white"
        >
          <span className="text-xs font-bold uppercase text-black tracking-widest group-hover:text-white">
            See All Testimonials
          </span>
          <ArrowRight
            size={14}
            className="text-black group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
          />
        </Link>
      </div>

      {/* Review Modal (reused from product reviews) */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
