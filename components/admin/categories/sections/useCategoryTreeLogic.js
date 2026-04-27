"use client";
import { useCategories } from "@/hooks/api/useCategories";
import { useToast } from "@/hooks/useToast";
import { useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export const useCategoryTreeLogic = () => {
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

  const [overId, setOverId] = useState(null);
  const [projectedDepth, setProjectedDepth] = useState(0);
  const [projectedParentId, setProjectedParentId] = useState(null);

  const sortedItems = useMemo(() => {
    const parentIdsWithChildren = new Set(
      categories.filter(c => c.parentId).map(c => c.parentId.toString())
    );
    const roots = categories.filter(c => !c.parentId).sort((a, b) => a.order - b.order);
    const result = [];
    roots.forEach(root => {
      result.push({ ...root, depth: 0, hasChildren: parentIdsWithChildren.has(root._id.toString()) });
      const children = categories.filter(c => c.parentId && c.parentId.toString() === root._id.toString()).sort((a, b) => a.order - b.order);
      children.forEach(child => {
        result.push({ ...child, depth: 1, hasChildren: parentIdsWithChildren.has(child._id.toString()) });
      });
    });
    return result;
  }, [categories]);

  const getVisibleItems = useMemo(() => {
    return sortedItems.filter(item => !item.parentId || expanded.includes(item.parentId.toString()));
  }, [sortedItems, expanded]);

  const calculateProjection = (activeId, overId, offset) => {
    if (!activeId || !overId) return { depth: 0, parentId: null };
    const overIndex = sortedItems.findIndex(i => i._id === overId);
    let depth = 0;
    let parentId = null;
    if (offset > 20) {
      const potentialParent = sortedItems.slice(0, overIndex + 1).reverse().find(i => i.depth === 0 && i._id !== activeId);
      if (potentialParent) {
        const hasChildren = categories.some(c => c.parentId && c.parentId.toString() === activeId.toString());
        if (!hasChildren) {
          depth = 1;
          parentId = potentialParent._id;
        }
      }
    }
    return { depth, parentId };
  };

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragOver = (event) => setOverId(event.over ? event.over.id : null);
  const handleDragMove = (event) => {
    setOffsetLeft(event.delta.x);
    if (event.over) {
      const projection = calculateProjection(event.active.id, event.over.id, event.delta.x);
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
      const reordered = arrayMove(sortedItems, oldIndex, newIndex);
      const payload = reordered.map((item, index) => ({
        id: item._id,
        order: index,
        parentId: item._id === activeId ? newParentId : item.parentId
      }));
      reorderCategories.mutate(payload, {
        onError: (err) => toast.error(err.message || "Failed to synchronize sequence")
      });
    }
  };

  const addTopLevel = () => {
    createCategory.mutate({ name: `New Category ${categories.length + 1}`, order: categories.length }, {
      onSuccess: () => toast.success("Category Registry Initialized."),
      onError: (err) => toast.error(err.message || "Failed to create category")
    });
  };

  const addSub = (parentId) => {
    if (!expanded.includes(parentId)) setExpanded(prev => [...prev, parentId]);
    createCategory.mutate({ name: "Sub-category", parentId, order: 999 }, {
      onSuccess: () => toast.success("Sub-category Mapped Successfully."),
      onError: (err) => toast.error(err.message || "Failed to create category")
    });
  };

  const toggleExpand = (id) => setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleDelete = (id) => { setItemToDelete(id); setIsDeleteModalOpen(true); };
  const confirmDelete = () => {
    if (itemToDelete) {
      deleteCategory.mutate(itemToDelete, {
        onSuccess: () => { setIsDeleteModalOpen(false); setItemToDelete(null); toast.info("Category archived."); },
        onError: (err) => toast.error(err.message || "Deletion Failure.")
      });
    }
  };

  const handleRename = (id, name) => {
    updateCategory.mutate({ id, data: { name } }, {
      onError: (err) => toast.error(err.message || "Rename Failure.")
    });
  };

  const handleDetailedSave = (payload) => {
    const { id, ...data } = payload;
    updateCategory.mutate({ id, data }, {
      onSuccess: () => { setSelectedCategory(null); toast.success("Protocol updated."); },
      onError: (err) => toast.error(err.message || "Update Failure.")
    });
  };

  return {
    categories, isLoading, getVisibleItems, expanded, editingId, setEditingId,
    overId, projectedDepth, sensorsProps: { handleDragStart, handleDragMove, handleDragOver, handleDragEnd },
    addTopLevel, addSub, toggleExpand, handleDelete, handleRename, handleDetailedSave,
    isDeleteModalOpen, setIsDeleteModalOpen, confirmDelete, selectedCategory, setSelectedCategory,
    isMutating: createCategory.isPending || updateCategory.isPending || deleteCategory.isPending
  };
};
