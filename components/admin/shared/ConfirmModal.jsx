"use client";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  message = "This action cannot be undone. This will permanently delete the selected item and remove its data from our servers.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white border border-black/5 shadow-2xl rounded-none overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="w-12 h-12 bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle size={24} strokeWidth={1.5} />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-black/20 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 mb-10">
            <h3 className="text-xl font-extrabold tracking-tight text-black uppercase">
              {title}
            </h3>
            <p className="text-sm text-black/40 leading-relaxed font-medium">
              {message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-14 text-[11px] font-bold tracking-widest uppercase text-black/40 hover:text-black"
            >
              {cancelLabel}
            </Button>
            <Button
              variant="danger"
              onClick={onConfirm}
              isLoading={isLoading}
              className="h-14 text-[11px] font-bold tracking-[0.2em] uppercase"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
