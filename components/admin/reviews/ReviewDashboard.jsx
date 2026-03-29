"use client";
import { useState } from "react";
import { useReviews } from "@/hooks/api/useReviews";
import ReviewTable from "./ReviewTable";
import { MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";

const TABS = [
  { id: "all", label: "All Reviews", icon: MessageSquare },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle2 },
  { id: "rejected", label: "Rejected", icon: XCircle },
];

export default function ReviewDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const { useAdminReviews } = useReviews();
  const { data: response, isLoading } = useAdminReviews();
  
  const reviews = response?.data || response || [];

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "all") return true;
    return review.status === activeTab;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 w-full bg-[#F7F7F5] animate-pulse rounded-none" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      {/* Refined Segmented Navigation */}
      <div className="flex items-center p-1 bg-zinc-50 border border-zinc-100 w-fit rounded-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === 'all' ? reviews.length : reviews.filter(r => r.status === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-all rounded-none flex items-center gap-2 ${
                isActive
                  ? "bg-white text-black shadow-xs ring-1 ring-zinc-200"
                  : "text-zinc-400 hover:text-black hover:bg-white/50"
              }`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span className={`text-[9px] font-mono ${isActive ? "text-zinc-400" : "text-zinc-300"}`}>
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Standardized Data Table */}
      <div className="bg-white">
        <ReviewTable reviews={filteredReviews} />
      </div>
    </div>
  );
}
