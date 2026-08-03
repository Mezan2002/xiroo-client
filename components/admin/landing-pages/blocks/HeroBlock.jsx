"use client";
import ImageField from "./ImageField";

export default function HeroBlock({ block, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
          Heading
        </label>
        <input
          type="text"
          value={block.heading || ""}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Main headline..."
          className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
        />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
          Subheading
        </label>
        <input
          type="text"
          value={block.subheading || ""}
          onChange={(e) => onChange({ subheading: e.target.value })}
          placeholder="Supporting text..."
          className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
        />
      </div>
      <ImageField
        value={block.backgroundImage || ""}
        onChange={(url) => onChange({ backgroundImage: url })}
        label="Background Image"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
            CTA Button Label
          </label>
          <input
            type="text"
            value={block.ctaLabel || ""}
            onChange={(e) => onChange({ ctaLabel: e.target.value })}
            placeholder="Shop Now"
            className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
            CTA Link
          </label>
          <input
            type="text"
            value={block.ctaLink || ""}
            onChange={(e) => onChange({ ctaLink: e.target.value })}
            placeholder="/product/..."
            className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
