"use client";

import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login, preserving the current path for post-login redirection
      const redirectPath = encodeURIComponent(pathname);
      router.push(`/login?redirect=${redirectPath}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            Authenticating Security Registry...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents flashing of protected content
  }

  return children;
}
