"use client";
import { useState, useEffect, useRef } from "react";
import { X, Save, Tag, Plus } from "lucide-react";

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) titleRef.current.focus();
  }, []);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), tags });
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white border border-zinc-200 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-[18px] font-bold text-zinc-900 placeholder:text-zinc-300 outline-none flex-1 bg-transparent"
          />
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={12} />
              Save
            </button>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="px-6 py-3 border-b border-zinc-50 flex items-center gap-2 flex-wrap">
          <Tag size={12} className="text-zinc-400 flex-shrink-0" />
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-600"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-zinc-400 hover:text-red-500"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tag..."
            className="text-[11px] text-zinc-500 outline-none bg-transparent flex-1 min-w-[80px] placeholder:text-zinc-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-full p-6 text-[14px] text-zinc-700 leading-relaxed outline-none resize-none bg-transparent placeholder:text-zinc-300"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-50 flex items-center justify-between">
          <p className="text-[10px] text-zinc-400">
            {content.length.toLocaleString()} characters
          </p>
          <p className="text-[10px] text-zinc-400">
            Ctrl+S to save  •  Esc to close
          </p>
        </div>
      </div>
    </div>
  );
}
