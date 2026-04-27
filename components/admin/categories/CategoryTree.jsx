"use client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Layers, Plus } from "lucide-react";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import CategoryDetailsSidebar from "@/components/admin/categories/CategoryDetailsSidebar";
import CategoryItem from "./sections/CategoryItem";
import CategoryGuidelines from "./sections/CategoryGuidelines";
import { useCategoryTreeLogic } from "./sections/useCategoryTreeLogic";

export default function CategoryTree() {
  const {
    categories, isLoading, getVisibleItems, expanded, editingId, setEditingId,
    overId, projectedDepth, sensorsProps, addTopLevel, addSub, toggleExpand,
    handleDelete, handleRename, handleDetailedSave, isDeleteModalOpen,
    setIsDeleteModalOpen, confirmDelete, selectedCategory, setSelectedCategory,
    isMutating
  } = useCategoryTreeLogic();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Category Registry Empty</p>
            <button onClick={addTopLevel} className="text-[12px] font-semibold text-black hover:opacity-70">
              Click to initialize roots
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={sensorsProps.handleDragStart}
            onDragMove={sensorsProps.handleDragMove}
            onDragOver={sensorsProps.handleDragOver}
            onDragEnd={sensorsProps.handleDragEnd}
          >
            <SortableContext items={getVisibleItems.map((i) => i._id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-px">
                {getVisibleItems.map((item) => (
                  <CategoryItem
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
        disabled={isMutating}
        className="flex items-center gap-3 px-4 py-3 w-full text-left text-[#37352F40] hover:bg-[#F7F7F5] border border-dashed border-[#EDECE9] transition-all group active:scale-[0.99]"
      >
        <Plus size={16} className="group-hover:text-[#37352F]" />
        <span className="text-[14px] font-medium group-hover:text-[#37352F]">Add a top-level category</span>
      </button>

      <CategoryGuidelines />

      <CategoryDetailsSidebar
        key={selectedCategory?._id}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSave={handleDetailedSave}
        isLoading={isMutating}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); }}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? All sub-categories will also be permanently removed from the registry."
        confirmText="Terminate Registry"
        type="danger"
      />
    </div>
  );
}
