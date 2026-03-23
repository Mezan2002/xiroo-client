"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] font-montserrat antialiased">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mx-auto mb-8 rounded-none" />
        <p className="text-[11px] font-bold text-[#37352F40] uppercase tracking-[0.4em]">Redirecting to Xiroo Core...</p>
      </div>
    </div>
  );
}
