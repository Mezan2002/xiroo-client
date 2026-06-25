"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";

export const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

export default function SearchableDistrict({ value, onChange, placeholder = "Select District", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openAbove, setOpenAbove] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const portalRef = useRef(null);

  const filteredDistricts = BANGLADESH_DISTRICTS.filter(d => 
    d.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      const isInsidePortal = portalRef.current && portalRef.current.contains(event.target);
      
      if (!isInsideDropdown && !isInsidePortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        width: rect.width
      });

      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setOpenAbove(true);
      } else {
        setOpenAbove(false);
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={toggleDropdown}
        className={`w-full h-14 px-6 bg-transparent border-b ${isOpen ? "border-black" : "border-gray-200"} flex items-center justify-between cursor-pointer transition-all text-[14px] font-medium uppercase tracking-tight ${className}`}
      >
        <span className={value ? "text-black" : "text-gray-300"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && createPortal(
        <div 
          ref={portalRef}
          className={`fixed z-9999 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200 flex flex-col`}
          style={{
            left: coords.left,
            width: coords.width,
            ...(openAbove 
               ? { bottom: window.innerHeight - (coords.top - window.scrollY) + 4 } 
               : { top: (coords.bottom - window.scrollY) + 4 }
            )
          }}
        >
          <div className="p-3 border-b border-gray-50 flex items-center gap-3 bg-white">
            <Search className="w-4 h-4 text-gray-300" />
            <input
              type="text"
              className="flex-1 outline-none text-sm font-medium uppercase tracking-tighter"
              placeholder="search districts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar bg-white">
            {filteredDistricts.length > 0 ? (
              filteredDistricts.map(d => (
                <div
                  key={d}
                  onClick={() => {
                    onChange(d);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-6 py-4 text-sm font-medium cursor-pointer transition-colors hover:bg-gray-50 ${value === d ? "bg-gray-50 text-black border-l-2 border-black" : "text-gray-500"}`}
                >
                  {d}
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-[11px] font-bold uppercase tracking-widest text-center text-gray-300">
                No District Found
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
