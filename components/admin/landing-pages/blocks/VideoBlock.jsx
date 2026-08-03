"use client";

export default function VideoBlock({ block, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
          Video URL
        </label>
        <input
          type="text"
          value={block.url || ""}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="YouTube, Vimeo, or direct video URL..."
          className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
        />
        <p className="text-[10px] text-zinc-300 mt-1">
          Supports YouTube, Vimeo, or direct .mp4 URLs
        </p>
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
          Poster Image URL (Optional)
        </label>
        <input
          type="text"
          value={block.poster || ""}
          onChange={(e) => onChange({ poster: e.target.value })}
          placeholder="Thumbnail image URL..."
          className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
        />
      </div>
    </div>
  );
}
