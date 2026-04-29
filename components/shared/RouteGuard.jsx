"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";

/**
 * Senior Dev Pattern: RouteGuard
 * Centralized security gateway for high-stakes routes.
 * Orchestrates redirection protocols for unauthorized access attempts.
 */
export default function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [authorized, setAuthorized] = useState(false);

  // Define Protected Regions (Live Security List)
  const protectedRoutes = ["/account", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  useEffect(() => {
    // 1. Initial State Check
    const checkAuth = () => {
      if (!isAuthenticated && isProtectedRoute) {
        setAuthorized(false);
        // Protocol Breach: Redirect to Identification with return path
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setAuthorized(true);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [pathname, isAuthenticated, isProtectedRoute, router, loading]);

  // High-Performance Loading State for Identity Verification
  if (!authorized && isProtectedRoute) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <RefreshCw className="w-6 h-6 animate-spin text-zinc-900 mb-4" />
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">
          Verifying Identity...
        </p>
      </div>
    );
  }

  return children;
}
