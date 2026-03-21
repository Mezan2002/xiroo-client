"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "../ui/Button";

export function UserAccountDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-1001 transition-all duration-300 ${
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Backdrop Backdrop Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel Container */}
      <div className="absolute inset-0 flex justify-end overflow-hidden">
        {/* Sidebar Panel */}
        <aside
          className={`h-full w-full sm:w-[420px] bg-white text-black shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full relative">
            {/* Centered Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-12 text-center">
              {/* User Icon Circle */}
              <div className="w-24 h-24 rounded-full border border-gray-100 flex items-center justify-center mb-10 bg-gray-50 backdrop-blur-[2px]">
                <User className="w-10 h-10 text-black/20 stroke-1" />
              </div>

              {/* Headline */}
              <h2 className="text-[28px] font-black tracking-tighter leading-none uppercase mb-6 text-black inline-block">
                JOIN THE COLLECTION
              </h2>

              {/* Subtext */}
              <p className="text-xs text-black/40 leading-relaxed mb-12 uppercase tracking-widest font-semibold text-center">
                SYNC YOUR SHOPPING EXPERIENCE ACROSS ALL DEVICES. SAVE
                WISHLISTS, TRACK ORDERS, AND GET FASTER CHECKOUT.
              </p>

              {/* Action Buttons */}
              <div className="w-full space-y-4 max-w-[340px]">
                <Button
                  href="/login"
                  onClick={onClose}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  SIGN IN
                </Button>
                <Button
                  href="/register"
                  onClick={onClose}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  CREATE ACCOUNT
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
