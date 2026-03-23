"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapainawabganj", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari", "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
];

export default function SearchableDistrict({ value, onChange, placeholder = "Select District", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredDistricts = BANGLADESH_DISTRICTS.filter(d => 
    d.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 px-6 bg-transparent border-b ${isOpen ? "border-black" : "border-gray-200"} flex items-center justify-between cursor-pointer transition-all text-[14px] font-medium uppercase tracking-tight ${className}`}
      >
        <span className={value ? "text-black" : "text-gray-300"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 w-full mt-1 bg-white border border-gray-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-50 flex items-center gap-3">
            <Search className="w-4 h-4 text-gray-300" />
            <input
              type="text"
              className="flex-1 outline-none text-sm font-medium lowercase tracking-tighter"
              placeholder="search districts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto custom-scrollbar">
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
        </div>
      )}
    </div>
  );
}
