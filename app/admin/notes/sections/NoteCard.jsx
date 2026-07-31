"use client";
import { Pin, PinOff, Trash2, Clock } from "lucide-react";

export default function NoteCard({ note, onEdit, onTogglePin, onDelete }) {
  const preview = note.content?.slice(0, 180) + (note.content?.length > 180 ? "..." : "");
  const time = new Date(note.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={() => onEdit(note)}
      className={`group relative bg-white border p-5 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all ${note.isPinned ? "border-zinc-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "border-zinc-100"}`}
    >
      {note.isPinned && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] border-t-amber-400 border-r-transparent" />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[14px] font-bold text-zinc-800 line-clamp-1 flex-1">
          {note.title}
        </h3>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(note._id); }}
            className="p-1.5 hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            {note.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
            className="p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-4 mb-4 whitespace-pre-wrap">
        {preview}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {note.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zinc-100 text-zinc-500"
            >
              {tag}
            </span>
          ))}
          {note.tags?.length > 3 && (
            <span className="text-[9px] text-zinc-400">+{note.tags.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-zinc-400">
          <Clock size={10} />
          <span className="text-[9px] font-medium">{time}</span>
        </div>
      </div>
    </div>
  );
}
