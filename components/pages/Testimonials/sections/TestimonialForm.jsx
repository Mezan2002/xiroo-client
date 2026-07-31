"use client";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { Button } from "@/components/ui/Button";
import { Star, ImagePlus, Send } from "lucide-react";
import Image from "next/image";

export default function TestimonialForm({
  rating, setRating, hovered, setHoveredRating, form, setForm,
  uploadedImages, isSubmitting, handleImageUploaded, removeImage,
  handleSubmit, user, fullName, showNameInput, isAdmin
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-7 py-6 overflow-y-auto">
      <div>
        <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">Your Rating *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i} type="button"
              onMouseEnter={() => setHoveredRating(i)} onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(i)} className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                size={26} fill={(hovered || rating) >= i ? "currentColor" : "none"}
                strokeWidth={(hovered || rating) >= i ? 0 : 1.5}
                className={(hovered || rating) >= i ? "text-black" : "text-gray-300"}
              />
            </button>
          ))}
        </div>
      </div>

      {showNameInput ? (
        <div>
          <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">Your Name *</label>
          <input
            type="text"
            required
            value={form.customerName || ""}
            onChange={(e) => setForm(f => ({ ...f, customerName: e.target.value }))}
            placeholder="Enter your name"
            className="w-full border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] text-black focus:outline-none focus:border-black transition-colors"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 py-3 border-y border-gray-50">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold uppercase text-[13px]">
            {(user?.firstName || "U").charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-black">{fullName}</span>
            <span className="text-[10px] text-gray-400 tracking-wider uppercase">Verified Account</span>
          </div>
        </div>
      )}

      <div>
        <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">Your Testimonial *</label>
        <textarea
          required rows={4} value={form.content}
          onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="Share your experience with XIROO..."
          className="w-full border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] text-black focus:outline-none focus:border-black transition-colors resize-none"
        />
        <p className="text-[10px] text-gray-400 mt-1">{form.content.length}/1000 characters</p>
      </div>

      <div>
        <label className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 block mb-2">Add Photos (up to 3)</label>
        <div className="flex flex-wrap gap-2">
          {uploadedImages.map((url, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-[4px] overflow-hidden bg-gray-100 group">
              <Image src={url} alt="" fill className="object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                <Star size={14} className="text-white" />
              </button>
            </div>
          ))}
          {uploadedImages.length < 3 && (
            <ImageUploader multiple={true} onUploadSuccess={handleImageUploaded} className="w-16 h-16">
              <div className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-[4px] flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-black hover:text-black transition-colors">
                <ImagePlus size={18} /><span className="text-[8px] font-semibold uppercase">ADD</span>
              </div>
            </ImageUploader>
          )}
        </div>
      </div>

      <Button disabled={isSubmitting || !rating || !form.content || (showNameInput && !form.customerName)} variant="primary" size="lg" className="w-full" icon={Send}>
        {isSubmitting ? "Submitting..." : "Submit Testimonial"}
      </Button>
    </form>
  );
}
