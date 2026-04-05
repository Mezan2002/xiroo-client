"use client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
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
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  Layers,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useCategories } from "@/hooks/api/useCategories";
import { useToast } from "@/hooks/useToast";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import CategoryDetailsSidebar from "@/components/admin/categories/CategoryDetailsSidebar";


// --- Types & Constants ---
const INDENTATION_WIDTH = 24;
const MAX_DEPTH = 1; // 0 for root, 1 for sub-category

// --- Components ---

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

const SortableCategoryItem = ({
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
  isChild,
  isOver,
  projectedDepth,
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
    }
  }, [isEditing]);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== category.name) {
      onRename(id, newName.trim());
    }
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
            onDoubleClick={startEditing}
            onClick={() => onSelect(category)}
            className={`flex-1 text-[14px] font-medium text-[#37352F] cursor-pointer hover:bg-black/5 px-2 rounded-sm truncate py-0.5 ${depth > 0 ? 'text-[#37352F80]' : ''}`}
          >
            {category.name}
          </span>
        )}

        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity pr-1">
          {depth === 0 && (
            <button
              onClick={() => onAddSub(id)}
              className="p-1.5 text-[#37352F40] hover:bg-[#EBEBE9] hover:text-[#37352F] rounded-sm transition-colors"
              title="Add sub-category"
            >
              <Plus size={14} />
            </button>
          )}
          <button
            onClick={startEditing}
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

// --- Main Component ---

