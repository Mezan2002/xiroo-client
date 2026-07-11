"use client";
import { useState } from "react";
import { useTestimonials } from "@/hooks/api/useTestimonials";
import Link from "next/link";
import { Pencil, Trash2, Star, BadgeCheck, MoreHorizontal } from "lucide-react";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function TestimonialTable({ testimonials = [] }) {
  const { deleteTestimonial, updateTestimonialStatus, toggleFeatured } = useTestimonials();
  const [openMenu, setOpenMenu] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonial.mutate(id);
    }
  };

  const handleStatusChange = (id, status) => {
    updateTestimonialStatus.mutate({ id, status });
    setOpenMenu(null);
  };

  const handleToggleFeatured = (id) => {
    toggleFeatured.mutate(id);
    setOpenMenu(null);
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-400">
        <p className="text-[13px] font-medium">No testimonials found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100">
      {testimonials.map((testimonial) => (
        <div
          key={testimonial._id}
          className="flex items-start gap-4 p-6 hover:bg-zinc-50 transition-colors"
        >
          {/* Avatar */}
          <div className="shrink-0">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.customerName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-600">
                {testimonial.customerName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-bold text-zinc-900">
                {testimonial.customerName}
              </span>
              {testimonial.isVerified && (
                <BadgeCheck size={14} className="text-emerald-500" />
              )}
              {testimonial.isFeatured && (
                <Star size={12} className="text-amber-500 fill-amber-500" />
              )}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_COLORS[testimonial.status]}`}
              >
                {testimonial.status}
              </span>
            </div>
            {testimonial.customerTitle && (
              <p className="text-[11px] text-zinc-400 mb-1">{testimonial.customerTitle}</p>
            )}
            <p className="text-[12px] text-zinc-600 line-clamp-2">{testimonial.content}</p>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={
                    star <= testimonial.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-zinc-200"
                  }
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 relative">
            <button
              onClick={() => setOpenMenu(openMenu === testimonial._id ? null : testimonial._id)}
              className="p-2 hover:bg-zinc-100 transition-colors"
            >
              <MoreHorizontal size={16} className="text-zinc-400" />
            </button>

            {openMenu === testimonial._id && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-zinc-200 shadow-lg z-10">
                <Link
                  href={`/admin/testimonials/${testimonial._id}`}
                  className="flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setOpenMenu(null)}
                >
                  <Pencil size={14} /> Edit
                </Link>
                <button
                  onClick={() => handleToggleFeatured(testimonial._id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  <Star size={14} /> {testimonial.isFeatured ? "Unfeature" : "Feature"}
                </button>
                {testimonial.status !== "approved" && (
                  <button
                    onClick={() => handleStatusChange(testimonial._id, "approved")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-emerald-600 hover:bg-emerald-50"
                  >
                    Approve
                  </button>
                )}
                {testimonial.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusChange(testimonial._id, "rejected")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-amber-600 hover:bg-amber-50"
                  >
                    Reject
                  </button>
                )}
                {testimonial.status !== "pending" && (
                  <button
                    onClick={() => handleStatusChange(testimonial._id, "pending")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    Set Pending
                  </button>
                )}
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 border-t border-zinc-100"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
