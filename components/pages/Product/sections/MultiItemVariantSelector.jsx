"use client";
import { useState } from "react";
import { Plus, Minus, X } from "lucide-react";

export default function MultiItemVariantSelector({ variants, packQuantity, selectedItems, setSelectedItems }) {
  const [editingIndex, setEditingIndex] = useState(null);

  if (!variants || variants.length === 0 || !packQuantity) return null;

  const totalSelected = selectedItems.reduce((sum, item) => sum + 1, 0);
  const remaining = packQuantity - totalSelected;

  const handleAddItem = () => {
    if (totalSelected >= packQuantity) return;
    const newItem = {};
    variants.forEach((v) => {
      newItem[v.name] = "";
    });
    setSelectedItems([...selectedItems, newItem]);
    setEditingIndex(selectedItems.length);
  };

  const handleRemoveItem = (index) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleVariantSelect = (itemIndex, variantName, value) => {
    const updated = [...selectedItems];
    updated[itemIndex] = { ...updated[itemIndex], [variantName]: value };
    setSelectedItems(updated);
  };

  const isItemComplete = (item) => {
    return variants.every((v) => item[v.name] && item[v.name] !== "");
  };

  const allComplete = selectedItems.every(isItemComplete);
  const canAddToCart = totalSelected === packQuantity && allComplete;

  return (
    <div className="w-full mt-6 pt-6 border-t border-gray-200 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold tracking-[0.2em] text-black uppercase">
          Select {packQuantity} Items for Your Pack
        </div>
        <div className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
          {totalSelected}/{packQuantity} Selected
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${(totalSelected / packQuantity) * 100}%` }}
        />
      </div>

      {/* Selected Items List */}
      <div className="space-y-3">
        {selectedItems.map((item, index) => {
          const complete = isItemComplete(item);
          return (
            <div
              key={index}
              className={`border transition-all ${
                editingIndex === index
                  ? "border-black shadow-lg"
                  : complete
                    ? "border-green-200 bg-green-50/30"
                    : "border-gray-200"
              }`}
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => setEditingIndex(editingIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold ${
                    complete ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                    {complete ? "✓" : index + 1}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                    Item {index + 1}
                  </span>
                  {complete && (
                    <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">
                      {Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(", ")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingIndex === index ? (
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Close</span>
                  ) : (
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                      {complete ? "Edit" : "Select"}
                    </span>
                  )}
                  {selectedItems.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(index);
                      }}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Variant Selection (Expanded) */}
              {editingIndex === index && (
                <div className="px-3 pb-4 space-y-4 border-t border-gray-100 pt-4">
                  {variants.map((variant) => (
                    <div key={variant.name} className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        Select {variant.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {variant.values.map((vObj) => {
                          const val = typeof vObj === "string" ? vObj : vObj.value;
                          const isSelected = item[variant.name] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleVariantSelect(index, variant.name, val)}
                              className={`min-w-[80px] h-10 px-3 text-[9px] font-bold tracking-widest transition-all border uppercase ${
                                isSelected
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-gray-500 border-gray-200 hover:border-black"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Another Item Button */}
      {totalSelected < packQuantity && (
        <button
          onClick={handleAddItem}
          className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-black text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-all flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          Add Item ({remaining} remaining)
        </button>
      )}
    </div>
  );
}
