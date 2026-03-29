"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { useUser } from "@/hooks/api/useUser";
import { RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/authSlice";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Session Registry Persistence (Redux + LocalStorage)
      dispatch(setCredentials({ token }));
      
      // 2. High-Performance Identity Synchronization
      // We wait for the profile refresh to complete before moving the user
      // to the home page, ensuring a seamless "identified" state.
      const syncIdentity = async () => {
        try {
          // Protocol Check: Ensure the token is valid before entry
          // Initial verify with explicit header to avoid interceptor lag
          await axiosInstance.get("/users/me", {
            headers: { Authorization: token },
          });
          
          // Re-trigger global query refetch to hydrate UI
          await refreshUser();
          
          router.push("/");
        } catch (error) {
          console.error("Identity Sync Protocol Breach:", error);
          router.push("/login?error=sync_failed");
        }
      };

      syncIdentity();
    } else {
      // Fail-Safe: Redirect to login on protocol failure
      router.push("/login?error=auth_failed");
    }
  }, [searchParams, router, refreshUser, dispatch]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-white">
      <div className="relative">
        <div className="w-16 h-16 border-t-2 border-zinc-800 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-zinc-800 rounded-none scale-75 animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-[14px] font-montserrat font-bold uppercase tracking-[0.3em] text-zinc-800">
          Synchronizing Identity
        </h2>
        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-widest animate-pulse">
          Establishing secure protocol connection...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-zinc-100" />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
