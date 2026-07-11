"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import SocialGrid from "@/components/pages/Social/SocialGrid";

export default function SocialPage() {
  return (
    <div className="w-full min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto font-montserrat">
      {/* Header */}
      <div className="max-w-[800px] mx-auto mb-20">
        <div className="flex flex-col gap-6 items-center text-center">
          <Breadcrumb />
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-light tracking-tight text-black uppercase leading-tight">
            Social Feed
          </h1>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
            <span className="w-8 h-px bg-gray-200" />
            Follow Us On Social Media
            <span className="w-8 h-px bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1200px] mx-auto">
        <SocialGrid />
      </div>

      {/* Footer Hook */}
      <div className="max-w-[800px] mx-auto mt-24 pt-12 border-t border-gray-100 flex flex-col items-center text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black mb-4">
          Stay Connected
        </p>
        <p className="text-xs tracking-widest text-gray-400">
          Follow us on your favorite platform for the latest drops and behind-the-scenes content.
        </p>
      </div>
    </div>
  );
}
