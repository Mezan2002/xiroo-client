"use client";
import { Plus, X } from "lucide-react";

export default function FaqBlock({ block, onChange }) {
  const items = block.items || [{ question: "", answer: "" }];

  const addItem = () => {
    onChange({ items: [...items, { question: "", answer: "" }] });
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ items: updated });
  };

  const removeItem = (index) => {
    onChange({ items: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
          Section Heading
        </label>
        <input
          type="text"
          value={block.heading || ""}
          onChange={(e) => onChange({ heading: e.target.value })}
          placeholder="Frequently Asked Questions"
          className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
        />
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="border border-zinc-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Q{index + 1}
              </span>
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={item.question}
              onChange={(e) => updateItem(index, "question", e.target.value)}
              placeholder="Question..."
              className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all"
            />
            <textarea
              value={item.answer}
              onChange={(e) => updateItem(index, "answer", e.target.value)}
              placeholder="Answer..."
              rows={3}
              className="w-full px-3 py-2.5 text-[13px] bg-zinc-50 border border-zinc-200 focus:border-black focus:bg-white outline-none transition-all resize-none"
            />
          </div>
        ))}
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black border border-dashed border-zinc-200 hover:border-black transition-all w-full justify-center"
        >
          <Plus className="w-3.5 h-3.5" />
          Add FAQ Item
        </button>
      </div>
    </div>
  );
}
