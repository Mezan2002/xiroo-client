"use client";
import React, { useState } from "react";
import { Quote, Star, Image as ImageIcon, User, FileText } from "lucide-react";

const Label = ({ children }) => (
  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-3 block">
    {children}
  </label>
);

const FormSection = ({ title, children, icon: Icon }) => (
  <div className="space-y-8">
    <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
      {Icon && <Icon size={16} className="text-zinc-400" />}
      <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    <div className="space-y-8">{children}</div>
  </div>
);

const StarRating = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5"
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= (hover || value)
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-200 hover:text-zinc-300"
            }`}
          />
        </button>
      ))}
      <span className="ml-3 text-[12px] text-zinc-400 font-medium">
        {value > 0 ? `${value}/5` : "Select rating"}
      </span>
    </div>
  );
};

export default function TestimonialForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    customerName: initialData.customerName || "",
    customerTitle: initialData.customerTitle || "",
    avatar: initialData.avatar || "",
    content: initialData.content || "",
    rating: initialData.rating || 0,
    images: initialData.images || [],
    isFeatured: initialData.isFeatured || false,
    status: initialData.status || "pending",
  });

  const [imageUrls, setImageUrls] = useState(
    initialData.images?.length > 0 ? initialData.images.join("\n") : ""
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUrlsChange = (e) => {
    const urls = e.target.value;
    setImageUrls(urls);
    const imageArray = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
    setFormData((prev) => ({ ...prev, images: imageArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <FormSection title="Customer Information" icon={User}>
            <div className="space-y-4">
              <Label>Customer Name</Label>
              <input
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Ahmed Rahman"
                required
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4"
              />
            </div>
            <div className="space-y-4">
              <Label>Customer Title (Optional)</Label>
              <input
                name="customerTitle"
                value={formData.customerTitle}
                onChange={handleChange}
                placeholder="e.g. Verified Buyer, Fashion Enthusiast"
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4"
              />
            </div>
            <div className="space-y-4">
              <Label>Avatar URL (Optional)</Label>
              <input
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-xl font-light py-4"
              />
              <p className="text-[11px] text-zinc-400">
                If no avatar is provided, the first letter of the name will be shown.
              </p>
            </div>
          </FormSection>

          <FormSection title="Review Content" icon={FileText}>
            <div className="space-y-4">
              <Label>Review Text</Label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Share your experience with XIROO..."
                required
                minLength={10}
                maxLength={1000}
                rows={5}
                className="w-full bg-zinc-50 border border-zinc-100 p-4 text-[13px] font-medium outline-none focus:border-black resize-none"
              />
              <p className="text-[11px] text-zinc-400 text-right">
                {formData.content.length}/1000 characters
              </p>
            </div>
          </FormSection>

          <FormSection title="Review Images (Optional)" icon={ImageIcon}>
            <div className="space-y-4">
              <Label>Image URLs (one per line, max 3)</Label>
              <textarea
                value={imageUrls}
                onChange={handleImageUrlsChange}
                placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                rows={3}
                className="w-full bg-zinc-50 border border-zinc-100 p-4 text-[13px] font-medium outline-none focus:border-black resize-none"
              />
              {formData.images.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {formData.images.slice(0, 3).map((img, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[10px] text-zinc-400"
                    >
                      Image {idx + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>
        </div>

        <div className="lg:col-span-4 space-y-12">
          <div className="bg-zinc-50 border border-zinc-100 p-8 space-y-10">
            <FormSection title="Rating" icon={Star}>
              <StarRating
                value={formData.rating}
                onChange={(val) => setFormData((prev) => ({ ...prev, rating: val }))}
              />
            </FormSection>

            <FormSection title="Status" icon={FileText}>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-12 px-4 text-[13px] font-bold border border-zinc-200 bg-white outline-none focus:border-black"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </FormSection>

            <FormSection title="Visibility" icon={Quote}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-5 w-5 accent-black"
                />
                <span className="text-[12px] font-medium text-zinc-600">
                  Feature on homepage
                </span>
              </label>
            </FormSection>
          </div>
        </div>
      </div>

      <div className="pt-16 border-t border-zinc-100 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-14 px-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-100 hover:text-black transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isLoading || formData.rating === 0}
          className="h-14 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : initialData._id ? "Update Testimonial" : "Create Testimonial"}
        </button>
      </div>
    </form>
  );
}
