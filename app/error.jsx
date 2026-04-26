/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/Button";
import { AlertCircle, Home, LifeBuoy, RefreshCcw } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Error({ error, reset }) {
  const [traceId, setTraceId] = React.useState("");

  useEffect(() => {
    console.error("Unhandled Application Error:", error);
    setTraceId(Math.random().toString(36).substring(7).toUpperCase());
  }, [error]);

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-white overflow-hidden relative pt-20">
      {/* Soft Architectural Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-zinc-100" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-zinc-100" />

      {/* Subtle Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <span className="text-[20vw] font-black tracking-tighter uppercase italic">
          Xiroo
        </span>
      </div>

      <div className="container px-6 relative z-10 flex flex-col items-center text-center py-20">
        {/* Animated Error Indicator */}
        <div className="mb-12 relative">
          <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
            <AlertCircle className="w-10 h-10 text-black animate-pulse" />
          </div>
        </div>

        {/* Messaging - Premium Editorial Style */}
        <div className="max-w-2xl space-y-8 mb-16">
          <div className="space-y-2">
            <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-zinc-400">
              Error Report
            </span>
            <h1 className="text-[40px] md:text-[64px] font-black uppercase tracking-tighter leading-[0.9] text-black">
              SYSTEM <br /> PAUSE.
            </h1>
          </div>

          <p className="text-[14px] md:text-lg text-zinc-500 font-medium leading-relaxed tracking-tight max-w-lg mx-auto">
            Our digital storefront is experiencing a brief intermission. We are
            already recalibrating the experience for your return.
          </p>

          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-zinc-200" />
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              Trace: {traceId || "LOADING..."}
            </span>
            <div className="h-px w-8 bg-zinc-200" />
          </div>
        </div>

        {/* Action Buttons - High Contrast */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => reset()}
            className="w-full sm:w-auto min-w-[240px] h-[64px] bg-black text-white hover:bg-zinc-800 rounded-none flex items-center justify-center gap-3 group transition-all shadow-xl active:scale-95"
          >
            <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
              Try Restoration
            </span>
          </Button>

          <Link href="/" passHref className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[240px] h-[64px] border-black text-black hover:bg-black hover:text-white rounded-none flex items-center justify-center gap-3 transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
                Return to Home
              </span>
            </Button>
          </Link>
        </div>

        {/* Minimal Support Link */}
        <div className="mt-20">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-black transition-colors duration-300 border-b border-transparent hover:border-black pb-1"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              Contact Support
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
