import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, MapPin } from "lucide-react";

const InputField = ({ label, field, value, onChange, placeholder }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-4 bg-zinc-50 border border-zinc-100 rounded-none text-[13px] font-medium text-black focus:outline-none focus:border-black transition-all"
    />
  </div>
);

export default function EditAddressModal({
  isOpen,
  onClose,
  onSave,
  initialAddress = {}
}) {
  const [address, setAddress] = useState(initialAddress);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-none shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                <MapPin size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[13px] font-bold text-black uppercase tracking-widest leading-none">Shipping Anchor</h3>
                <span className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-tight">Manual Override</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-300 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <InputField 
              label="Street Address" 
              field="address" 
              value={address.address}
              onChange={handleChange}
              placeholder="Enter full address" 
            />
            
            <div className="flex gap-6">
              <InputField 
                label="Area / Sector" 
                field="area" 
                value={address.area}
                onChange={handleChange}
                placeholder="e.g. Uttara" 
              />
              <InputField 
                label="City" 
                field="city" 
                value={address.city}
                onChange={handleChange}
                placeholder="e.g. Dhaka" 
              />
            </div>

            <div className="flex gap-6">
              <InputField 
                label="Postcode" 
                field="postcode" 
                value={address.postcode}
                onChange={handleChange}
                placeholder="e.g. 1230" 
              />
              <InputField 
                label="Country" 
                field="country" 
                value={address.country}
                onChange={handleChange}
                placeholder="e.g. Bangladesh" 
              />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-zinc-50">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-14 text-[11px] font-bold tracking-widest uppercase border-zinc-100 text-zinc-400 hover:border-black hover:text-black"
            >
              Discard
            </Button>
            <Button
              variant="primary"
              onClick={() => onSave(address)}
              className="h-14 text-[11px] font-bold tracking-[0.2em] uppercase"
            >
              Save Registry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
