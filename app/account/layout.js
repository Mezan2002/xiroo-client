"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Heart, MapPin, Settings, LogOut, Shield } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Orders History", href: "/account/orders", icon: Package },
  { label: "Saved Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "My Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Prestige Loyalty", href: "/account/loyalty", icon: Shield },
  { label: "Account Settings", href: "/account/settings", icon: Settings },
];

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useUser } from "@/hooks/api/useUser";

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useUser();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white pt-32 pb-24 px-6 lg:px-12 max-w-[1600px] mx-auto text-black">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="border-b border-gray-100 pb-10">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold tracking-tight text-black">
              My Account
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em] mt-4">
              Manage your boutique experience
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <nav className="flex flex-col space-y-1">
                {SIDEBAR_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-4 px-4 py-4 transition-all duration-300 border-l-2 ${
                        isActive
                          ? "border-black bg-gray-50 text-black"
                          : "border-transparent text-gray-400 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 stroke-[1.5] transition-colors ${isActive ? "text-black" : "text-gray-300 group-hover:text-black"}`} />
                      <span className="text-[13px] font-semibold tracking-wide uppercase">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                <button
                  className="group flex items-center gap-4 px-4 py-8 text-red-400 hover:text-red-600 transition-all duration-300 border-l-2 border-transparent"
                  onClick={logout}
                >
                  <LogOut className="w-4 h-4 stroke-[1.5] text-red-200 group-hover:text-red-500 transition-colors" />
                  <span className="text-[13px] font-semibold tracking-wide uppercase">
                    Sign Out
                  </span>
                </button>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
