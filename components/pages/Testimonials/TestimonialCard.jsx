"use client";

import Image from "next/image";
import Stars from "@/components/pages/Product/Reviews/Stars";
import { BadgeCheck } from "lucide-react";

export default function TestimonialCard({ testimonial, onClick }) {
  const {
    customerName,
    customerTitle,
    avatar,
    content,
    rating,
    isVerified,
    images = [],
  } = testimonial;

  const hasImages = images && images.length > 0;
  const cardImage = images[0];

  // Map testimonial to review format for ReviewModal
  const mappedReview = {
    name: customerName,
    userImage: avatar,
    title: "",
    body: content,
    rating,
    verified: isVerified,
    images,
    date: testimonial.createdAt
      ? new Date(testimonial.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
  };

  return (
    <div
      onClick={() => onClick?.(testimonial, mappedReview)}
      className="group flex flex-col overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl bg-[#f5f5f5] text-black break-inside-avoid mb-4 lg:mb-6"
    >
      {/* Image Section */}
      {hasImages && (
        <div className="w-full flex flex-col">
          <div className="aspect-4/3 overflow-hidden relative">
            <Image
              src={cardImage}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
            />
          </div>

          {/* Secondary Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-1 p-1 bg-white/50 border-t border-gray-100 overflow-x-auto scrollbar-hide">
              {images.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative w-10 h-10 shrink-0 overflow-hidden rounded-[2px] opacity-70 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {images.length > 5 && (
                <div className="w-10 h-10 shrink-0 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 rounded-[2px]">
                  +{images.length - 5}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <Stars count={rating} size={13} />
          {isVerified && (
            <span className="text-[8px] font-semibold tracking-widest uppercase border border-gray-200 text-gray-400 px-2 py-[2px] flex items-center gap-1">
              <BadgeCheck size={10} className="text-emerald-500" />
              Verified
            </span>
          )}
        </div>

        <p className="text-[12px] leading-[1.8] text-gray-500 flex-1 line-clamp-4 italic">
          &ldquo;{content}&rdquo;
        </p>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
          <div className="relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold overflow-hidden shrink-0 bg-black text-white">
            {avatar ? (
              <Image
                src={avatar}
                alt={customerName}
                fill
                className="object-cover"
              />
            ) : (
              customerName.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-black">
              {customerName}
            </span>
            {customerTitle && (
              <span className="text-[10px] text-gray-400">
                {customerTitle}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
