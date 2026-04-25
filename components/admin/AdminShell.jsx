/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useUser } from "@/hooks/api/useUser";
import { Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import SearchModal from "./SearchModal";

export default function AdminShell({ children }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [router]);

  if (!mounted || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center italic text-gray-400">
        Loading...!
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-white text-[#37352F] font-montserrat antialiased relative">
      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-[#F7F7F5] border-b border-[#EDECE9] shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-[#37352F80] hover:text-[#37352F] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-bold text-[11px]">
              X
            </div>
            <span className="text-[13px] font-bold text-[#37352F]">
              Xiroo Admin
            </span>
          </div>

          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-admin-search"))
            }
            className="p-2 -mr-2 text-[#37352F80] hover:text-[#37352F] transition-colors"
            aria-label="Search"
          >
            <Bell size={18} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
