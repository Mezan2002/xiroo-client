import Image from "next/image";
import Stars from "./Stars";

export default function ReviewCard({
  review,
  onClick,
  variant = "light",
  allPhotos = [],
  setLightboxIndex,
}) {
  const isBlack = variant === "black";
  const cardImage = review.images?.[0] || review.image;

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl ${
        isBlack ? "bg-black text-white" : "bg-[#f5f5f5] text-black"
      } ${review.span === "photo-overlay" ? "relative min-h-[320px]" : ""}`}
    >
      {review.span === "photo-overlay" ? (
        <>
          {cardImage && (
            <Image
              src={cardImage}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
            />
          )}
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
              <div className="relative w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold overflow-hidden shrink-0 bg-white/10 text-white ring-1 ring-white/20">
                {review.userImage ? (
                  <Image
                    src={review.userImage}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
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
                <Image
                  src={cardImage}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-700"
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
                className={`relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold overflow-hidden shrink-0 ${
                  isBlack ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                {review.userImage ? (
                  <Image
                    src={review.userImage}
                    alt={review.name}
                    fill
                    className="object-cover"
                  />
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
