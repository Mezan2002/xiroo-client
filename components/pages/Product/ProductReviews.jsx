"use client";
import { Button } from "@/components/ui/Button";
import { useReviews } from "@/hooks/api/useReviews";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import EmptyReviews from "./Reviews/EmptyReviews";
import PhotoLightbox from "./Reviews/PhotoLightbox";
import ReviewCard from "./Reviews/ReviewCard";
import ReviewFormModal from "./Reviews/ReviewFormModal";
import ReviewModal from "./Reviews/ReviewModal";
import { buildMasonryColumns } from "./Reviews/utils";

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

  const renderCol = (reviews, colIndex) =>
    reviews.map((r, i) => {
      const variant =
        (colIndex === 1 && i % 2 === 0) || (colIndex === 2 && i % 2 === 1)
          ? "black"
          : "light";
      return (
        <ReviewCard
          key={r.id}
          review={r}
          variant={variant}
          allPhotos={allPhotos}
          setLightboxIndex={setLightboxIndex}
          onClick={() => setSelectedReview(r)}
        />
      );
    });

  if (isLoading)
    return (
      <div className="h-48 flex items-center justify-center text-zinc-400">
        Loading feedback...
      </div>
    );

  return (
    <section className="py-24 px-6 md:px-14 bg-white font-montserrat">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="space-y-4">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.4em]">
              Community Insight
            </h2>
            <p className="text-4xl md:text-6xl font-light text-black tracking-tight leading-none">
              Client <span className="italic font-serif">Perspectives</span>
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-light text-black">
                {(
                  allReviews.reduce((acc, r) => acc + r.rating, 0) /
                    allReviews.length || 0
                ).toFixed(1)}
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                  Average Rating
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">
                  {allReviews.length} Reviews Found
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="lg"
              icon={ArrowRight}
              onClick={() => setShowForm(true)}
              className="border-black text-black hover:bg-black hover:text-white transition-all px-8 py-4! h-auto"
            >
              Write your feedback
            </Button>
          </div>
        </div>

        {allReviews.length === 0 ? (
          <EmptyReviews onWriteReview={() => setShowForm(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="flex flex-col gap-6 md:gap-8">
                {renderCol(col1, 0)}
              </div>
              <div className="flex flex-col gap-6 md:gap-8 md:pt-12">
                {renderCol(col2, 1)}
              </div>
              <div className="flex flex-col gap-6 md:gap-8 lg:pt-24">
                {renderCol(col3, 2)}
              </div>
            </div>

            {!showAll && allReviews.length > 6 && (
              <div className="mt-20 flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowAll(true)}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors py-10"
                >
                  Discover More Feedback ({allReviews.length - 6})
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <ReviewModal
        review={selectedReview}
        onClose={() => setSelectedReview(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={allPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {showForm && (
        <ReviewFormModal
          productId={productId}
          onClose={() => setShowForm(false)}
        />
      )}
    </section>
  );
}
