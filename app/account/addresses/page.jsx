"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Edit3, X, Check, Home, Briefcase, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import SearchableDistrict from "@/components/ui/SearchableDistrict";

const MOCK_ADDRESSES = [
  { id: 1, type: "HOME", name: "Mezanur Rahman", phone: "+880 1712 345678", address: "House 24, Road 12", district: "Dhaka", upazila: "Banani", zip: "1206", isDefault: true },
];

export default function AddressesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    upazila: "",
    zip: "",
    type: "HOME",
    isDefault: false
  });

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        name: "",
        phone: "",
        address: "",
        district: "",
        upazila: "",
        zip: "",
        type: "HOME",
        isDefault: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "HOME": return <Home className="w-4 h-4" />;
      case "OFFICE": return <Briefcase className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-montserrat font-semibold">My Addresses</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 px-6"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          ADD NEW ADDRESS
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {addresses.map((address) => (
          <div key={address.id} className="group relative p-8 border border-black/5 hover:border-black transition-all duration-500 bg-white hover:shadow-2xl hover:shadow-black/5">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase bg-zinc-900 text-white px-3 py-1.5 leading-none italic">
                  {getTypeIcon(address.type)}
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gray-300 uppercase">Default</span>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 text-gray-300 hover:text-black transition-colors" 
                  title="Edit"
                  onClick={() => handleOpenModal(address)}
                >
                  <Edit3 className="w-4 h-4 stroke-[1.5]" />
                </button>
                <button className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Remove">
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <h3 className="text-[15px] font-bold text-black mb-4 uppercase tracking-wide">{address.name}</h3>
            
            <div className="space-y-3 text-[13px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">
              <p className="flex items-center gap-2">
                <span className="text-gray-300">Phone:</span> {address.phone}
              </p>
              <p>{address.address}</p>
              <p>{address.upazila}, {address.district}</p>
              <p className="flex items-center gap-2">
                <span className="text-gray-300">ZIP:</span> {address.zip}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span className="text-[10px] text-black font-bold tracking-widest uppercase italic">Shipping Destination</span>
            </div>
          </div>
        ))}

        <button 
          onClick={() => handleOpenModal()}
          className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-500 group"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-white border border-transparent group-hover:border-gray-100 transition-all">
            <Plus className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
          </div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-black transition-colors">Add New Address</p>
        </button>
      </div>

      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500" 
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-[600px] bg-white shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500">
            <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-white z-10">
              <h3 className="text-[20px] font-bold tracking-tight uppercase">
                {editingAddress ? "Edit Address" : "ADD NEW ADDRESS"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar">
              <form className="p-10 space-y-10" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors uppercase tracking-tight font-medium"
                        placeholder="e.g. Mezanur Rahman"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone Number</label>
                      <input 
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors font-mono tracking-tight"
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Street Address</label>
                    <input 
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors uppercase tracking-tight font-medium"
                      placeholder="e.g. House 24, Road 12"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-gray-50/50 border border-gray-100 px-6 pt-3 h-16 flex flex-col justify-center transition-all group focus-within:border-black focus-within:bg-white">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 block">District</label>
                      <SearchableDistrict 
                        value={formData.district} 
                        onChange={(val) => setFormData(prev => ({ ...prev, district: val }))}
                        className="border-none! px-0! h-8! pt-0! min-h-0! flex items-center"
                      />
                    </div>
                    <div className="bg-gray-50/50 border border-gray-100 px-6 pt-3 h-16 flex flex-col justify-center transition-all group focus-within:border-black focus-within:bg-white">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 block">Upazila / Thana</label>
                      <input 
                        type="text"
                        name="upazila"
                        value={formData.upazila}
                        onChange={handleInputChange}
                        className="w-full h-8 px-0 bg-transparent outline-none text-sm font-medium placeholder:text-gray-300 uppercase tracking-tight"
                        placeholder="e.g. Banani"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Postal Code</label>
                      <input 
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-gray-200 py-3 text-[14px] focus:outline-none focus:border-black transition-colors font-mono tracking-tight"
                        placeholder="XXXX"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Address Type</label>
                      <div className="flex gap-4 pt-1">
                        {["HOME", "OFFICE", "OTHERS"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type }))}
                            className={`flex-1 text-[10px] font-bold uppercase tracking-widest px-4 py-3 border transition-all ${formData.type === type ? "bg-black text-white border-black" : "bg-transparent text-gray-400 border-gray-100 hover:border-black hover:text-black"}`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 py-4 group cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))}>
                    <div className={`w-5 h-5 border flex items-center justify-center transition-all ${formData.isDefault ? "bg-black border-black" : "border-gray-200 group-hover:border-black"}`}>
                      {formData.isDefault && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                      Set as primary shipping address
                    </span>
                 </div>
              </form>
            </div>

            <div className="p-10 border-t border-gray-100 bg-white">
               <Button 
                 variant="primary" 
                 className="w-full h-16 tracking-[0.2em] group"
                 onClick={handleCloseModal}
               >
                 {editingAddress ? "SAVE CHANGES" : "ADD ADDRESS"}
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
