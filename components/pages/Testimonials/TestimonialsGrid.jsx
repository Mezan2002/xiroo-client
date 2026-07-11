"use client";

import { useState } from "react";
import { useTestimonials } from "@/hooks/api/useTestimonials";
import TestimonialCard from "./TestimonialCard";
import ReviewModal from "@/components/pages/Product/Reviews/ReviewModal";
import { Loader2 } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All Reviews" },
  { id: "5", label: "5 Star" },
  { id: "4", label: "4 Star" },
  { id: "with-images", label: "With Images" },
];

export default function TestimonialsGrid() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);
  const limit = 20;

  const { usePublicTestimonials } = useTestimonials();
  const { data: response, isLoading, isFetching } = usePublicTestimonials(page, limit);

  const allTestimonials = response?.data?.testimonials || response?.data || [];
  const pagination = response?.data?.pagination || { totalPages: 1, total: 0 };

  const testimonials = allTestimonials.filter((t) => {
    if (filter === "all") return true;
    if (filter === "5") return t.rating === 5;
    if (filter === "4") return t.rating === 4;
    if (filter === "with-images") return t.images && t.images.length > 0;
    return true;
  });

  const hasMore = page < pagination.totalPages;

  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  const handleCardClick = (testimonial, mappedReview) => {
    const idx = testimonials.findIndex((t) => t._id === testimonial._id);
    setModalIndex(idx);
    setSelectedReview(mappedReview);
  };

  const handlePrev = () => {
    const newIdx = (modalIndex - 1 + testimonials.length) % testimonials.length;
    setModalIndex(newIdx);
    const t = testimonials[newIdx];
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
    const newIdx = (modalIndex + 1) % testimonials.length;
    setModalIndex(newIdx);
    const t = testimonials[newIdx];
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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`break-inside-avoid mb-4 lg:mb-6 bg-zinc-50 animate-pulse ${
              i % 3 === 0 ? "h-72" : i % 2 === 0 ? "h-96" : "h-56"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              setPage(1);
            }}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all ${
              filter === f.id
                ? "bg-black text-white"
                : "bg-white text-gray-400 hover:text-black border border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Masonry Grid - CSS Columns */}
      {testimonials.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No testimonials found</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial._id}
              testimonial={testimonial}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && filter === "all" && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="inline-flex items-center gap-2 border border-black px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* Total Count */}
      <div className="text-center pt-4">
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          Showing {testimonials.length} of {pagination.total} testimonials
        </p>
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
    </div>
  );
}
