"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2, Trash2, ChevronRight } from "lucide-react";

export default function SortableMenuItem({ id, menu, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef} style={style}
      className={`group flex items-center gap-4 p-4 bg-white border border-[#EDECE9] hover:border-[#37352F20] transition-all rounded-lg shadow-sm mb-2 ${isDragging ? 'shadow-xl scale-[1.02] border-black' : ''}`}
    >
      <button {...attributes} {...listeners} className="p-1.5 text-[#37352F40] cursor-grab active:cursor-grabbing hover:bg-[#F7F7F5] rounded-md"><GripVertical size={16} /></button>
      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-[#37352F]">{menu.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[#91918E] font-medium tracking-tight">/{menu.slug}</span>
          <span className="w-1 h-1 rounded-full bg-[#EDECE9]" />
          <span className="text-[11px] text-[#91918E] font-bold uppercase tracking-wider">{menu.categories?.length || 0} Categories</span>
        </div>
      </div>
      <div className="flex items-center gap-6 pr-2">
        <div className="hidden md:flex items-center -space-x-2">
          {menu.categories?.slice(0, 3).map((cat, i) => (
            <div key={i} className="px-2 py-0.5 bg-[#F7F7F5] border border-[#EDECE9] rounded text-[10px] font-bold text-[#37352F80]">{cat.name}</div>
          ))}
          {menu.categories?.length > 3 && <div className="px-2 py-0.5 bg-black text-white rounded text-[10px] font-bold">+{menu.categories.length - 3}</div>}
        </div>
        <div className="h-4 w-px bg-[#EDECE9]" />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(menu)} className="p-2 text-[#37352F40] hover:bg-[#F7F7F5] hover:text-[#37352F] rounded-md"><Edit2 size={16} /></button>
          <button onClick={() => onDelete(menu._id)} className="p-2 text-[#37352F40] hover:bg-red-50 hover:text-red-500 rounded-md"><Trash2 size={16} /></button>
        </div>
        <ChevronRight size={16} className="text-[#37352F20] group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
