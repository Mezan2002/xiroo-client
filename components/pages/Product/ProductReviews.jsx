"use client";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Send,
  Star,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah J.",
    location: "New York, US",
    date: "Oct 2025",
    rating: 5,
    title: "Absolutely breathtaking",
    body: "I cannot put into words how genuinely stunning this piece is in a dark room. The LED element curves so seamlessly — it feels like pure magic. I've placed it in my bedroom corner and it completely transforms the atmosphere. The packaging was premium too — felt like unboxing a luxury item. Highly recommend to anyone who appreciates beautiful design.",
    image: "/images/comparison-dark.png",
    verified: true,
  },
  {
    id: 2,
    name: "James K.",
    location: "London, UK",
    date: "Nov 2025",
    rating: 5,
    title: "Premium. Period.",
    body: "Arrived perfectly packaged. The matte aluminum finish is incredibly robust and the warm glow makes any room feel like a luxury suite. My guests always ask about it the moment they walk in. This is the kind of product that makes you want to redesign your entire room around it.",
    image: null,
    verified: true,
  },
  {
    id: 3,
    name: "Anika R.",
    location: "Berlin, DE",
    date: "Dec 2025",
    rating: 4,
    title: "Aesthetic perfection",
    body: "Absolute bedroom centrepiece. Wish the USB cable was a bit longer — everything else is flawless. The glow it casts on the wall is incredibly warm and even. I've tried many LED lamps and this is by far the best one I've purchased.",
    image: "/images/comparison-light.png",
    verified: true,
  },
  {
    id: 4,
    name: "Chen M.",
    location: "Tokyo, JP",
    date: "Jan 2026",
    rating: 5,
    title: "Worth every penny",
    body: "Gifted one to my sister and she cried. True statement about how beautiful this product is. The quality exceeded all expectations and delivery was surprisingly fast to Japan.",
    image: "/images/featured-product-main.png",
    verified: false,
  },
];

const PHOTOS = [
  "/images/image-2.jpeg",
  "/images/comparison-dark.png",
  "/images/comparison-light.png",
  "/images/featured-product-main.png",
  "/images/product-coffee-1.png",
  "/images/product-travel-bottles.png",
  "/images/image-2.jpeg",
  "/images/comparison-dark.png",
];

const EXTRA_REVIEWS = [
  {
    id: 5,
    name: "Priya S.",
    location: "Mumbai, IN",
    date: "Jan 2026",
    rating: 5,
    title: "Gifted and she loved it",
    body: "Bought this as a birthday gift for my roommate. She screamed when she opened it. The packaging alone is gift-worthy, and the lamp is even more beautiful in person.",
    image: "/images/product-coffee-1.png",
    verified: true,
  },
  {
    id: 6,
    name: "Luca M.",
    location: "Milan, IT",
    date: "Feb 2026",
    rating: 4,
    title: "Great for mood lighting",
    body: "Perfect for creating a cozy atmosphere. I use it every evening. Build quality is excellent and the minimal design goes with everything.",
    image: null,
    verified: true,
  },
  {
    id: 7,
    name: "Emma T.",
    location: "Sydney, AU",
    date: "Mar 2026",
    rating: 5,
    title: "Better than the photos suggest",
    body: "Takes your breath away when you first switch it on. Photos don't do it justice. The glow is incredibly soft and diffused — zero harsh spots.",
    image: "/images/product-travel-bottles.png",
    verified: false,
  },
  {
    id: 8,
    name: "Oliver W.",
    location: "Berlin, DE",
    date: "Mar 2026",
    rating: 5,
    title: "Minimalist dream",
    body: "Completely changes the vibe of my studio. The high-quality materials and simple lines make it a focal point without being distracting.",
    image: null,
    verified: true,
  },
];

function Stars({ count, size = 12, interactive = false, onRate }) {
  return (
    <div className="flex gap-[3px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= count ? "currentColor" : "none"}
          strokeWidth={i <= count ? 0 : 1.5}
          onClick={() => interactive && onRate?.(i)}
          className={`${i <= count ? "text-black" : "text-gray-300"} ${interactive ? "cursor-pointer hover:text-black hover:scale-110 transition-transform" : ""}`}
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
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
      >
        <X size={28} />
      </button>

      {/* Prev */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Main Image */}
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

      {/* Next */}
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-black tracking-[0.3em] uppercase text-white/40">
        {index + 1} <span className="mx-2">/</span> {photos.length}
      </div>
    </div>
  );
}

