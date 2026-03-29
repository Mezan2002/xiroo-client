"use client";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
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
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useMenus } from "@/hooks/api/useMenus";
import { useToast } from "@/hooks/useToast";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import MenuForm from "./MenuForm";

const SortableMenuItem = ({
  id,
  menu,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 p-4 bg-white border border-[#EDECE9] hover:border-[#37352F20] transition-all duration-200 rounded-lg shadow-sm mb-2 ${isDragging ? 'shadow-xl scale-[1.02] border-black' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1.5 text-[#37352F40] cursor-grab active:cursor-grabbing hover:bg-[#F7F7F5] rounded-md transition-colors"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-[#37352F]">
          {menu.name}
        </span>
        <div className="flex items-center gap-2">
           <span className="text-[11px] text-[#91918E] font-medium tracking-tight">
            /{menu.slug}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#EDECE9]" />
          <span className="text-[11px] text-[#91918E] font-bold uppercase tracking-wider">
            {menu.categories?.length || 0} Categories
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 pr-2">
        {/* Categories Preview */}
        <div className="hidden md:flex items-center -space-x-2">
          {menu.categories?.slice(0, 3).map((cat, i) => (
            <div 
              key={i} 
              className="px-2 py-0.5 bg-[#F7F7F5] border border-[#EDECE9] rounded text-[10px] font-bold text-[#37352F80]"
            >
              {cat.name}
            </div>
          ))}
          {menu.categories?.length > 3 && (
            <div className="px-2 py-0.5 bg-black text-white rounded text-[10px] font-bold">
              +{menu.categories.length - 3}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[#EDECE9]" />

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(menu)}
            className="p-2 text-[#37352F40] hover:bg-[#F7F7F5] hover:text-[#37352F] rounded-md transition-colors"
            title="Edit Settings"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(menu._id)}
            className="p-2 text-[#37352F40] hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
            title="Delete Menu"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <ChevronRight size={16} className="text-[#37352F20] group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

export default function MenuList() {
  const { toast } = useToast();
  const { useAllMenus, deleteMenu, reorderMenus } = useMenus();
  const { data: menusResponse, isLoading } = useAllMenus();
  const menus = menusResponse || [];

  const [editingMenu, setEditingMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = menus.findIndex((i) => i._id === active.id);
      const newIndex = menus.findIndex((i) => i._id === over.id);
      
      const reordered = arrayMove(menus, oldIndex, newIndex);
      const payload = reordered.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      reorderMenus.mutate(payload, {
        onError: (err) => toast.error(err.message || "Failed to synchronize sequence")
      });
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMenu(null);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMenu.mutate(itemToDelete, {
        onSuccess: () => toast.info("Menu successfully archived."),
        onError: (err) => toast.error(err.message || "Failed to delete menu")
      });
      setItemToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-2 border-[#EDECE9] border-t-black animate-spin rounded-full" />
        <span className="text-[11px] font-bold text-[#91918E] uppercase tracking-widest">Compiling Structure...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-[#91918E] uppercase tracking-[0.2em]">
          Dynamic Sequence
        </h3>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-black/90 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
        >
          <Plus size={16} />
          Initialize Menu
        </button>
      </div>

      <div className="bg-[#F7F7F5] border border-[#EDECE9] p-2 rounded-xl min-h-[100px]">
        {menus.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 bg-white border border-[#EDECE9] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Layers size={24} className="text-[#37352F20]" />
            </div>
            <p className="text-[11px] font-bold text-[#91918E] uppercase tracking-widest leading-relaxed">
              Architecture Hub Uninitialized
            </p>
            <button 
              onClick={handleAddNew}
              className="text-[13px] font-semibold text-black hover:opacity-70 transition-opacity"
            >
              Begin construction
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={menus.map((i) => i._id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                {menus.map((menu) => (
                  <SortableMenuItem
                    key={menu._id}
                    id={menu._id}
                    menu={menu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <MenuForm
        key={editingMenu?._id || "new"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        menu={editingMenu}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Archival Confirmation"
        message="Are you sure you want to remove this menu item? This action will immediately decouple it from the storefront top navigation."
        confirmText="Confirm Archival"
        type="danger"
      />
    </div>
  );
}
