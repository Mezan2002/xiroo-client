"use client";

import { useStoreSettings } from "@/hooks/api/useStoreSettings";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function InitialModal() {
  const [isVisible, setIsVisible] = useState(false);
  const { settings: storeSettings } = useStoreSettings();

  const imageUrl =
    storeSettings?.identity?.initialModalImage || "/images/luxury-modal-bg.png";

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem("xiroo_initial_modal_shown");
    if (!hasBeenShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    sessionStorage.setItem("xiroo_initial_modal_shown", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-2xl bg-white shadow-2xl overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top right corner of modal */}
        <button
          onClick={closeModal}
          className="absolute -top-8 -right-10 z-20 p-2 text-white hover:rotate-90 transition-all duration-500"
          aria-label="Close"
        >
          <X className="size-6" />
        </button>

        {/* Image */}
        <div className="relative w-full" style={{ aspectRatio: "2400 / 1792" }}>
          <Image
            src={imageUrl}
            alt="Welcome"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
