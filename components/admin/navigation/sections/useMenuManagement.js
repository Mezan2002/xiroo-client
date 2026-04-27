"use client";
import { useState } from "react";
import { useMenus } from "@/hooks/api/useMenus";
import { useToast } from "@/hooks/useToast";
import { arrayMove } from "@dnd-kit/sortable";

export const useMenuManagement = (menus) => {
  const { toast } = useToast();
  const { deleteMenu, reorderMenus } = useMenus();

  const [editingMenu, setEditingMenu] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = menus.findIndex((i) => i._id === active.id);
    const newIndex = menus.findIndex((i) => i._id === over.id);
    const reordered = arrayMove(menus, oldIndex, newIndex);
    
    const payload = reordered.map((item, index) => ({ id: item._id, order: index }));
    reorderMenus.mutate(payload, { onError: (err) => toast.error(err.message || "Failed to synchronise sequence") });
  };

  const handleEdit = (menu) => { setEditingMenu(menu); setIsFormOpen(true); };
  const handleAddNew = () => { setEditingMenu(null); setIsFormOpen(true); };
  const handleDelete = (id) => { setItemToDelete(id); setIsDeleteModalOpen(true); };

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

  return { editingMenu, isFormOpen, setIsFormOpen, isDeleteModalOpen, setIsDeleteModalOpen, handleDragEnd, handleEdit, handleAddNew, handleDelete, confirmDelete };
};
