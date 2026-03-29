"use client";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/Button";
import { useReviews } from "@/hooks/api/useReviews";
import { useUser } from "@/hooks/api/useUser";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  MessageSquare,
  Send,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";

// ── Star display + picker ──
function Stars({ count, size = 12, isBlack = false }) {
  return (
    <div className="flex gap-[3px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= count ? "currentColor" : "none"}
          strokeWidth={i <= count ? 0 : 1.5}
          className={
            i <= count
              ? isBlack
                ? "text-white"
                : "text-black"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

// ── Photo Lightbox ──
function PhotoLightbox({ photos, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const handlePrev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div
      className="fixed inset-0 z-10000 bg-black/90 backdrop-blur-md flex items-center justify-center pt-24 pb-12 px-6 md:px-12"
      onClick={onClose}
    >
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 h-auto w-auto"
      >
        <X size={28} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronLeft size={24} />
      </Button>
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[index]}
          alt=""
          className="max-w-full max-h-full object-contain shadow-2xl"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        showHoverIcon={false}
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronRight size={24} />
      </Button>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-semibold tracking-[0.3em] uppercase text-white/40">
        {index + 1} <span className="mx-2">/</span> {photos.length}
      </div>
    </div>
  );
}

// ── Review Card ──
function ReviewCard({ review, onClick, variant = "light", allPhotos = [], setLightboxIndex }) {
  const isBlack = variant === "black";
  return (
    <div
      onClick={onClick}
      className={`group flex flex-col overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl ${
        isBlack ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
      } ${review.span === "photo-overlay" ? "relative min-h-[320px]" : ""}`}
    >
      {review.span === "photo-overlay" ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.images?.[0] || review.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
          {review.images?.length > 1 && (
            <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md px-2 py-1 text-[8px] font-bold text-white uppercase tracking-widest ring-1 ring-white/10">
              +{review.images.length - 1} Photos
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
            <Stars count={review.rating} size={11} isBlack={true} />
            <h3 className="text-[14px] md:text-[16px] font-semibold text-white leading-tight">
              &ldquo;{review.title}&rdquo;
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold overflow-hidden shrink-0 bg-white/10 text-white ring-1 ring-white/20">
                {review.userImage ? (
                  <img src={review.userImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  (review.name || "C").charAt(0).toUpperCase()
                )}
              </div>
              <p className="text-[10px] text-white/50 tracking-wide uppercase font-bold">
                {review.name}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {(review.images?.length > 0 || review.image) && (
            <div className="w-full flex flex-col">
              <div className="aspect-4/3 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={review.images?.[0] || review.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                />
              </div>
              
              {/* Secondary Thumbnails Row */}
              {review.images?.length > 1 && (
                <div className="flex gap-1 p-1 bg-white/50 border-t border-gray-100 overflow-x-auto scrollbar-hide">
                  {review.images.slice(1, 5).map((img, i) => (
                    <div 
                      key={i} 
                      onClick={(e) => {
                         e.stopPropagation();
                         setLightboxIndex(allPhotos.indexOf(img));
                      }}
                      className="w-10 h-10 shrink-0 overflow-hidden rounded-[2px] opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {review.images.length > 5 && (
                    <div className="w-10 h-10 shrink-0 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 rounded-[2px]">
                      +{review.images.length - 5}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="p-6 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <Stars count={review.rating} size={13} isBlack={isBlack} />
              {review.verified && (
                <span
                  className={`text-[8px] font-semibold tracking-widest uppercase border px-2 py-[2px] ${
                    isBlack
                      ? "border-white/20 text-white/40"
                      : "border-gray-200 text-gray-400"
                  }`}
                >
                  Verified
                </span>
              )}
            </div>
            <h3
              className={`text-[16px] md:text-[18px] font-semibold leading-snug ${
                isBlack ? "text-white" : "text-black"
              }`}
            >
              &ldquo;{review.title}&rdquo;
            </h3>
            <p
              className={`text-[12px] leading-[1.8] flex-1 ${
                isBlack ? "text-white/60" : "text-gray-500"
              }`}
            >
              {review.body}
            </p>
            <div
              className={`flex items-center gap-2 pt-4 border-t ${
                isBlack ? "border-white/10" : "border-gray-200"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold overflow-hidden shrink-0 ${
                  isBlack ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                {review.userImage ? (
                  <img src={review.userImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  (review.name || "C").charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[12px] font-semibold ${
                    isBlack ? "text-white" : "text-black"
                  }`}
                >
                  {review.name}
                </span>
                <span
                  className={`text-[10px] ${
                    isBlack ? "text-white/40" : "text-gray-400"
                  }`}
                >
                  {review.date}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Review Detail Modal ──
function ReviewModal({ review, onClose, onPrev, onNext }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!review) return null;
  const gallery = (review.images || [review.image]).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-end md:items-center justify-center p-4 md:p-0"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full md:max-w-[820px] bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[95vh] md:max-h-[85vh] rounded-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cinematic Photo Section */}
        {gallery.length > 0 && (
          <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 bg-[#F7F7F5] flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
            {/* Main Stage */}
            <div 
              className="flex-1 relative group cursor-zoom-in overflow-hidden bg-white/50"
              onClick={() => setIsLightboxOpen(true)}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery[activeIndex]}
                  alt="Review focus"
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[0.98] group-hover:scale-100"
                />
              </div>
              
              {/* Pagination Label */}
              {gallery.length > 1 && (
                <div className="absolute top-6 left-6 z-10 bg-black/5 backdrop-blur-md px-2.5 py-1 text-[8px] font-bold text-black uppercase tracking-widest border border-black/5">
                   {activeIndex + 1} / {gallery.length} Perspective
                </div>
              )}
            </div>

            {/* Interactive Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="h-20 shrink-0 flex items-center gap-2 px-6 overflow-x-auto scrollbar-hide bg-white border-t border-gray-50">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-12 h-12 shrink-0 border transition-all duration-300 ${
                      i === activeIndex 
                        ? "border-black scale-105" 
                        : "border-gray-100 opacity-40 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover grayscale-sm hover:grayscale-0" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isLightboxOpen && (
          <PhotoLightbox 
            photos={gallery}
            initialIndex={activeIndex}
            onClose={() => setIsLightboxOpen(false)}
          />
        )}
        <div className="flex flex-col flex-1 p-7 overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <Stars count={review.rating} size={14} />
            <Button
              variant="ghost"
              size="icon"
              showHoverIcon={false}
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors p-1 -mt-1 -mr-1 h-auto w-auto"
            >
              <X size={18} />
            </Button>
          </div>
          <h3 className="text-[22px] font-semibold text-black leading-snug mb-4 tracking-tight">
            &ldquo;{review.title}&rdquo;
          </h3>
          <p className="text-[13px] text-gray-500 leading-[1.9] flex-1">
            {review.body}
          </p>
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-semibold shrink-0 overflow-hidden">
              {review.userImage ? (
                <img src={review.userImage} alt="" className="w-full h-full object-cover" />
              ) : (
                (review.name || "C").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-black">
                {review.name}
              </p>
              <p className="text-[11px] text-gray-400">{review.date}</p>
            </div>
            {review.verified && (
              <span className="text-[9px] font-semibold tracking-widest border border-gray-200 text-gray-400 px-2 py-1 uppercase">
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              showHoverIcon={false}
              onClick={onPrev}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-black transition-colors uppercase tracking-wider h-auto px-0 hover:bg-transparent"
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <Button
              variant="ghost"
              showHoverIcon={false}
              onClick={onNext}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-black transition-colors uppercase tracking-wider h-auto px-0 hover:bg-transparent"
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Write Review Form Modal ──
function ReviewFormModal({ productId, onClose }) {
  const { user } = useUser();
  const { submitReview } = useReviews();

  const [rating, setRating] = useState(0);
  const [hovered, setHoveredRating] = useState(0);
  const [form, setForm] = useState({ title: "", body: "" });
  const [uploadedImages, setUploadedImages] = useState([]); // Cloudinary URLs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Auth gate ──
  if (!user) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <div className="relative z-10 w-full max-w-[400px] bg-white p-8 text-center shadow-2xl">
          <Button
            variant="ghost"
            size="icon"
            showHoverIcon={false}
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black h-auto w-auto"
          >
            <X size={20} />
          </Button>
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <Star size={24} className="text-white fill-current" />
          </div>
          <h3 className="text-[20px] font-semibold text-black tracking-tight mb-2">
            Join the Community
          </h3>
          <p className="text-[14px] text-gray-500 mb-8 leading-snug">
            Sign in to share your experience with others.
          </p>
          <Button
            variant="primary"
            size="lg"
            showHoverIcon={false}
            className="w-full"
            onClick={() =>
              (window.location.href = `/login?redirect=${encodeURIComponent(
                window.location.pathname,
              )}`)
            }
          >
            Sign In to Review
          </Button>
        </div>
      </div>
    );
  }

  const handleImageUploaded = (url) => {
    setUploadedImages((prev) => [...prev, url].slice(0, 6));
  };

  const removeImage = (idx) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !form.body) return;
    setIsSubmitting(true);
    try {
      await submitReview.mutateAsync({
        productId,
        reviewData: {
          rating,
          title: form.title || form.body.slice(0, 30) + "...",
          body: form.body,
          images: uploadedImages,
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Customer";

  return (
    <div
      className="fixed inset-0 z-9999 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full md:max-w-[560px] bg-white shadow-2xl flex flex-col overflow-hidden max-h-[95vh] rounded-t-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-[15px] font-semibold text-black tracking-tight">
              Write a Review
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Share your honest experience
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            showHoverIcon={false}
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors h-auto w-auto"
          >
            <X size={20} />
          </Button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16 px-7 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
              <Star size={22} className="text-white" fill="currentColor" />
            </div>
            <h4 className="text-[18px] font-semibold text-black">
              Thank you, {user?.firstName || "friend"}!
            </h4>
            <p className="text-[13px] text-gray-500">
              Your review has been submitted for moderation.
            </p>
            <Button
              variant="link"
              size="sm"
              showHoverIcon={false}
              onClick={onClose}
              className="mt-4 text-gray-400 hover:text-black"
            >
              Close
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 px-7 py-6 overflow-y-auto"
          >
            {/* Star picker */}
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">
                Your Rating *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHoveredRating(i)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={26}
                      fill={(hovered || rating) >= i ? "currentColor" : "none"}
                      strokeWidth={(hovered || rating) >= i ? 0 : 1.5}
                      className={
                        (hovered || rating) >= i
                          ? "text-black"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* User identity strip */}
            <div className="flex items-center gap-3 py-3 border-y border-gray-50">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold uppercase text-[13px]">
                {(user?.firstName || "U").charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-black">
                  {fullName}
                </span>
                <span className="text-[10px] text-gray-400 tracking-wider uppercase">
                  Verified Account
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Summarise your experience..."
                className="w-full border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                placeholder="Tell others what you think..."
                className="w-full border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            {/* Image upload (Cloudinary) */}
            <div>
              <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">
                Add Photos (up to 6)
              </label>
              <div className="flex flex-wrap gap-2">
                {/* Uploaded previews */}
                {uploadedImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-[4px] overflow-hidden bg-gray-100 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ))}

                {/* Add photo trigger */}
                {uploadedImages.length < 6 && (
                  <ImageUploader
                    multiple={true}
                    onUploadSuccess={handleImageUploaded}
                    className="w-16 h-16 rounded-[4px]"
                  >
                    <div className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-[4px] flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-black hover:text-black transition-colors">
                      <ImagePlus size={18} />
                      <span className="text-[8px] font-semibold tracking-wider">
                        ADD
                      </span>
                    </div>
                  </ImageUploader>
                )}
              </div>
            </div>

            <Button
              disabled={isSubmitting || !rating || !form.body}
              variant="primary"
              size="lg"
              className="w-full"
              icon={Send}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Distribute reviews into 3 columns for masonry effect ──
// Uses a "shortest column first" algorithm for natural height distribution
function buildMasonryColumns(reviews) {
  const cols = [[], [], []];
  const heights = [0, 0, 0];

  reviews.forEach((review) => {
    // Estimate card height: photo cards are taller
    const hasPhotos = review.images?.length > 0 || review.image;
    const estimated = hasPhotos ? 380 : 260;
    const shortestCol = heights.indexOf(Math.min(...heights));
    cols[shortestCol].push(review);
    heights[shortestCol] += estimated;
  });

  return cols;
}

// ── Empty State ──
function EmptyReviews({ onWriteReview }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
      <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
        <MessageSquare size={24} className="text-gray-300" />
      </div>
      <div>
        <h3 className="text-[17px] font-semibold text-black tracking-tight">
          No reviews yet
        </h3>
        <p className="text-[13px] text-gray-400 mt-1">
          Be the first to share your experience.
        </p>
      </div>
      <Button variant="primary" size="default" onClick={onWriteReview}>
        Write the First Review
      </Button>
    </div>
  );
}

// ── Main Component ──
export default function ProductReviews({ productId }) {
  const [selectedReview, setSelectedReview] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { useProductReviews } = useReviews();
  const { data: response, isLoading } = useProductReviews(productId);
  const fetchedReviews = response?.data || response || [];

  const allReviews = fetchedReviews.map((r) => ({
    id: r._id,
    name:
      [r.user?.firstName, r.user?.lastName].filter(Boolean).join(" ") ||
      "Customer",
    date: new Date(r.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    rating: r.rating,
    title: r.title,
    body: r.body,
    image: r.image || null,
    images: r.images || [],
    verified: r.verified || false,
    userImage: r.user?.image || r.user?.avatar || null,
  }));

  const displayReviews = showAll ? allReviews : allReviews.slice(0, 6);
  const [col1, col2, col3] = buildMasonryColumns(displayReviews);

  // All photos from reviews with images (for photo strip)
  const allPhotos = allReviews.flatMap(
    (r) => r.images || (r.image ? [r.image] : []),
  );

  const selectedIndex = allReviews.findIndex(
    (r) => r.id === selectedReview?.id,
  );
  const handlePrev = () =>
    setSelectedReview(
      allReviews[(selectedIndex - 1 + allReviews.length) % allReviews.length],
    );
  const handleNext = () =>
    setSelectedReview(allReviews[(selectedIndex + 1) % allReviews.length]);

  // Alternate card variants across columns for visual richness
  const renderCol = (reviews, colIndex) =>
    reviews.map((r, i) => {
      // Photo-overlay for cards that have an image and fall on even positions
      const hasPhotoOverlay = r.image && i % 3 === 0;
      const variant =
        colIndex === 1 && i % 2 === 0
          ? "black"
          : colIndex === 2 && i % 2 === 1
            ? "black"
            : "light";
      return (
        <ReviewCard
          key={r.id || i}
          review={hasPhotoOverlay ? { ...r, span: "photo-overlay" } : r}
          variant={variant}
          onClick={() => setSelectedReview(r)}
          allPhotos={allPhotos}
          setLightboxIndex={setLightboxIndex}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        />
      );
    });

  return (
    <section className="w-full mt-16 border-t border-gray-100 pb-28 overflow-hidden">
      <div className="px-4 md:px-10 xl:px-16 mt-14">
        {/* ── Top row ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-black leading-none">
              What customers
              <br />
              <em className="not-italic text-gray-300">are saying</em>
            </h2>
            {allReviews.length > 0 && (
              <p className="mt-3 text-[13px] text-gray-500 font-medium tracking-wide">
                {allReviews.length}{" "}
                {allReviews.length === 1 ? "Review" : "Reviews"}
              </p>
            )}
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowForm(true)}
            className="self-start md:self-auto shrink-0"
          >
            Write a Review
          </Button>
        </div>

        {/* ── Loading skeleton ── */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[220px] bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Photo strip ── */}
        {!isLoading && allPhotos.length > 0 && (
          <div className="mb-14 mt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {allPhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="w-[84px] h-[84px] shrink-0 overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity group relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt=""
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/40 py-1 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[7px] text-white font-bold uppercase tracking-widest truncate block">
                        View Discovery
                     </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && allReviews.length === 0 && (
          <EmptyReviews onWriteReview={() => setShowForm(true)} />
        )}

        {/* ── Masonry Grid ── */}
        {!isLoading && allReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-4">
              {renderCol(col1, 0)}
            </div>
            <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-4">
              {renderCol(col2, 1)}
            </div>
            <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-4">
              {renderCol(col3, 2)}
            </div>
          </div>
        )}

        {/* ── View all / show less ── */}
        {allReviews.length > 6 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="ghost"
              showHoverIcon={false}
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-3 text-[12px] font-semibold tracking-widest uppercase text-black hover:text-gray-500 transition-colors h-auto p-0 hover:bg-transparent"
            >
              {showAll ? "Show less" : `View all ${allReviews.length} reviews`}
              <ArrowRight
                size={14}
                className={`transform transition-transform ${
                  showAll ? "-rotate-90" : "group-hover:translate-x-1"
                }`}
              />
            </Button>
          </div>
        )}
      </div>

      <ReviewModal
        key={selectedReview?.id}
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      {showForm && (
        <ReviewFormModal
          productId={productId}
          onClose={() => setShowForm(false)}
        />
      )}
      
      {lightboxIndex !== null && (
        <PhotoLightbox 
          photos={allPhotos} 
          initialIndex={lightboxIndex} 
          onClose={() => setLightboxIndex(null)} 
        />
      )}
    </section>
  );
}
