"use client";
import { Button } from "@/components/ui/Button";
import { Star, X } from "lucide-react";
import TestimonialForm from "./sections/TestimonialForm";
import { useTestimonialForm } from "./sections/useTestimonialForm";

export default function TestimonialFormModal({ onClose }) {
  const {
    user,
    rating,
    setRating,
    hovered,
    setHoveredRating,
    form,
    setForm,
    uploadedImages,
    isSubmitting,
    submitted,
    handleImageUploaded,
    removeImage,
    handleSubmit,
    fullName,
    showNameInput,
    isAdmin,
  } = useTestimonialForm(onClose);

  if (!user) {
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
          <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
            <div>
              <h3 className="text-[15px] font-semibold text-black tracking-tight">
                Write a Testimonial
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Share your honest experience with XIROO
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              showHoverIcon={false}
              className="text-gray-400 hover:text-black transition-colors"
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
                Thank you!
              </h4>
              <p className="text-[13px] text-gray-500">
                Your testimonial has been submitted for moderation.
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={onClose}
                className="mt-4 text-gray-400 hover:text-black"
              >
                Close
              </Button>
            </div>
          ) : (
            <TestimonialForm
              rating={rating}
              setRating={setRating}
              hovered={hovered}
              setHoveredRating={setHoveredRating}
              form={form}
              setForm={setForm}
              uploadedImages={uploadedImages}
              isSubmitting={isSubmitting}
              handleImageUploaded={handleImageUploaded}
              removeImage={removeImage}
              handleSubmit={handleSubmit}
              user={user}
              fullName={fullName}
              showNameInput={showNameInput}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
          <div>
            <h3 className="text-[15px] font-semibold text-black tracking-tight">
              Write a Testimonial
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Share your honest experience with XIROO
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            showHoverIcon={false}
            className="text-gray-400 hover:text-black transition-colors"
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
              Your testimonial has been submitted for moderation.
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={onClose}
              className="mt-4 text-gray-400 hover:text-black"
            >
              Close
            </Button>
          </div>
        ) : (
          <TestimonialForm
            rating={rating}
            setRating={setRating}
            hovered={hovered}
            setHoveredRating={setHoveredRating}
            form={form}
            setForm={setForm}
            uploadedImages={uploadedImages}
            isSubmitting={isSubmitting}
            handleImageUploaded={handleImageUploaded}
            removeImage={removeImage}
            handleSubmit={handleSubmit}
            user={user}
            fullName={fullName}
            showNameInput={showNameInput}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
}
