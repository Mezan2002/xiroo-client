"use client";

export default function CustomHtmlBlock({ block, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
        HTML Content
      </label>
      <textarea
        value={block.content || ""}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="<div>Your HTML here...</div>"
        rows={10}
        className="w-full px-3 py-2.5 text-[13px] font-mono bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all resize-none"
      />
      <p className="text-[10px] text-zinc-300">
        Raw HTML. Use with caution — no sanitization is applied.
      </p>
    </div>
  );
}
