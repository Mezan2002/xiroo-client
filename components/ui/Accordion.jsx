"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef(null);
  
  // Natively execute grid transition CSS bounds without inline recalculations.
  return (
    <div className="border-b border-gray-200 relative overflow-hidden group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-[22px] text-left transition-colors hover:text-gray-600 outline-none focus:outline-none"
      >
        <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-black">{title}</span>
        <div className="relative w-3 h-3 flex items-center justify-center shrink-0">
          <Minus 
            size={12} 
            strokeWidth={2}
            className={`absolute transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isOpen ? 'opacity-100 rotate-0 text-black' : 'opacity-0 -rotate-90 text-gray-400'}`} 
          />
          <Plus 
            size={12} 
            strokeWidth={2}
            className={`absolute transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${!isOpen ? 'opacity-100 rotate-0 text-black' : 'opacity-0 rotate-90 text-gray-400'}`} 
          />
        </div>
      </button>
      
      {/* High-fidelity CSS Grid transition array triggering exact DOM height bounds flawlessly */}
      <div 
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
         <div className="overflow-hidden" ref={contentRef}>
            {children}
         </div>
      </div>
    </div>
  );
}