// ── Reusable Review Card Component ──
function ReviewCard({ review, onClick, variant = "light" }) {
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
            src={review.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
            <Stars count={review.rating} size={11} />
            <h3 className="text-[14px] md:text-[16px] font-black text-white leading-tight">
              &ldquo;{review.title}&rdquo;
            </h3>
            <p className="text-[10px] text-white/50 tracking-wide uppercase font-bold">
              {review.name} · {review.location}
            </p>
          </div>
        </>
      ) : (
        <>
          {review.image && (
            <div className="aspect-[4/3] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
              />
            </div>
          )}
          <div className="p-6 flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <Stars count={review.rating} size={13} />
              {review.verified && (
                <span
                  className={`text-[8px] font-black tracking-widest uppercase border px-2 py-[2px] ${isBlack ? "border-white/20 text-white/40" : "border-gray-200 text-gray-400"}`}
                >
                  Verified
                </span>
              )}
            </div>
            <h3
              className={`text-[16px] md:text-[18px] font-black leading-snug ${isBlack ? "text-white" : "text-black"}`}
            >
              &ldquo;{review.title}&rdquo;
            </h3>
            <p
              className={`text-[12px] leading-[1.8] flex-1 ${isBlack ? "text-white/60" : "text-gray-500"}`}
            >
              {review.body}
            </p>
            <div
              className={`flex items-center gap-2 pt-4 border-t ${isBlack ? "border-white/10" : "border-gray-200"}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${isBlack ? "bg-white text-black" : "bg-black text-white"}`}
              >
                {review.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[12px] font-black ${isBlack ? "text-white" : "text-black"}`}
                >
                  {review.name}
                </span>
                <span
                  className={`text-[10px] ${isBlack ? "text-white/40" : "text-gray-400"}`}
                >
                  {review.location} · {review.date}
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
  if (!review) return null;
  return (
    <div
      className="fixed inset-0 z-9999 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        className="relative z-10 w-full md:max-w-[680px] bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[92vh] md:max-h-[80vh] rounded-t-2xl md:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo side */}
        {review.image && (
          <div className="w-full md:w-[240px] shrink-0 aspect-[4/3] md:aspect-auto overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content side */}
        <div className="flex flex-col flex-1 p-7 overflow-y-auto">
          <div className="flex items-start justify-between mb-5">
            <Stars count={review.rating} size={14} />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors p-1 -mt-1 -mr-1"
            >
              <X size={18} />
            </button>
          </div>

          <h3 className="text-[22px] font-black text-black leading-snug mb-4 tracking-tight">
            &ldquo;{review.title}&rdquo;
          </h3>
          <p className="text-[13px] text-gray-500 leading-[1.9] flex-1">
            {review.body}
          </p>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[12px] font-black shrink-0">
              {review.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-black text-black">{review.name}</p>
              <p className="text-[11px] text-gray-400">
                {review.location} · {review.date}
              </p>
            </div>
            {review.verified && (
              <span className="text-[9px] font-black tracking-widest border border-gray-200 text-gray-400 px-2 py-1 uppercase">
                Verified
              </span>
            )}
          </div>

          {/* Prev / Next */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={onPrev}
              className="flex items-center gap-1 text-[11px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">
              Review
            </span>
            <button
              onClick={onNext}
              className="flex items-center gap-1 text-[11px] font-black text-gray-400 hover:text-black transition-colors uppercase tracking-wider"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Write Review Form Modal ──
function ReviewFormModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHoveredRating] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    body: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    setImageFiles((prev) => [...prev, ...previews].slice(0, 6));
  };

  const removeImage = (idx) =>
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !form.name || !form.body) return;
    setSubmitted(true);
  };

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
            <h3 className="text-[15px] font-black text-black tracking-tight">
              Write a Review
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Share your honest experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16 px-7 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
              <Star size={22} className="text-white" fill="currentColor" />
            </div>
            <h4 className="text-[18px] font-black text-black">Thank you!</h4>
            <p className="text-[13px] text-gray-500">
              Your review has been submitted for moderation.
            </p>
            <button
              onClick={onClose}
              className="mt-4 text-[11px] font-black tracking-widest uppercase underline underline-offset-4 text-gray-400 hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 px-7 py-6 overflow-y-auto"
          >
            {/* Star picker */}
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 block mb-2">
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
                    className="p-1"
                  >
                    <Star
                      size={24}
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

            {/* Name + email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 block mb-2">
                  Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Jane D."
                  className="w-full border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="jane@email.com"
                  className="w-full border border-gray-200 bg-[#fafafa] px-4 py-3 text-[13px] text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 block mb-2">
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
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 block mb-2">
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

            {/* Image upload */}
            <div>
              <label className="text-[10px] font-black tracking-widest uppercase text-gray-400 block mb-2">
                Add Photos (up to 6)
              </label>
              <div className="flex flex-wrap gap-2">
                {imageFiles.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-[4px] overflow-hidden bg-gray-100 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
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
                {imageFiles.length < 6 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-[4px] flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-black hover:text-black transition-colors"
                  >
                    <ImagePlus size={18} />
                    <span className="text-[8px] font-black tracking-wider">
                      ADD
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImages}
              />
            </div>

            <Button>
              <div className="flex items-center gap-2">
                <Send size={14} />
                Submit Review
              </div>
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Component ──
export default function ProductReviews() {
  const stripRef = useRef(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  const allReviews = [...REVIEWS, ...EXTRA_REVIEWS];
  const selectedIndex = allReviews.findIndex(
    (r) => r.id === selectedReview?.id,
  );
  const handlePrev = () =>
    setSelectedReview(
      allReviews[(selectedIndex - 1 + allReviews.length) % allReviews.length],
    );
  const handleNext = () =>
    setSelectedReview(allReviews[(selectedIndex + 1) % allReviews.length]);

  return (
    <section className="w-full mt-16 border-t border-gray-100 pb-28 overflow-hidden">
      <div className="px-4 md:px-10 xl:px-16 mt-14">
        {/* ── Top row ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[10px] font-black tracking-[0.22em] uppercase text-gray-400 mb-3">
              Real People · Real Rooms
            </p>
            <h2 className="text-[32px] md:text-[44px] font-black tracking-tight text-black leading-none">
              What customers
              <br />
              <em className="not-italic text-gray-300">are saying</em>
            </h2>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="h-[44px] px-8 bg-black text-white text-[11px] font-black tracking-widest hover:bg-gray-900 transition-colors rounded-none self-start md:self-auto shrink-0"
          >
            Write a Review <ArrowRight size={13} className="ml-2 inline" />
          </Button>
        </div>

        {/* ── Customer photo strip ── */}
        <div className="mb-14 mt-4">
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
            ref={stripRef}
          >
            {[...REVIEWS, ...EXTRA_REVIEWS]
              .filter((r) => r.image)
              .map((r, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedReview(r)}
                  className="w-[84px] h-[84px] shrink-0 rounded-[4px] overflow-hidden bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt=""
                    className="w-full h-full object-cover shadow-sm"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* ── Unified Masonry Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* Column 1: Left (5 units) */}
          <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-4">
            <ReviewCard
              review={REVIEWS[0]}
              onClick={() => setSelectedReview(REVIEWS[0])}
            />
            {showAll && (
              <ReviewCard
                review={EXTRA_REVIEWS[0]}
                onClick={() => setSelectedReview(EXTRA_REVIEWS[0])}
                className="animate-in fade-in slide-in-from-top-4 duration-500"
              />
            )}
          </div>

          {/* Column 2: Middle (4 units) */}
          <div className="md:col-span-6 lg:col-span-4 flex flex-col gap-4">
            <ReviewCard
              variant="black"
              review={REVIEWS[1]}
              onClick={() => setSelectedReview(REVIEWS[1])}
            />
            <ReviewCard
              review={REVIEWS[2]}
              onClick={() => setSelectedReview(REVIEWS[2])}
            />
            {showAll && (
              <>
                <ReviewCard
                  variant="black"
                  review={EXTRA_REVIEWS[1]}
                  onClick={() => setSelectedReview(EXTRA_REVIEWS[1])}
                  className="animate-in fade-in slide-in-from-top-4 duration-700"
                />
                <ReviewCard
                  review={EXTRA_REVIEWS[3]}
                  onClick={() => setSelectedReview(EXTRA_REVIEWS[3])}
                  className="animate-in fade-in slide-in-from-top-4 duration-1000"
                />
              </>
            )}
          </div>

          {/* Column 3: Right (3 units) */}
          <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-4">
            <div
              onClick={() => setSelectedReview(REVIEWS[3])}
              className="cursor-pointer"
            >
              <ReviewCard
                review={{ ...REVIEWS[3], span: "photo-overlay" }}
                onClick={() => setSelectedReview(REVIEWS[3])}
              />
            </div>
            {showAll && (
              <div
                onClick={() => setSelectedReview(EXTRA_REVIEWS[2])}
                className="cursor-pointer animate-in fade-in slide-in-from-top-4 duration-700"
              >
                <ReviewCard
                  review={{ ...EXTRA_REVIEWS[2], span: "photo-overlay" }}
                  onClick={() => setSelectedReview(EXTRA_REVIEWS[2])}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── View all / Load more ── */}
        <div className={`flex justify-center ${showAll ? "mt-4" : "mt-8"}`}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-3 text-[12px] font-black tracking-widest uppercase text-black hover:text-gray-500 transition-colors"
          >
            {showAll ? "Show less" : "View all 104 reviews"}
            <ArrowRight
              size={14}
              className={`transition-transform ${showAll ? "-rotate-90" : "group-hover:translate-x-1"}`}
            />
          </button>
        </div>
      </div>

      {/* ── Modals ── */}
      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
      {showForm && <ReviewFormModal onClose={() => setShowForm(false)} />}

      {/* Photo strip lightbox */}
      {activePhoto !== null && (
        <PhotoLightbox
          photos={PHOTOS}
          initialIndex={activePhoto}
          onClose={() => setActivePhoto(null)}
        />
      )}
    </section>
  );
}
