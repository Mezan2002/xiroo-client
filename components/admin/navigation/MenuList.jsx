"use client";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Layers } from "lucide-react";
import { useMenus } from "@/hooks/api/useMenus";
import ConfirmationModal from "@/components/admin/ConfirmationModal";
import MenuForm from "./MenuForm";
import SortableMenuItem from "./sections/SortableMenuItem";
import { useMenuManagement } from "./sections/useMenuManagement";

export default function MenuList() {
  const { useAllMenus } = useMenus();
  const { data: menusResponse, isLoading } = useAllMenus();
  const menus = menusResponse || [];

  const {
    editingMenu, isFormOpen, setIsFormOpen, isDeleteModalOpen, setIsDeleteModalOpen,
    handleDragEnd, handleEdit, handleAddNew, handleDelete, confirmDelete
  } = useMenuManagement(menus);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
        <h3 className="text-[11px] font-bold text-[#91918E] uppercase tracking-[0.2em]">Dynamic Sequence</h3>
        <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-[13px] font-semibold hover:bg-black/90 transition-all shadow-xl shadow-black/10">
          <Plus size={16} /> Initialize Menu
        </button>
      </div>

      <div className="bg-[#F7F7F5] border border-[#EDECE9] p-2 rounded-xl min-h-[100px]">
        {menus.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-16 h-16 bg-white border border-[#EDECE9] rounded-2xl flex items-center justify-center mx-auto shadow-sm"><Layers size={24} className="text-[#37352F20]" /></div>
            <p className="text-[11px] font-bold text-[#91918E] uppercase tracking-widest leading-relaxed">Architecture Hub Uninitialized</p>
            <button onClick={handleAddNew} className="text-[13px] font-semibold text-black hover:opacity-70">Begin construction</button>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={menus.map((i) => i._id)} strategy={verticalListSortingStrategy}>
              <div>
                {menus.map((menu) => (
                  <SortableMenuItem key={menu._id} id={menu._id} menu={menu} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <MenuForm key={editingMenu?._id || "new"} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} menu={editingMenu} />

      <ConfirmationModal
        isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete}
        title="Archival Confirmation" message="Are you sure you want to remove this menu item? This action will immediately decouple it from the storefront top navigation."
        confirmText="Confirm Archival" type="danger"
      />
    </div>
  );
}
