"use client";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessageHeader({
  customer,
  conversationId,
  isResolved,
  setStatus,
  isInfoOpen,
  setIsInfoOpen,
}) {
  const router = useRouter();

  return (
    <header className="h-[64px] md:h-[72px] shrink-0 px-4 md:px-8 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-zinc-400 hover:bg-zinc-50">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 text-white flex items-center justify-center font-bold text-xs md:text-sm uppercase">
            {customer.firstName?.[0] || "?"}
          </div>
          <div>
            <h1 className="text-[13px] md:text-[15px] font-semibold text-zinc-900 truncate max-w-[120px] sm:max-w-none">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden sm:inline-block text-[11px] font-medium text-zinc-500 uppercase tracking-widest px-3 py-1 border border-zinc-200">
          Case #{conversationId?.slice(-6).toUpperCase()}
        </span>
        <button onClick={() => setIsInfoOpen(!isInfoOpen)} className="lg:hidden p-2 text-zinc-400 hover:bg-zinc-50">
          <Shield size={20} />
        </button>
        <button
          onClick={() => setStatus.mutate({ id: conversationId, status: isResolved ? "active" : "resolved" })}
          disabled={setStatus.isPending}
          className={`h-9 px-5 text-[11px] font-semibold transition-all ${
            isResolved ? "bg-emerald-50 text-emerald-700" : "bg-zinc-900 text-white shadow-lg"
          }`}
        >
          {setStatus.isPending ? <Loader2 size={14} className="animate-spin" /> : (isResolved ? "Reopen Case" : "Resolve Case")}
        </button>
      </div>
    </header>
  );
}
