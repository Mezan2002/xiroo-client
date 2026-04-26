import Breadcrumb from "@/components/ui/Breadcrumb";
import React from "react";

/**
 * Senior Dev Component: PolicyPage
 * A premium, typography-focused layout for legal and information pages.
 * Designed with the "Studio" aesthetic: minimalist, high-contrast, and spacious.
 */
export default function PolicyPage({ title, lastUpdated, children }) {
  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat">
      {/* Page Header */}
      <div className="max-w-[800px] mx-auto mb-20">
        <div className="flex flex-col gap-6 items-center text-center">
          <Breadcrumb />
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight">
            {title}
          </h1>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              <span className="w-8 h-px bg-gray-200" />
              Last Updated: {lastUpdated}
              <span className="w-8 h-px bg-gray-200" />
            </div>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-[800px] mx-auto">
        <div className="prose prose-sm md:prose-base prose-zinc max-w-none 
          prose-headings:uppercase prose-headings:tracking-[0.15em] prose-headings:font-bold prose-headings:text-black
          prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-8
          prose-li:text-gray-600 prose-li:mb-2
          prose-strong:text-black prose-strong:font-bold
          prose-hr:border-gray-100 prose-hr:my-12
        ">
          {children}
        </div>
      </div>
      
      {/* Trust Footer Hook */}
      <div className="max-w-[800px] mx-auto mt-24 pt-12 border-t border-gray-100 flex flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-4">
          Questions regarding our policies?
        </p>
        <a 
          href="mailto:support@xirooshop.com" 
          className="text-xs tracking-widest text-gray-400 hover:text-black transition-colors underline underline-offset-4 decoration-gray-200"
        >
          support@xirooshop.com
        </a>
      </div>
    </div>
  );
}
