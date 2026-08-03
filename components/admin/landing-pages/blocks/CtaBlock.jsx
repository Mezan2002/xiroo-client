"use client";

export default function CtaBlock({ block, onChange }) {
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
          placeholder="Ready to get started?"
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
            Button Label
          </label>
          <input
            type="text"
            value={block.buttonLabel || ""}
            onChange={(e) => onChange({ buttonLabel: e.target.value })}
            placeholder="Shop Now"
            className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
            Button Link
          </label>
          <input
            type="text"
            value={block.buttonLink || ""}
            onChange={(e) => onChange({ buttonLink: e.target.value })}
            placeholder="/product/..."
            className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
