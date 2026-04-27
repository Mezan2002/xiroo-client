import { Star } from "lucide-react";

export default function Stars({ count, size = 12, isBlack = false }) {
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
