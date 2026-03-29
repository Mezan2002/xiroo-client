"use client";
import React, { useState } from "react";
import { useAttributes } from "@/hooks/api/useAttributes";
import { Plus, Edit2, Trash2, Hash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import AttributeForm from "./AttributeForm";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useToast } from "@/hooks/useToast";

export default function AttributeList() {
  const { toast } = useToast();
  const { useAttributeRegistry, deleteAttribute } = useAttributes();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [deletingAttribute, setDeletingAttribute] = useState(null);

  const { data: attributesResponse, isLoading } = useAttributeRegistry();
  const attributes = attributesResponse || [];


  const handleEdit = (attr) => {
    setEditingAttribute(attr);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingAttribute(null);
    setIsFormOpen(true);
  };

  if (isLoading) return <div className="text-zinc-400 italic">Initializing Registry...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#37352F]">Active Attributes</h3>
          <p className="text-xs text-[#37352FA6]">Manage global variants and filter criteria.</p>
        </div>
        <Button 
          onClick={handleCreate}
          className="bg-black hover:bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-none px-8 py-6 h-auto"
        >
          <Plus size={14} className="mr-2" />
          Register New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attributes.map((attr) => (
          <div 
            key={attr._id}
            className="group p-8 bg-white border border-zinc-100 hover:border-black transition-all duration-500 relative flex flex-col justify-between h-full"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-50 flex items-center justify-center border border-zinc-100">
                    <Hash size={12} className="text-zinc-400" />
                  </div>
                  <h4 className="text-[13px] font-bold uppercase tracking-widest text-black">
                    {attr.name}
                  </h4>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(attr)}
                    className="p-2 text-zinc-300 hover:text-black transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => setDeletingAttribute(attr)}
                    className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {attr.values.map((val, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-zinc-50 text-[9px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-100"
                  >
                    {val}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-50 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">
              <span>{attr.values.length} Values</span>
              <span className="text-zinc-200">ID: {attr._id.substring(0, 8)}</span>
            </div>
          </div>
        ))}

        {attributes.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-zinc-100 p-20 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-200 italic">
              Registry empty. Add your first global attribute.
            </p>
          </div>
        )}
      </div>

      <AttributeForm 
        key={editingAttribute?._id || "new"}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        attribute={editingAttribute}
      />

      <ConfirmModal 
        isOpen={!!deletingAttribute}
        onClose={() => setDeletingAttribute(null)}
        onConfirm={() => {
          deleteAttribute.mutate(deletingAttribute._id, {
            onSuccess: () => {
              toast.success("Attribute deleted successfully.");
              setDeletingAttribute(null);
            }
          });
        }}
        title="Acknowledge Deletion?"
        message={`Are you certain you wish to purge the "${deletingAttribute?.name}" attribute from the global registry? This will affect all associated products.`}
      />
    </div>
  );
}
