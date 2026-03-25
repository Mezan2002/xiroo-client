"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/auth";
import { useUser } from "@/context/UserContext";
import { RefreshCw } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useUser();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Session Registry Persistence
      setToken(token);
      
      // 2. Global Identity Synchronization
      refreshUser().then(() => {
        // 3. High-Performance Redirection to Home
        router.push("/");
      });
    } else {
      // Fail-Safe: Redirect to login on protocol failure
      router.push("/login?error=auth_failed");
    }
  }, [searchParams, router, refreshUser]);

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
