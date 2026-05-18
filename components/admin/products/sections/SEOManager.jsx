"use client";
import React from "react";
import { Label, SectionHeader } from "./Shared";
import { Globe } from "lucide-react";

const SEOManager = ({ product, setProduct }) => {
  // strip HTML from description for preview
  const cleanDescription = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const currentTitle = product.seoTitle || product.title || "Product Title";
  const currentDescription = product.seoDescription || cleanDescription(product.description) || "No description provided. Add an SEO meta description or product description to preview.";

  const titleLength = product.seoTitle?.length || 0;
  const descLength = product.seoDescription?.length || 0;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <SectionHeader
        label="Block 08"
        title="Search Engine Optimization (SEO)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-montserrat">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 space-y-8">
          {/* SEO Title Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Meta Title</Label>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${titleLength > 60 ? "text-red-500" : titleLength > 40 ? "text-emerald-600" : "text-zinc-400"}`}>
                {titleLength} / 60 Chars
              </span>
            </div>
            <input
              type="text"
              value={product.seoTitle || ""}
              onChange={(e) => setProduct({ ...product, seoTitle: e.target.value })}
              placeholder="e.g. Premium Oversized Black T-Shirt | XIROO"
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-sm font-medium placeholder:text-zinc-300 text-black py-2"
            />
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              Recommend 50-60 characters. If empty, the product title will be used by default.
            </p>
          </div>

          {/* SEO Description Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Meta Description</Label>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${descLength > 160 ? "text-red-500" : descLength > 120 ? "text-emerald-600" : "text-zinc-400"}`}>
                {descLength} / 160 Chars
              </span>
            </div>
            <textarea
              value={product.seoDescription || ""}
              onChange={(e) => setProduct({ ...product, seoDescription: e.target.value })}
              placeholder="Provide a concise description of the product for search engine results..."
              rows={4}
              className="w-full bg-zinc-50/50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-zinc-300 text-black p-4 resize-none leading-relaxed"
            />
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              Recommend 150-160 characters. If empty, the product description text will be used by default.
            </p>
          </div>

          {/* SEO Keywords Input */}
          <div className="space-y-3">
            <Label>Keywords</Label>
            <input
              type="text"
              value={product.seoKeywords || ""}
              onChange={(e) => setProduct({ ...product, seoKeywords: e.target.value })}
              placeholder="e.g. tshirt, oversized, black shirt, premium wear"
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all text-sm font-medium placeholder:text-zinc-300 text-black py-2"
            />
            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
              Enter keywords separated by commas to help categorize search indexing.
            </p>
          </div>
        </div>

        {/* Right Column: Premium Search Engine Google Snippet Preview */}
        <div className="lg:col-span-5 space-y-4">
          <Label>Search Engine Snippet Preview</Label>
          <div className="bg-zinc-50 border border-zinc-200/80 p-6 md:p-8 space-y-4 shadow-inner">
            <div className="flex items-center gap-2 text-zinc-400">
              <Globe size={14} className="text-zinc-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Google SERP Simulator</span>
            </div>
            
            <div className="bg-white border border-zinc-200 p-6 rounded-lg shadow-sm space-y-2 select-none hover:shadow-md transition-shadow duration-300">
              {/* Google URL Line */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-500">
                  X
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-zinc-800 font-semibold leading-none">XIROO</span>
                  <span className="text-[9px] text-zinc-400 leading-none mt-0.5 break-all">
                    https://xirooshop.com › product › {product.slug || product._id || "slug"}
                  </span>
                </div>
              </div>

              {/* Google Clickable Title */}
              <h3 className="text-[18px] text-[#1a0dab] font-medium leading-snug hover:underline cursor-pointer break-words">
                {currentTitle.length > 70 ? `${currentTitle.substring(0, 70)}...` : currentTitle}
              </h3>

              {/* Google Description Snippet */}
              <p className="text-[12px] text-[#4d5156] leading-relaxed break-words">
                {currentDescription.length > 165 ? `${currentDescription.substring(0, 165)}...` : currentDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOManager;
