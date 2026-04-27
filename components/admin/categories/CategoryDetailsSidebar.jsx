"use client";
import React from "react";
import { X, Save, Image as ImageIcon, Check, Hash } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { useCategoryForm } from "./sections/useCategoryForm";

export default function CategoryDetailsSidebar({ category, onClose, onSave, isLoading }) {
  const { formData, setFormData, attributes, toggleAttribute, handleChange, handleSubmit } = useCategoryForm(category, onSave);

  if (!category) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full lg:max-w-md bg-white shadow-2xl z-50 border-l border-[#EDECE9] animate-in slide-in-from-right duration-300 font-montserrat">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#EDECE9] bg-[#F7F7F5]">
            <div className="flex flex-col">
              <h2 className="text-[10px] font-bold text-[#91918E] uppercase tracking-[0.2em]">Registry Management</h2>
              <p className="text-[14px] font-bold text-black uppercase tracking-widest">Detailed Protocol</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-[#37352F40] hover:bg-white hover:text-black border border-transparent hover:border-[#EDECE9] transition-all"><X size={18} /></button>
          </div>

          <form className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">Visual Identity</label>
                {formData.image && <button type="button" onClick={() => setFormData(p => ({...p, image: null}))} className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Clear Graphics</button>}
              </div>
              <ImageUploader onUploadSuccess={(url) => setFormData(p => ({...p, image: url}))} className="w-full aspect-video bg-[#F7F7F5] border border-dashed border-[#EDECE9] overflow-hidden group">
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <Image src={formData.image} alt="Category" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"><span className="text-white text-[10px] font-bold uppercase tracking-widest border border-white/40 px-4 py-2">Update Visuals</span></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-10">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#EDECE9]"><ImageIcon size={18} className="text-[#37352F40]" /></div>
                    <span className="text-[10px] font-bold text-[#37352F] uppercase tracking-widest">Upload Key Visual</span>
                  </div>
                )}
              </ImageUploader>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">Category Designation</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border border-[#EDECE9] px-4 py-3 text-[14px] font-medium text-black focus:border-black/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">Electronic Identifier</label>
                <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-[#F7F7F5] border border-[#EDECE9] px-4 py-3 text-[11px] font-mono text-zinc-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest">Contextual Documentation</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border border-[#EDECE9] px-4 py-3 text-[13px] font-medium leading-relaxed text-black focus:border-black/20 outline-none resize-none" />
              </div>

              <div className="pt-6 border-t border-[#EDECE9] space-y-4">
                <label className="text-[10px] font-bold text-[#91918E] uppercase tracking-widest block">Filter Registry (Attributes)</label>
                <div className="grid grid-cols-1 gap-3">
                  {attributes.map((attr) => {
                    const isSelected = formData.allowedAttributes?.includes(attr._id);
                    return (
                      <div key={attr._id} onClick={() => toggleAttribute(attr._id)} className={`flex items-center justify-between p-4 cursor-pointer border ${isSelected ? 'bg-black border-black shadow-lg' : 'bg-white border-[#EDECE9] hover:border-[#37352F20]'}`}>
                        <div className="flex items-center gap-3">
                          <Hash size={12} className={isSelected ? 'text-white/40' : 'text-zinc-300'} />
                          <span className={`text-[11px] font-bold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-zinc-600'}`}>{attr.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'bg-white border-white' : 'border-[#EDECE9]'}`}>{isSelected && <Check size={10} className="text-black" strokeWidth={3} />}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EDECE9] space-y-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setFormData(p => ({...p, isActive: !p.isActive}))}>
                <div><p className="text-[11px] font-bold text-black uppercase tracking-wider">Public Availability</p><p className="text-[10px] text-[#91918E]">Toggle visibility across storefront.</p></div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isActive ? 'bg-black' : 'bg-[#EDECE9]'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isActive ? 'left-6' : 'left-1'}`} /></div>
              </div>
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setFormData(p => ({...p, isFeatured: !p.isFeatured}))}>
                <div><p className="text-[11px] font-bold text-black uppercase tracking-wider">Priority Highlighting</p><p className="text-[10px] text-[#91918E]">Feature in prime collection areas.</p></div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isFeatured ? 'bg-amber-400' : 'bg-[#EDECE9]'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isFeatured ? 'left-6' : 'left-1'}`} /></div>
              </div>
            </div>
          </form>

          <div className="p-6 border-t border-[#EDECE9] bg-[#F7F7F5] flex items-center justify-end gap-3 shadow-sm">
            <Button variant="ghost" onClick={onClose} className="h-11 px-6 text-[10px] font-bold uppercase tracking-[0.2em]">Discard</Button>
            <Button disabled={isLoading} onClick={handleSubmit} className="h-11 px-10 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white hover:bg-zinc-800" icon={Save}>
              {isLoading ? "Syncing..." : "Initialize"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
