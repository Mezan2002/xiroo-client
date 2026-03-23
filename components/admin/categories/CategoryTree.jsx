"use client";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
  Edit2,
  Check,
  X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Sortable Item Component
const SortableCategoryItem = ({
  id,
  category,
  depth,
  onAddSub,
  onToggle,
  onRename,
  onDelete,
  isExpanded,
  isEditing,
  setEditingId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const inputRef = useRef(null);
  const [newName, setNewName] = useState(category.name);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      setNewName(category.name);
    }
  }, [isEditing, category.name]);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(id, newName.trim());
    }
    setEditingId(null);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group mb-1">
      <div className="flex items-center gap-2 p-2 hover:bg-[#F7F7F5] border border-transparent hover:border-[#EDECE9] transition-all duration-200">
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
          <span className="flex items-center justify-center transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
            <ChevronDown size={14} />
          </span>
        </button>

        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
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
          </div>
        ) : (
          <span 
            onDoubleClick={() => setEditingId(id)}
            className="flex-1 text-[14px] font-medium text-[#37352F] cursor-text truncate py-0.5"
          >
            {category.name}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
          <button
            onClick={() => onAddSub(id)}
            className="p-1.5 text-[#37352F40] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-sm transition-colors"
            title="Add sub-category"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => setEditingId(id)}
            className="p-1.5 text-[#37352F40] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-sm transition-colors"
            title="Rename"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 text-[#37352F40] hover:bg-red-50 hover:text-red-500 rounded-sm transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CategoryTree() {
  const [items, setItems] = useState([
    { id: "1", name: "Lighting", parentId: null, depth: 0, hasChildren: true },
    { id: "1-1", name: "String Lamps", parentId: "1", depth: 1, hasChildren: false },
    { id: "1-2", name: "Mood Lights", parentId: "1", depth: 1, hasChildren: false },
    { id: "2", name: "Travel", parentId: null, depth: 0, hasChildren: true },
    { id: "2-1", name: "Dispensing Bottles", parentId: "2", depth: 1, hasChildren: false },
    { id: "3", name: "Home Decor", parentId: null, depth: 0, hasChildren: false },
  ]);

  const [expanded, setExpanded] = useState(["1", "2"]);
  const [editingId, setEditingId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        // Check if movement is valid (e.g., between same depth if we want strict tree)
        // For simplicity in this demo, we'll just allow reordering flatly.
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const addGlobalCategory = () => {
    const newId = `cat-${Date.now()}`;
    setItems(prev => [
      ...prev,
      { id: newId, name: "New Category", parentId: null, depth: 0, hasChildren: false }
    ]);
    setEditingId(newId);
  };

  const addSubCategory = (parentId) => {
    const parentIndex = items.findIndex(i => i.id === parentId);
    if (parentIndex === -1) return;

    const parent = items[parentIndex];
    const newId = `sub-${Date.now()}`;
    const newDepth = parent.depth + 1;

    // Expand parent if it wasn't
    if (!expanded.includes(parentId)) {
      setExpanded(prev => [...prev, parentId]);
    }

    // Mark parent as having children
    const updatedItems = [...items];
    updatedItems[parentIndex] = { ...parent, hasChildren: true };

    // Insert new item right after the parent (or at the end of its current children)
    // For now, we'll insert it right after parent for immediate visibility.
    updatedItems.splice(parentIndex + 1, 0, {
      id: newId,
      name: "New Sub-category",
      parentId,
      depth: newDepth,
      hasChildren: false
    });

    setItems(updatedItems);
    setEditingId(newId);
  };

  const renameCategory = (id, newName) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, name: newName } : item
    ));
  };

  const deleteCategory = (id) => {
    // Recursive delete logic (simplified for flat array with parentIds)
    const toDelete = new Set([id]);
    
    // Find all descendants in the flat list
    // This is a naive approach for flat lists but works for basic nesting
    let changed = true;
    while (changed) {
      changed = false;
      items.forEach(item => {
        if (item.parentId && toDelete.has(item.parentId) && !toDelete.has(item.id)) {
          toDelete.add(item.id);
          changed = true;
        }
      });
    }

    const remainingItems = items.filter(item => !toDelete.has(item.id));
    
    // Update the parent's hasChildren status if all its children are deleted
    const updatedItems = remainingItems.map(item => {
      const stillHasChildren = remainingItems.some(i => i.parentId === item.id);
      return { ...item, hasChildren: stillHasChildren };
    });

    setItems(updatedItems);
  };

  const getVisibleItems = () => {
    // Filter items based on expansion state
    const visible = [];
    const hiddenParents = new Set();

    items.forEach(item => {
      // If a parent is collapsed, hide all descendants
      let isVisible = true;
      let currentParent = item.parentId;
      
      while (currentParent) {
        if (!expanded.includes(currentParent)) {
          isVisible = false;
          break;
        }
        const parent = items.find(i => i.id === currentParent);
        currentParent = parent?.parentId;
      }

      if (isVisible) {
        visible.push(item);
      }
    });

    return visible;
  };

  return (
    <div className="max-w-3xl space-y-8 py-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="bg-white border border-[#EDECE9] p-2 space-y-px shadow-sm">
        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-zinc-50/50">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              No categories defined
            </p>
            <button 
              onClick={addGlobalCategory}
              className="text-[12px] font-medium text-black underline underline-offset-4 hover:text-zinc-600 transition-colors"
            >
              Initialize your first category
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={getVisibleItems().map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-px">
                {getVisibleItems().map((item) => (
                  <SortableCategoryItem
                    key={item.id}
                    id={item.id}
                    category={item}
                    depth={item.depth}
                    isExpanded={expanded.includes(item.id)}
                    isEditing={editingId === item.id}
                    setEditingId={setEditingId}
                    onToggle={toggleExpand}
                    onAddSub={addSubCategory}
                    onRename={renameCategory}
                    onDelete={deleteCategory}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <button 
        onClick={addGlobalCategory}
        className="flex items-center gap-3 px-4 py-3 w-full text-left text-[#37352F40] hover:bg-[#F7F7F5] border border-dashed border-[#EDECE9] transition-all group"
      >
        <Plus size={16} className="group-hover:text-[#37352F] transition-colors" />
        <span className="text-[14px] font-medium group-hover:text-[#37352F] transition-colors">
          Add a top-level category
        </span>
      </button>

      <div className="pt-8 border-t border-[#EDECE9]">
        <h4 className="text-[10px] font-bold text-[#91918E] uppercase tracking-[0.2em] mb-4">
          Nomenclature Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[12px] font-medium text-[#37352F]">Consistent Case</p>
            <p className="text-[11px] text-[#91918E] leading-relaxed">
              Use Title Case for all categories (e.g., Lighting, Home Decor) to maintain editorial consistency.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[12px] font-medium text-[#37352F]">Logical Hierarchy</p>
            <p className="text-[11px] text-[#91918E] leading-relaxed">
              Ensure sub-categories are direct specializations of their parents for optimal navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
