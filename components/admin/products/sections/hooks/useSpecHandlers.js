"use client";

export const useSpecHandlers = (setProduct) => {
  const addSpecGroup = () =>
    setProduct((p) => ({ ...p, specifications: [...p.specifications, { id: Date.now(), group: "Group", items: [] }] }));

  const removeSpecGroup = (gid) =>
    setProduct((p) => ({ ...p, specifications: p.specifications.filter((g) => g.id !== gid) }));

  const updateSpecGroupName = (gid, name) =>
    setProduct((p) => ({ ...p, specifications: p.specifications.map((g) => g.id === gid ? { ...g, group: name } : g) }));

  const addSpecItem = (gid) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.map((g) => g.id === gid ? { ...g, items: [...g.items, { id: Date.now(), label: "", value: "" }] } : g),
    }));

  const updateSpecItem = (gid, iid, field, val) =>
    setProduct((p) => ({
      ...p,
      specifications: p.specifications.map((g) => g.id === gid ? { ...g, items: g.items.map((it) => it.id === iid ? { ...it, [field]: val } : it) } : g),
    }));

  const removeSpecItem = (gid, iid) =>
    setProduct((p) => ({ ...p, specifications: p.specifications.map((g) => g.id === gid ? { ...g, items: g.items.filter((it) => it.id !== iid) } : g) }));

  return { addSpecGroup, removeSpecGroup, updateSpecGroupName, addSpecItem, updateSpecItem, removeSpecItem };
};
