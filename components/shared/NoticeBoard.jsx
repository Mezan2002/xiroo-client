"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const defaultNotices = [
  "Buy 3+ items, get free delivery!",
  "Cash on delivery available!",
  "Easy returns on sealed items only.",
];

export const NoticeBoard = ({ notices = defaultNotices }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!notices || notices.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? notices.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === notices.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white text-black py-1.5 px-4 text-xs sm:text-sm font-medium flex items-center justify-center relative w-full">
      <div className="flex items-center w-full max-w-7xl mx-auto justify-between">
        <button
          onClick={handlePrev}
          className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
          aria-label="Previous notice"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center px-4 overflow-hidden flex-1">
          <p className="truncate">{notices[currentIndex]}</p>
        </div>

        <button
          onClick={handleNext}
          className="p-1 hover:bg-white/20 rounded-full transition-colors shrink-0"
          aria-label="Next notice"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
