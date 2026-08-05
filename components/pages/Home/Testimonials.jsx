"use client";

import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTestimonials } from "@/hooks/api/useTestimonials";
import TestimonialCard from "./TestimonialCard";
import ReviewModal from "@/components/pages/Product/Reviews/ReviewModal";

function splitIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
}

export default function Testimonials() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  const { usePublicTestimonials } = useTestimonials();
  const { data: response, isLoading } = usePublicTestimonials(1, 5);

  const testimonials = response?.data?.testimonials || response?.data || [];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-zinc-50 animate-pulse"
              style={{ height: `${180 + (i % 3) * 60}px` }}
            />
          ))}
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const displayTestimonials = testimonials.slice(0, 5);

  return (
    <section className="w-full py-16 lg:py-24 px-6 lg:px-12 bg-white border-t border-gray-100">
      {/* Section Header */}
      <SectionHeader subtitle="Testimonials" title="What People Say About Us" className="mb-12 lg:mb-16" />

      {/* Masonry Grid with Fade */}
      <div className="relative max-w-6xl mx-auto">
        {/* Mobile: 1 column */}
        <div className="block sm:hidden max-h-[600px] overflow-hidden">
          {displayTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial._id}
              testimonial={testimonial}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-4 lg:gap-6 max-h-[600px] overflow-hidden">
          {splitIntoColumns(displayTestimonials, 2).map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Desktop: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 lg:gap-6 max-h-[600px] overflow-hidden">
          {splitIntoColumns(displayTestimonials, 3).map((column, colIndex) => (
            <div key={colIndex}>
              {column.map((testimonial) => (
                <TestimonialCard
                  key={testimonial._id}
                  testimonial={testimonial}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Gradient Fade Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />

        {/* See All Button */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
          <Link
            href="/testimonials"
            className="group inline-flex items-center gap-3 border border-black px-8 py-3 transition-all hover:bg-black hover:text-white bg-white"
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
      </div>

      {/* Review Modal */}
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
