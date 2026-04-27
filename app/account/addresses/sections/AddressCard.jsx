"use client";
import { Briefcase, Edit3, Home, MapPin, MoreHorizontal, Trash2 } from "lucide-react";

export default function AddressCard({ address, currentUser, onEdit, onDelete }) {
  const getTypeIcon = (typeStr) => {
    const t = typeStr?.toUpperCase();
    switch (t) {
      case "HOME": return <Home className="w-4 h-4" />;
      case "OFFICE": return <Briefcase className="w-4 h-4" />;
      default: return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  return (
    <div className="group relative p-5 sm:p-8 border border-black/5 hover:border-black transition-all duration-500 bg-white hover:shadow-2xl hover:shadow-black/5 flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-[9px] font-bold tracking-[0.3em] uppercase bg-zinc-900 text-white px-3 py-1.5 leading-none italic">
            {getTypeIcon(address.type)}
            {address.type}
          </span>
          {address.isDefault && (
            <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase">Default</span>
          )}
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-300 hover:text-black transition-colors" title="Edit" onClick={onEdit}>
            <Edit3 className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Remove" onClick={onDelete}>
            <Trash2 className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <h3 className="text-[15px] font-bold text-black mb-4 uppercase tracking-wide">
        {currentUser.firstName} {currentUser.lastName}
      </h3>

      <div className="space-y-3 text-[13px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider flex-1">
        <p className="flex items-center gap-2"><span className="text-gray-300">Phone:</span> {currentUser.phoneNumber}</p>
        <p>{address.addressLine1}</p>
        <p>{address.city}, {address.state}</p>
        <p className="flex items-center gap-2"><span className="text-gray-300">ZIP:</span> {address.postalCode}</p>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-black" />
        <span className="text-[10px] text-black font-bold tracking-widest uppercase italic">Shipping Destination</span>
      </div>
    </div>
  );
}
