"use client";
import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm Action",
  type = "danger" 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 font-montserrat antialiased">
      {/* Cinematic Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-none shadow-2xl border border-[#EDECE9] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#EDECE9]">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-none flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <AlertTriangle size={18} />
            </div>
            <h3 className="text-[14px] font-bold text-black uppercase tracking-widest">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-[#37352F40] hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <p className="text-[13px] text-[#37352F80] leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-[#F7F7F5] flex items-center justify-end gap-3 border-t border-[#EDECE9]">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-10 text-[10px] font-bold uppercase tracking-[0.2em] border-transparent hover:bg-white px-6"
          >
            Cancel
          </Button>
          <Button 
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="h-10 text-[10px] font-bold uppercase tracking-[0.2em] px-8 rounded-none shadow-lg shadow-black/5"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
