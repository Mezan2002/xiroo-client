"use client";
import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function AttributeForm({ isOpen, onClose, attribute }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [name, setName] = useState(attribute?.name || "");
  const [values, setValues] = useState(attribute?.values || []);
  const [newValue, setNewValue] = useState("");

  const mutation = useMutation({
    mutationFn: (payload) => {
      const method = attribute ? "PATCH" : "POST";
      const url = attribute ? `/attributes/${attribute._id}` : "/attributes";
      return apiRequest(url, {
        method,
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["attributes"]);
      toast.success(attribute ? "Attribute updated." : "Attribute created.");
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || "An error occurred.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required.");
    if (values.length === 0) return toast.error("At least one value is required.");
    mutation.mutate({ name, values });
  };

  const addValue = () => {
    if (!newValue.trim()) return;
    if (values.includes(newValue.trim())) return toast.error("Value already exists.");
    setValues([...values, newValue.trim()]);
    setNewValue("");
  };

  const removeValue = (val) => {
    setValues(values.filter((v) => v !== val));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#37352F1A] backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col font-montserrat">
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-black">
              {attribute ? "Edit Attribute" : "New Attribute"}
            </h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Registry Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 transition-colors">
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] block">
              Attribute Nomenclature
            </label>
            <input
              autoFocus
              className="w-full bg-transparent border-b border-zinc-200 focus:border-black outline-none transition-all py-3 text-lg font-light tracking-tight placeholder:text-zinc-200"
              placeholder="e.g. Color, Size, Material"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            <label className="text-[10px] font-bold text-zinc-900 uppercase tracking-[0.2em] block">
              Value Registry
            </label>
            
            <div className="flex gap-2">
              <input
                className="flex-1 bg-zinc-50 border border-zinc-100 px-4 py-3 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-black transition-all"
                placeholder="New Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addValue())}
              />
              <Button 
                type="button"
                onClick={addValue}
                className="bg-black hover:bg-zinc-800 text-white p-3 rounded-none h-auto shrink-0"
              >
                <Plus size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              {values.map((v, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white border border-zinc-100 group hover:border-zinc-300 transition-all"
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                    {v}
                  </span>
                  <button 
                    type="button"
                    onClick={() => removeValue(v)}
                    className="text-zinc-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {values.length === 0 && (
                <div className="text-center py-10 border border-dashed border-zinc-100 bg-zinc-50/30">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 italic">No values defined</p>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-14 text-[10px] font-bold uppercase tracking-[0.2em] border-zinc-200 hover:border-black rounded-none transition-all"
          >
            Discard
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex-1 bg-black hover:bg-zinc-800 text-white h-14 text-[10px] font-bold uppercase tracking-[0.2em] rounded-none transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {mutation.isPending ? "Syncing..." : (
              <div className="flex items-center justify-center gap-2">
                <Save size={14} />
                <span>Save Registry</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
