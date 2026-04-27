"use client";
import { Button } from "@/components/ui/Button";
import SearchableDistrict from "@/components/ui/SearchableDistrict";
import { Check, X } from "lucide-react";

export default function AddressModal({
  isOpen,
  onClose,
  editingAddress,
  formData,
  setFormData,
  saveAddress,
}) {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={onClose} />
      <div className="relative w-full max-w-[600px] bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-10 py-6 md:py-8 border-b border-gray-100 bg-white shrink-0">
          <h3 className="text-[16px] md:text-[20px] font-bold tracking-tight uppercase">{editingAddress ? "Edit Address" : "ADD NEW ADDRESS"}</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-10 space-y-8 md:space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Street Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors uppercase font-medium"
              placeholder="e.g. House 24, Road 12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">District</label>
              <SearchableDistrict
                value={formData.district}
                onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
                className={`h-12! px-0! text-sm font-medium border-b! ${formData.district ? "border-black!" : "border-gray-200"}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">Upazila / Thana</label>
              <input
                type="text"
                name="upazila"
                value={formData.upazila}
                onChange={handleInputChange}
                className={`w-full h-12 bg-transparent border-b outline-none text-sm font-medium placeholder:text-gray-300 uppercase transition-all ${formData.upazila ? "border-black" : "border-gray-200"} focus:border-black`}
                placeholder="e.g. Banani"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Postal Code</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black font-mono"
                placeholder="XXXX"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Address Type</label>
              <div className="flex gap-2 pt-1">
                {["HOME", "OFFICE", "OTHERS"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type }))}
                    className={`flex-1 text-[10px] font-bold uppercase tracking-widest px-4 py-3 border transition-all ${formData.type === type ? "bg-black text-white border-black" : "bg-transparent text-gray-400 border-gray-100 hover:border-black hover:text-black"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 py-2 group cursor-pointer" onClick={() => setFormData(p => ({ ...p, isDefault: !p.isDefault }))}>
            <div className={`w-5 h-5 border flex items-center justify-center transition-all ${formData.isDefault ? "bg-black border-black" : "border-gray-200 group-hover:border-black"}`}>
              {formData.isDefault && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Set as primary shipping address</span>
          </div>
        </div>

        <div className="p-5 sm:p-10 border-t border-gray-100 bg-white shrink-0">
          <Button variant="primary" className="w-full h-14 md:h-16 tracking-[0.2em] text-[11px]" onClick={saveAddress}>
            {editingAddress ? "SAVE CHANGES" : "ADD ADDRESS"}
          </Button>
        </div>
      </div>
    </div>
  );
}
