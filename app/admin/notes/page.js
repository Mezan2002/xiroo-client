"use client";
import { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { useNotes } from "@/hooks/api/useNotes";
import { StickyNote, Plus, Search, X, Filter } from "lucide-react";
import NoteCard from "./sections/NoteCard";
import NoteEditor from "./sections/NoteEditor";

export default function NotesPage() {
  const { useNotesList, useNoteTags, createNote, updateNote, togglePin, deleteNote } = useNotes();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [editor, setEditor] = useState({ open: false, note: null });

  const { data: response, isLoading } = useNotesList(1, 100, search, activeTag);
  const { data: tagsResponse } = useNoteTags();

  const notes = response?.data?.notes || [];
  const tags = tagsResponse?.data || [];
  const pinnedNotes = notes.filter((n) => n.isPinned);
  const otherNotes = notes.filter((n) => !n.isPinned);

  const handleCreate = () => setEditor({ open: true, note: null });
  const handleEdit = (note) => setEditor({ open: true, note });
  const handleClose = () => setEditor({ open: false, note: null });

  const handleSave = (data) => {
    if (editor.note) {
      updateNote.mutate({ id: editor.note._id, data }, { onSuccess: handleClose });
    } else {
      createNote.mutate(data, { onSuccess: handleClose });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this note?")) {
      deleteNote.mutate(id);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24">
      <ModuleHeader
        label="Notes"
        title="Business Notes"
        icon={StickyNote}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full h-10 pl-9 pr-4 text-[13px] font-medium border border-zinc-200 bg-white outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 h-10 px-5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          <Plus size={14} />
          New Note
        </button>
      </div>

      {/* Tags Filter */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={12} className="text-zinc-400" />
          <button
            onClick={() => setActiveTag("")}
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 border transition-colors ${!activeTag ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
              className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 border transition-colors ${activeTag === tag ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-zinc-50 animate-pulse border border-zinc-100" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-zinc-50 flex items-center justify-center mb-4">
            <StickyNote size={24} className="text-zinc-300" />
          </div>
          <p className="text-[14px] font-semibold text-zinc-800 mb-1">
            {search || activeTag ? "No notes found" : "No notes yet"}
          </p>
          <p className="text-[12px] text-zinc-400 mb-6">
            {search || activeTag ? "Try a different search or tag" : "Start writing your business notes"}
          </p>
          {!search && !activeTag && (
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 h-10 px-5 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              <Plus size={14} />
              Create First Note
            </button>
          )}
        </div>
      )}

      {/* Pinned Notes */}
      {!isLoading && pinnedNotes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            Pinned
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onTogglePin={togglePin.mutate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes */}
      {!isLoading && otherNotes.length > 0 && (
        <div className="space-y-4">
          {pinnedNotes.length > 0 && (
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
              All Notes
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEdit}
                onTogglePin={togglePin.mutate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editor.open && (
        <NoteEditor
          note={editor.note}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
