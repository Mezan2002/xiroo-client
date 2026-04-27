"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Button } from "@/components/ui/Button";
import { Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import ConversationCard from "./sections/ConversationCard";
import { useInboxLogic } from "./sections/useInboxLogic";

export default function AdminInbox() {
  const router = useRouter();
  const { conversations, isLoading, filter, setFilter, refetch } = useInboxLogic();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-pulse">
        <div className="w-12 h-12 bg-[#EDECE9] animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#37352F60]">Synchronizing Registry...</p>
      </div>
    );
  }

  const filters = [
    { id: "All", label: "All Records" },
    { id: "active", label: "Active" },
    { id: "flagged", label: "Under Review" },
    { id: "resolved", label: "Resolved" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-montserrat">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Inbox", active: true },
        ]}
        title="Intelligence Hub"
        icon={Mail}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#EDECE9] pb-4 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar whitespace-nowrap">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${filter === f.id ? "bg-black text-white" : "text-[#37352FA6] hover:bg-[#F7F7F5]"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button variant="ghost" className="hidden sm:flex text-[10px] font-bold uppercase tracking-[0.2em] text-[#37352F60] hover:text-black">
            Clear Notifications
          </Button>
        </div>

        <div className="space-y-px bg-[#EDECE9] border border-[#EDECE9] overflow-hidden shadow-2xl shadow-black/5">
          {conversations?.length === 0 ? (
            <div className="bg-white p-20 text-center space-y-4">
              <Shield size={32} className="mx-auto text-[#EDECE9]" />
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#37352F60]">Zero {filter !== "All" ? filter : ""} Inquiries</p>
            </div>
          ) : (
            conversations?.map((conv) => (
              <ConversationCard
                key={conv._id}
                conv={conv}
                onOpen={() => router.push(`/admin/inbox/${conv._id}`)}
                onRefetch={refetch}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
