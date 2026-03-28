"use client";
import { useState, useEffect } from "react";
import { X, Check, Search, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useCategories } from "@/hooks/api/useCategories";
import { useMenus } from "@/hooks/api/useMenus";

export default function MenuForm({ isOpen, onClose, menu }) {
  const { toast } = useToast();
  const { useCategoryTree } = useCategories();
  const { createMenu, updateMenu } = useMenus();
  
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Categories for selection
  const { data: categoryTreeResponse } = useCategoryTree();
  const categories = categoryTreeResponse?.data || [];

  useEffect(() => {
    if (isOpen) {
      if (menu) {
        setName(menu.name);
        setSelectedCategories(menu.categories?.map(c => typeof c === 'object' ? c._id : c) || []);
      } else {
        setName("");
        setSelectedCategories([]);
      }
    }
  }, [menu, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const payload = { name, categories: selectedCategories };
    const successCallback = () => {
      toast.success(menu ? "Menu updated successfully." : "Menu created successfully.");
      setIsSubmitting(false);
      onClose();
    };
    const errorCallback = (err) => {
      toast.error(err.message || "An error occurred.");
      setIsSubmitting(false);
    };

    if (menu) {
      updateMenu.mutate({ id: menu._id, payload }, {
        onSuccess: successCallback,
        onError: errorCallback
      });
    } else {
      createMenu.mutate(payload, {
        onSuccess: successCallback,
        onError: errorCallback
      });
    }
  };


  const toggleCategory = (catId) => {
    setSelectedCategories(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId) 
        : [...prev, catId]
    );
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#37352F1A] backdrop-blur-[2px]" 
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
        {/* Header */}
        <div className="p-6 border-b border-[#EDECE9] flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[16px] font-bold text-[#37352F]">
              {menu ? "Edit Menu Configuration" : "New Menu Registry"}
            </h2>
            <p className="text-[11px] text-[#91918E] font-medium tracking-tight uppercase">
              Operational Parameters
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#F7F7F5] rounded-lg transition-colors text-[#37352F40] hover:text-[#37352F]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Menu Name Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#91918E] uppercase tracking-widest pl-1">
              Primary Identity
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. COLLECTIONS or NEW IN"
              className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#EDECE9] focus:border-black rounded-lg text-[14px] font-medium transition-all outline-none placeholder:text-[#37352F20]"
              required
            />
          </div>

          {/* Categories Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-bold text-[#91918E] uppercase tracking-widest">
                Hierarchical Mapping
              </label>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full font-bold">
                {selectedCategories.length} Active
              </span>
            </div>

            {/* Search Categories */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#37352F40]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-9 pr-4 py-2 bg-[#F7F7F5] border border-[#EDECE9] focus:border-black rounded-lg text-[13px] transition-all outline-none"
              />
            </div>

            {/* Categories List */}
            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCategories.length === 0 ? (
                <p className="text-[12px] text-center py-8 text-[#91918E]">No matches found in register.</p>
              ) : (
                filteredCategories.map((cat) => {
                  const isSelected = selectedCategories.includes(cat._id);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? "bg-black border-black text-white shadow-lg shadow-black/10 translate-x-1" 
                          : "bg-white border-[#EDECE9] text-[#37352F] hover:bg-[#F7F7F5] active:scale-[0.98]"
                      }`}
                    >
                      <div className="flex flex-col items-start text-left gap-0.5">
                        <span className="text-[13px] font-semibold">{cat.name}</span>
                        {cat.parentId && (
                          <span className={`text-[10px] font-medium uppercase tracking-tight ${isSelected ? 'text-white/60' : 'text-[#91918E]'}`}>
                            Sub-category
                          </span>
                        )}
                      </div>
                      {isSelected && <Check size={16} />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#EDECE9] bg-[#F7F7F5]/50 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white border border-[#EDECE9] text-[#37352F] rounded-lg text-[13px] font-semibold hover:bg-[#F7F7F5] transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !name.trim()}
            className="flex-2 px-8 py-3 bg-black text-white rounded-lg text-[13px] font-bold hover:bg-black/90 transition-all active:scale-[0.98] shadow-xl shadow-black/10 disabled:opacity-30"
          >
            {isSubmitting ? "Syncing..." : menu ? "Update Protocol" : "Authorize Creation"}
          </button>
        </div>
      </div>
    </div>
  );
}
