"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const isCollection = pathname?.includes("/collections/");

  const config = {
    title: isCollection ? "MISSING." : "LOST.",
    badge: isCollection ? "Collection Not Found" : "Page Not Found",
    heading: isCollection
      ? "The season's lookbook has been updated."
      : "The page you're seeking has moved.",
    description: isCollection
      ? "The collection you requested might have been archived or was part of a limited release that is no longer available."
      : "The URL might be incorrect, or this content may have been permanently removed from our servers.",
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white overflow-hidden relative pt-20">
      {/* Editorial Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-zinc-100" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-100" />

      {/* Background Silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none">
        <span className="text-[30vw] font-black tracking-tighter uppercase italic">
          404
        </span>
      </div>

      <div className="container px-6 relative z-10 flex flex-col items-center text-center py-20">
        {/* Large Aesthetic Typography */}
        <div className="relative mb-12">
          <div className="flex items-center justify-center">
            <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter text-black select-none">
              {config.title}
            </h1>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none">
            <span className="text-[10px] md:text-[12px] font-bold tracking-[0.6em] uppercase text-zinc-400 bg-white px-6 py-2 border border-zinc-100 shadow-sm whitespace-nowrap">
              {config.badge}
            </span>
          </div>
        </div>

        {/* Messaging - Premium Editorial Style */}
        <div className="max-w-xl space-y-8 mb-16">
          <h2 className="text-[20px] md:text-[28px] font-bold text-black uppercase tracking-widest leading-tight">
            {config.heading}
          </h2>
          <p className="text-[14px] md:text-[16px] text-zinc-500 font-medium leading-relaxed tracking-tight max-w-md mx-auto">
            {config.description}
          </p>
        </div>

        {/* Action Buttons - High Contrast */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <Link href="/" passHref className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={Home}
              className="w-full sm:w-auto min-w-[240px] h-[64px] bg-black text-white hover:bg-zinc-800 rounded-none flex items-center justify-center gap-3 group transition-all shadow-xl active:scale-95"
            >
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
                Explore Home
              </span>
            </Button>
          </Link>

          <Link href="/shop" passHref className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              icon={ShoppingBag}
              className="w-full sm:w-auto min-w-[240px] h-[64px] border-black text-black hover:bg-black hover:text-white rounded-none flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
                Shop Collections
              </span>
            </Button>
          </Link>
        </div>

        {/* Minimal Footer for 404 */}
        <div className="mt-20">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors duration-300 border-b border-transparent hover:border-black pb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Return to Previous
            </span>
          </button>
        </div>
      </div>

      {/* Decorative Architecture */}
      <div className="absolute top-12 left-12 border-l border-t border-zinc-100 w-12 h-12 pointer-events-none" />
      <div className="absolute bottom-12 right-12 border-r border-b border-zinc-100 w-12 h-12 pointer-events-none" />
    </div>
  );
}
