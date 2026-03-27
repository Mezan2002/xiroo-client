"use client";

import React from "react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6">
        {/* Minimalist Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-2 border-gray-100 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
        
        {/* Identity Text */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.4em] text-black">
            XIROO
          </span>
          <div className="h-px w-8 bg-black/20" />
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-400">
             Synchronizing Boutique Registry
          </span>
        </div>
      </div>
    </div>
  );
}
