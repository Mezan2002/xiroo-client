"use client";
import { ChevronDown, Flag, Shield, UserCheck } from "lucide-react";

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"];
const PRIORITY_STYLES = {
  low: { pill: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  medium: { pill: "bg-zinc-50 text-zinc-600 border-zinc-100", dot: "bg-zinc-400" },
  high: { pill: "bg-orange-50 text-orange-700 border-orange-100", dot: "bg-orange-500" },
  urgent: { pill: "bg-red-50 text-red-700 border-red-100", dot: "bg-red-500" },
};

export default function CustomerInfoSidebar({
  customer,
  conversation,
  adminRegistry,
  isInfoOpen,
  setIsInfoOpen,
  showPriorityMenu,
  setShowPriorityMenu,
  showAssignMenu,
  setShowAssignMenu,
  setPriority,
  assignConversation,
  flagConversation,
}) {
  const priority = conversation?.priority || "medium";
  const ps = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;
  const isResolved = conversation?.status === "resolved";

  return (
    <>
      {isInfoOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={() => setIsInfoOpen(false)} />
      )}

      <aside className={`fixed lg:relative inset-y-0 right-0 w-[300px] sm:w-[320px] bg-white z-[70] lg:z-0 transform lg:transform-none transition-transform duration-500 border-l border-zinc-100 flex flex-col overflow-y-auto custom-scrollbar ${isInfoOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="p-8 text-center bg-zinc-50/50 border-b border-zinc-100">
          <div className="w-20 h-20 bg-white border border-zinc-100 flex items-center justify-center mx-auto mb-5 shadow-xl text-2xl font-bold text-zinc-900 uppercase">
            {customer.firstName?.[0] || "?"}
          </div>
          <h2 className="text-[17px] font-bold text-zinc-900 tracking-tight">{customer.firstName} {customer.lastName}</h2>
          <p className="text-[12px] text-zinc-600 mt-1.5 font-semibold truncate px-4">{customer.email}</p>
          
          <div className="mt-6 flex flex-col gap-2.5 px-4 w-full">
            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
              <span className="uppercase tracking-widest text-[9px]">Joined</span>
              <span className="text-zinc-900">{customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString([], { month: "short", year: "numeric" }) : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
              <span className="uppercase tracking-widest text-[9px]">Account</span>
              <span className="text-emerald-600 font-bold">Verified</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-10">
          <div className="space-y-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Case Management</p>
            <div className="space-y-3">
              {/* Priority */}
              <div className="relative">
                <button
                  onClick={() => { setShowPriorityMenu(!showPriorityMenu); setShowAssignMenu(false); }}
                  className={`w-full flex items-center justify-between px-5 h-12 border transition-all text-[12px] font-semibold ${ps.pill}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 ${ps.dot}`} />
                    <span className="capitalize">{priority} Priority</span>
                  </div>
                  <ChevronDown size={14} className={`opacity-40 transition-transform ${showPriorityMenu ? "rotate-180" : ""}`} />
                </button>
                {showPriorityMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-2xl z-30 py-2">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setPriority.mutate({ id: conversation._id, priority: p }); setShowPriorityMenu(false); }}
                        className="w-full text-left px-5 py-2.5 text-[12px] font-medium hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <span className={`w-1.5 h-1.5 ${PRIORITY_STYLES[p]?.dot}`} />
                        <span className="capitalize">{p}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Assignment */}
              <div className="relative">
                <button
                  onClick={() => { setShowAssignMenu(!showAssignMenu); setShowPriorityMenu(false); }}
                  className="w-full flex items-center justify-between px-5 h-12 border border-zinc-100 bg-white text-[12px] font-semibold text-zinc-700"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck size={16} className="text-zinc-400" />
                    <span className="truncate">{conversation?.assignedTo ? conversation.assignedTo.firstName : "Unassigned"}</span>
                  </div>
                  <ChevronDown size={14} className={`opacity-40 transition-transform ${showAssignMenu ? "rotate-180" : ""}`} />
                </button>
                {showAssignMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-zinc-100 shadow-2xl z-30 py-2 max-h-56 overflow-y-auto">
                    {adminRegistry.map((admin) => (
                      <button
                        key={admin._id}
                        onClick={() => { assignConversation.mutate({ id: conversation._id, assignedTo: admin._id }); setShowAssignMenu(false); }}
                        className="w-full text-left px-5 py-2.5 text-[12px] font-medium hover:bg-zinc-50 flex items-center gap-3"
                      >
                        <div className="w-6 h-6 bg-zinc-100 flex items-center justify-center text-[10px] font-bold">{admin.firstName?.[0]}</div>
                        {admin.firstName} {admin.lastName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Flag */}
              <button
                onClick={() => flagConversation.mutate(conversation._id)}
                className={`w-full flex items-center gap-3 px-5 h-12 border transition-all text-[12px] font-semibold ${
                  conversation?.isFlagged ? "bg-blue-50 border-blue-100 text-blue-700 shadow-sm" : "bg-white border-zinc-100 text-zinc-600"
                }`}
              >
                <Flag size={15} className={conversation?.isFlagged ? "text-blue-600" : "text-zinc-300"} />
                <span>{conversation?.isFlagged ? "Under Review" : "Mark for Review"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-zinc-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Case Registry</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-medium text-zinc-500 py-1.5 border-b border-zinc-50">
                <span className="uppercase tracking-widest text-[9px]">Status</span>
                <span className={`flex items-center gap-1.5 font-bold uppercase text-[10px] ${isResolved ? "text-emerald-600" : "text-amber-600"}`}>
                  <span className={`w-1.5 h-1.5 ${isResolved ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                  {isResolved ? "Resolved" : "Open"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-50 flex flex-col items-center opacity-70">
            <Shield size={20} className="text-zinc-400 mb-4" />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600">Secure Protocol v2.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
