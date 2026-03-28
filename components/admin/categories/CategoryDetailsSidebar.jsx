"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Image as ImageIcon, Trash2, Check, AlertCircle, Hash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { useAttributes } from "@/hooks/api/useAttributes";

export default function CategoryDetailsSidebar({ 
  category, 
  onClose, 
  onSave, 
  isLoading 
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    image: category?.image || null,
    isActive: category?.isActive !== false,
    isFeatured: category?.isFeatured || false,
    allowedAttributes: category?.allowedAttributes || [],
  });

  const { useAttributeRegistry } = useAttributes();
  const { data: attributesResponse } = useAttributeRegistry();
  const attributes = attributesResponse?.data || [];


  if (!category) return null;

  const toggleAttribute = (attrId) => {
    setFormData(prev => {
      const current = prev.allowedAttributes || [];
      const updated = current.includes(attrId)
        ? current.filter(id => id !== attrId)
        : [...current, attrId];
      return { ...prev, allowedAttributes: updated };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "name") {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: generatedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: category._id, ...formData });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 border-l border-[#EDECE9] animate-in slide-in-from-right duration-300 font-montserrat antialiased">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#EDECE9] bg-[#F7F7F5]">
            <div className="flex flex-col">
              <h2 className="text-[10px] font-bold text-[#91918E] uppercase tracking-[0.2em] mb-1">
                Registry Management
              </h2>
              <p className="text-[14px] font-bold text-black uppercase tracking-widest">
                Detailed Protocol
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center text-[#37352F40] hover:bg-white hover:text-black transition-all border border-transparent hover:border-[#EDECE9]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">
                  Visual Identity
                </label>
                {formData.image && (
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                    className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:opacity-70 transition-opacity"
                  >
                    Clear Graphics
                  </button>
                )}
              </div>
              
              <ImageUploader
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))}
                className="w-full aspect-video bg-[#F7F7F5] border border-dashed border-[#EDECE9] flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-[#37352F20]"
              >
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={formData.image} 
                      alt="Category" 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/40 px-4 py-2">Update Visuals</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#EDECE9]">
                      <ImageIcon size={18} className="text-[#37352F40]" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-[#37352F] uppercase tracking-widest">Upload Key Visual</span>
                      <span className="text-[9px] text-[#91918E] font-medium tracking-wide">PNG, WEBP, or JPEG strictly.</span>
                    </div>
                  </div>
                )}
              </ImageUploader>
            </div>

            {/* Fields Section */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest flex items-center gap-2">
                  Category Designation <Check size={10} className="text-green-500" />
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white border border-[#EDECE9] px-4 py-3 text-[14px] font-medium text-black outline-none focus:border-black/20 transition-all placeholder:text-[#37352F20]"
                  placeholder="e.g. Minimalist Home"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">
                  Electronic Identifier (Slug)
                </label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-[#F7F7F5] border border-[#EDECE9] px-4 py-3 text-[11px] font-mono text-zinc-500 outline-none focus:border-black/20 transition-all"
                  placeholder="automatic-identifier-gen"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">
                  Contextual Documentation
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-white border border-[#EDECE9] px-4 py-3 text-[13px] font-medium leading-relaxed text-black outline-none focus:border-black/20 transition-all resize-none placeholder:text-[#37352F20]"
                  placeholder="Specify the scope and attributes of this category..."
                />
              </div>

              {/* Attributes Mapping */}
              <div className="pt-6 border-t border-[#EDECE9] space-y-4">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest block">
                  Filter Registry (Attributes)
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {attributes.map((attr) => {
                    const isSelected = formData.allowedAttributes?.includes(attr._id);
                    return (
                      <div 
                        key={attr._id}
                        onClick={() => toggleAttribute(attr._id)}
                        className={`
                          flex items-center justify-between p-4 cursor-pointer transition-all border
                          ${isSelected ? 'bg-black border-black shadow-lg shadow-black/5' : 'bg-white border-[#EDECE9] hover:border-[#37352F20]'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Hash size={12} className={isSelected ? 'text-white/40' : 'text-zinc-300'} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-zinc-600'}`}>
                            {attr.name}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'border-[#EDECE9]'}`}>
                          {isSelected && <Check size={10} className="text-black" strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                  {attributes.length === 0 && (
                    <p className="text-[10px] text-zinc-400 font-medium italic">No global attributes registered.</p>
                  )}
                </div>
                <p className="text-[10px] text-[#91918E] font-medium leading-relaxed">
                  Select specific attributes to enable contextual filtering in the storefront sidebar for this category.
                </p>
              </div>
            </div>

            {/* Status Section */}
            <div className="pt-6 border-t border-[#EDECE9] space-y-4">
              <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData(p => ({...p, isActive: !p.isActive}))}>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-black uppercase tracking-wider">Public Availability</p>
                  <p className="text-[10px] text-[#91918E] font-medium">Toggle visibility across the storefront.</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${formData.isActive ? 'bg-black' : 'bg-[#EDECE9]'}`}>
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${formData.isActive ? 'left-6' : 'left-1'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between group cursor-pointer" onClick={() => setFormData(p => ({...p, isFeatured: !p.isFeatured}))}>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-black uppercase tracking-wider">Priority Highlighting</p>
                  <p className="text-[10px] text-[#91918E] font-medium">Feature this entry in prime collection areas.</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${formData.isFeatured ? 'bg-amber-400' : 'bg-[#EDECE9]'}`}>
                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${formData.isFeatured ? 'left-6' : 'left-1'}`} />
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-[#EDECE9] bg-[#F7F7F5] flex items-center justify-end gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="h-11 px-6 text-[10px] font-bold uppercase tracking-[0.2em] border-transparent"
              showHoverIcon={false}
            >
              Discard
            </Button>
            <Button 
              disabled={isLoading}
              onClick={handleSubmit}
              className="h-11 px-10 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:bg-zinc-800 transition-all"
              icon={Save}
            >
              {isLoading ? "Synchronizing..." : "Initialize Registry"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
