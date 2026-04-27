"use client";
import { Button } from "@/components/ui/Button";
import { Star, X } from "lucide-react";
import ReviewForm from "./sections/ReviewForm";
import { useReviewForm } from "./sections/useReviewForm";

export default function ReviewFormModal({ productId, onClose }) {
  const {
    user, rating, setRating, hovered, setHoveredRating, form, setForm,
    uploadedImages, isSubmitting, submitted, handleImageUploaded, removeImage,
    handleSubmit, fullName
  } = useReviewForm(productId, onClose);

  if (!user) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
        <div className="relative z-10 w-full max-w-[400px] bg-white p-8 text-center shadow-2xl">
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
            <X size={20} />
          </Button>
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mx-auto mb-6">
            <Star size={24} className="text-white fill-current" />
          </div>
          <h3 className="text-[20px] font-semibold text-black tracking-tight mb-2">Join the Community</h3>
          <p className="text-[14px] text-gray-500 mb-8 leading-snug">Sign in to share your experience with others.</p>
          <Button
            variant="primary" size="lg" className="w-full"
            onClick={() => (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
          >
            Sign In to Review
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full md:max-w-[560px] bg-white shadow-2xl flex flex-col overflow-hidden max-h-[95vh] rounded-t-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-[15px] font-semibold text-black tracking-tight">Write a Review</h3>
            <p className="text-[11px] text-gray-400 mt-1">Share your honest experience</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={20} />
          </Button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16 px-7 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
              <Star size={22} className="text-white" fill="currentColor" />
            </div>
            <h4 className="text-[18px] font-semibold text-black">Thank you, {user?.firstName || "friend"}!</h4>
            <p className="text-[13px] text-gray-500">Your review has been submitted for moderation.</p>
            <Button variant="link" size="sm" onClick={onClose} className="mt-4 text-gray-400 hover:text-black">Close</Button>
          </div>
        ) : (
          <ReviewForm
            rating={rating} setRating={setRating} hovered={hovered} setHoveredRating={setHoveredRating}
            form={form} setForm={setForm} uploadedImages={uploadedImages} isSubmitting={isSubmitting}
            handleImageUploaded={handleImageUploaded} removeImage={removeImage}
            handleSubmit={handleSubmit} user={user} fullName={fullName}
          />
        )}
      </div>
    </div>
  );
}
