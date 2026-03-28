/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useUser } from "@/hooks/api/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import SearchModal from "./SearchModal";

export default function AdminShell({ children }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router, mounted]);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("open-admin-search", handleOpenSearch);
    return () =>
      window.removeEventListener("open-admin-search", handleOpenSearch);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center italic text-gray-400">
        Synchronizing Identity...
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-white text-[#37352F] font-montserrat antialiased relative">
      {/* Global Search Modal: Absolute Top Priority */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
