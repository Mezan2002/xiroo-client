"use client";
import ImageField from "./ImageField";

export default function ImageBlock({ block, onChange }) {
  return (
    <div className="space-y-4">
      <ImageField
        value={block.url || ""}
        onChange={(url) => onChange({ url: url })}
        label="Image"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
            Alt Text
          </label>
          <input
            type="text"
            value={block.alt || ""}
            onChange={(e) => onChange({ alt: e.target.value })}
            placeholder="Describe the image..."
            className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
            Caption
          </label>
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Optional caption..."
            className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
