"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Edit2, GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INDENTATION_WIDTH = 24;

const DropIndicator = ({ depth }) => (
  <div
    className="absolute left-0 right-0 h-0.5 bg-black z-50 pointer-events-none"
    style={{
      marginLeft: `${depth * INDENTATION_WIDTH + 24}px`,
      transform: 'translateY(-1px)'
    }}
  >
    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-black bg-white" />
  </div>
);

export default function CategoryItem({
  id,
  category,
  depth,
  onAddSub,
  onToggle,
  onRename,
  onDelete,
  onSelect,
  isExpanded,
  isEditing,
  setEditingId,
  isOver,
  projectedDepth,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const inputRef = useRef(null);
  const [newName, setNewName] = useState(category.name);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== category.name) onRename(id, newName.trim());
    setEditingId(null);
  };

  const startEditing = () => {
    setNewName(category.name);
    setEditingId(id);
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group mb-1 relative">
      {isOver && <DropIndicator depth={projectedDepth} />}
      <div
        className={`flex items-center gap-2 p-2 hover:bg-[#F7F7F5] border border-transparent hover:border-[#EDECE9] transition-all duration-200 ${isDragging ? 'opacity-0' : ''}`}
        style={{ paddingLeft: `${8 + depth * INDENTATION_WIDTH}px` }}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-[#37352F40] cursor-grab active:cursor-grabbing hover:bg-[#EBEBE9] rounded-sm transition-colors"
        >
          <GripVertical size={14} />
        </button>

        <button
          onClick={() => onToggle(id)}
          className={`p-1 text-[#37352F80] hover:bg-[#EBEBE9] rounded-sm transition-all ${category.hasChildren ? "" : "invisible"}`}
        >
          <span
            className="flex items-center justify-center transition-transform duration-200"
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
          >
            <ChevronDown size={14} />
          </span>
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") setEditingId(null);
            }}
            onBlur={handleRename}
            className="flex-1 bg-white border border-black/10 px-2 py-0.5 text-[14px] font-medium text-[#37352F] outline-none focus:border-black/30"
          />
        ) : (
          <span
            onDoubleClick={startEditing}
            onClick={() => onSelect(category)}
            className={`flex-1 text-[14px] font-medium text-[#37352F] cursor-pointer hover:bg-black/5 px-2 rounded-sm truncate py-0.5 ${depth > 0 ? 'text-[#37352F80]' : ''}`}
          >
            {category.name}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity pr-1">
          {depth === 0 && (
            <button onClick={() => onAddSub(id)} className="p-1.5 text-[#37352F40] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-sm" title="Add sub-category">
              <Plus size={14} />
            </button>
          )}
          <button onClick={startEditing} className="p-1.5 text-[#37352F40] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-sm" title="Rename">
            <Edit2 size={14} />
          </button>
          <button onClick={() => onDelete(id)} className="p-1.5 text-[#37352F40] hover:bg-red-50 hover:text-red-500 rounded-sm" title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
