"use client";
import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import SearchModal from "./SearchModal";

export default function AdminShell({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("open-admin-search", handleOpenSearch);
    return () => window.removeEventListener("open-admin-search", handleOpenSearch);
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-[#37352F] font-montserrat antialiased relative">
      {/* Global Search Modal: Absolute Top Priority */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