export default function CategoryTree() {
  const { toast } = useToast();
  const { 
    useCategoryTree, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategories 
  } = useCategories();

  const { data: categories = [], isLoading } = useCategoryTree();

  const [expanded, setExpanded] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Projection State
  const [overId, setOverId] = useState(null);
  const [projectedDepth, setProjectedDepth] = useState(0);
  const [projectedParentId, setProjectedParentId] = useState(null);


  // 3. Tree Logic Helpers
  const sortedItems = useMemo(() => {
    // 1. Identify all parentIds that have children for quick lookup
    const parentIdsWithChildren = new Set(
      categories.filter(c => c.parentId).map(c => c.parentId.toString())
    );

    // 2. Separate roots from sub-categories
    const roots = categories
      .filter(c => !c.parentId)
      .sort((a, b) => a.order - b.order);
    
    const result = [];
    
    roots.forEach(root => {
      // Add root with computed hasChildren
      result.push({ 
        ...root, 
        depth: 0, 
        hasChildren: parentIdsWithChildren.has(root._id.toString()) 
      });

      // Find direct children
      const children = categories
        .filter(c => c.parentId && c.parentId.toString() === root._id.toString())
        .sort((a, b) => a.order - b.order);

      children.forEach(child => {
        result.push({ 
          ...child, 
          depth: 1, 
          hasChildren: parentIdsWithChildren.has(child._id.toString()) 
        });
      });
    });
    
    return result;
  }, [categories]);

  const getVisibleItems = useMemo(() => {
    const visible = [];

    sortedItems.forEach(item => {
      // Roots are always visible
      if (!item.parentId) {
        visible.push(item);
      } 
      // Children are visible only if their parent is expanded
      else if (expanded.includes(item.parentId.toString())) {
        visible.push(item);
      }
    });

    return visible;
  }, [sortedItems, expanded]);

  // 4. DnD Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setOverId(over ? over.id : null);
  };

  const calculateProjection = (activeId, overId, offset) => {
    if (!activeId || !overId) return { depth: 0, parentId: null };

    const activeIndex = sortedItems.findIndex(i => i._id === activeId);
    const overIndex = sortedItems.findIndex(i => i._id === overId);
    const activeItem = sortedItems[activeIndex];
    const overItem = sortedItems[overIndex];

    let depth = 0;
    let parentId = null;

    // Logic: If dragged to the right (>20px) AND the item above it is a root
    if (offset > 20) {
      // Find the potential parent (nearest root at or above overIndex)
      const potentialParent = sortedItems
        .slice(0, overIndex + 1)
        .reverse()
        .find(i => i.depth === 0 && i._id !== activeId);

      if (potentialParent) {
        // Only allowed if activeItem has no children of its own
        const hasChildren = categories.some(c => c.parentId && c.parentId.toString() === activeId.toString());
        if (!hasChildren) {
          depth = 1;
          parentId = potentialParent._id;
        }
      }
    }

    return { depth, parentId };
  };

  const handleDragMove = (event) => {
    const { delta, active, over } = event;
    setOffsetLeft(delta.x);
    
    if (over) {
      const projection = calculateProjection(active.id, over.id, delta.x);
      setProjectedDepth(projection.depth);
      setProjectedParentId(projection.parentId);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    const finalProjection = calculateProjection(active.id, over?.id, offsetLeft);
    const newParentId = finalProjection.parentId;

    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);

    if (!over) return;

    if (active.id !== over.id || newParentId !== sortedItems.find(i => i._id === active.id)?.parentId) {
      const oldIndex = sortedItems.findIndex((i) => i._id === active.id);
      const newIndex = sortedItems.findIndex((i) => i._id === over.id);
      
      const projection = calculateProjection(active.id, over.id, offsetLeft);
      const newParentId = projection.parentId;

      const reordered = arrayMove(sortedItems, oldIndex, newIndex);
      
      // Map to API format
      const payload = reordered.map((item, index) => ({
        id: item._id,
        order: index,
        parentId: item._id === activeId ? newParentId : item.parentId
      }));

      reorderCategories.mutate(payload, {
        onError: (err) => {
          toast.error(err.message || "Failed to synchronize sequence");
        }
      });
    }
  };

  // 5. Action Handlers
  const addTopLevel = () => {
    const existingRoots = categories.filter(c => !c.parentId);
    const name = `New Category ${existingRoots.length + 1}`;
    createCategory.mutate({ name, order: categories.length }, {
      onSuccess: () => {
        toast.success("Category Registry Initialized.");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create category");
      }
    });
  };

  const addSub = (parentId) => {
    if (!expanded.includes(parentId)) {
      setExpanded(prev => [...prev, parentId]);
    }
    const existingSubs = categories.filter(c => c.parentId && c.parentId.toString() === parentId.toString());
    const name = `Sub-category ${existingSubs.length + 1}`;
    createCategory.mutate({ name, parentId, order: 999 }, {
      onSuccess: () => {
        toast.success("Sub-category Mapped Successfully.");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create category");
      }
    });
  };

  const toggleExpand = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteCategory.mutate(itemToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
          toast.info("Category moved to archive.");
        },
        onError: (err) => {
          toast.error(err.message || "Deletion Failure.");
        }
      });
    }
  };

  const handleRename = (id, name) => {
    updateCategory.mutate({ id, data: { name } }, {
      onError: (err) => {
        toast.error(err.message || "Rename Failure.");
      }
    });
  };

  const handleDetailedSave = (payload) => {
    const { id, ...data } = payload;
    updateCategory.mutate({ id, data }, {
      onSuccess: () => {
        setSelectedCategory(null);
        toast.success("Protocol updated successfully.");
      },
      onError: (err) => {
        toast.error(err.message || "Update Failure.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 border-2 border-zinc-100 border-t-black animate-spin rounded-full" />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Synchronizing Registry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 py-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="bg-white border border-[#EDECE9] p-2 space-y-px shadow-sm min-h-[100px]">
        {categories.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-zinc-50/50">
            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <Layers size={20} className="text-zinc-300" />
            </div>
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Category Registry Empty
            </p>
            <button 
              onClick={addTopLevel}
              className="text-[12px] font-semibold text-black hover:opacity-70 transition-opacity"
            >
              Click to initialize roots
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={getVisibleItems.map((i) => i._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-px">
                {getVisibleItems.map((item) => (
                  <SortableCategoryItem
                    key={item._id}
                    id={item._id}
                    category={item}
                    depth={item.depth}
                    isExpanded={expanded.includes(item._id)}
                    isEditing={editingId === item._id}
                    setEditingId={setEditingId}
                    onToggle={toggleExpand}
                    onAddSub={addSub}
                     onRename={handleRename}
                    onDelete={handleDelete}
                    onSelect={setSelectedCategory}
                    isChild={!!item.parentId}
                    isOver={overId === item._id}
                    projectedDepth={projectedDepth}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <button 
        onClick={addTopLevel}
        disabled={createCategory.isPending}
        className="flex items-center gap-3 px-4 py-3 w-full text-left text-[#37352F40] hover:bg-[#F7F7F5] border border-dashed border-[#EDECE9] transition-all group active:scale-[0.99]"
      >
        <Plus size={16} className="group-hover:text-[#37352F] transition-colors" />
        <span className="text-[14px] font-medium group-hover:text-[#37352F] transition-colors">
          Add a top-level category
        </span>
      </button>

      {/* Guidelines */}
      <div className="pt-8 border-t border-[#EDECE9]">
        <h4 className="text-[10px] font-bold text-[#91918E] uppercase tracking-[0.2em] mb-4">
          Hierarchical Protocols
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[12px] font-bold text-[#37352F]">Drag Interactions</p>
            <p className="text-[11px] text-[#91918E] leading-relaxed">
              Drag vertically to reorder. Shift an item <span className="text-black font-semibold">right</span> during drag to nest it as a sub-category. Shift <span className="text-black font-semibold">left</span> to unnest.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[12px] font-bold text-[#37352F]">Double-Click to Edit</p>
            <p className="text-[11px] text-[#91918E] leading-relaxed">
              Double-click any category name to initiate rapid renaming. Press Enter to save or Escape to discard.
            </p>
          </div>
        </div>
      </div>

      <CategoryDetailsSidebar
        key={selectedCategory?._id}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSave={handleDetailedSave}
        isLoading={updateCategory.isPending}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? All sub-categories will also be permanently removed from the registry."
        confirmText="Terminate Registry"
        type="danger"
      />
    </div>
  );
}

