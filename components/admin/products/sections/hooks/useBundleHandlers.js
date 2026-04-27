"use client";

export const useBundleHandlers = (setProduct) => {
  const addBundle = () =>
    setProduct((p) => ({
      ...p,
      bundles: [...p.bundles, { id: Date.now(), title: "PACK TITLE", subtitle: "TAG LINE", discount: "0% OFF", price: 0, unitPrice: 0 }],
    }));

  const removeBundle = (bid) =>
    setProduct((p) => ({ ...p, bundles: p.bundles.filter((b) => b.id !== bid) }));

  const updateBundle = (bid, f, v) =>
    setProduct((p) => ({ ...p, bundles: p.bundles.map((b) => (b.id === bid ? { ...b, [f]: v } : b)) }));

  return { addBundle, removeBundle, updateBundle };
};
