"use client";

export const useVariantHandlers = (setProduct) => {
  const addVariant = (name = "Option", values = []) =>
    setProduct((p) => ({
      ...p,
      variants: [...p.variants, { id: Date.now(), name, values: values.map((val) => typeof val === "string" ? { value: val, price: "" } : val) }],
    }));

  const removeVariant = (vid) =>
    setProduct((p) => ({ ...p, variants: p.variants.filter((v) => v.id !== vid) }));

  const updateVariantName = (vid, name) =>
    setProduct((p) => ({ ...p, variants: p.variants.map((v) => (v.id === vid ? { ...v, name } : v)) }));

  const addVariantValue = (vid, val) => {
    if (!val.trim()) return;
    setProduct((p) => ({
      ...p,
      variants: p.variants.map((v) => v.id === vid ? { ...v, values: [...v.values, { value: val, price: "" }] } : v),
    }));
  };

  const updateVariantValuePrice = (vid, idx, price) => {
    setProduct((p) => ({
      ...p,
      variants: p.variants.map((v) => v.id === vid ? {
        ...v,
        values: v.values.map((val, i) => i === idx ? { ...(typeof val === "string" ? { value: val } : val), price } : val),
      } : v),
    }));
  };

  const removeVariantValue = (vid, idx) =>
    setProduct((p) => ({ ...p, variants: p.variants.map((v) => v.id === vid ? { ...v, values: v.values.filter((_, i) => i !== idx) } : v) }));

  return { addVariant, removeVariant, updateVariantName, addVariantValue, updateVariantValuePrice, removeVariantValue };
};
