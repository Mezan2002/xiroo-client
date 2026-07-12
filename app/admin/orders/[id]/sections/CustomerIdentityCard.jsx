"use client";

export default function CustomerIdentityCard({ user, guestInfo, createdByAdmin }) {
  const firstName = user?.firstName || guestInfo?.firstName || "?";
  const lastName = user?.lastName || guestInfo?.lastName || "";
  const phoneNumber = user?.phoneNumber || guestInfo?.phone;

  return (
    <div className="bg-white border border-zinc-200 p-5">
      <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em] mb-4">Customer Identity</h3>

      {/* Customer */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 shrink-0 bg-zinc-900 text-white flex items-center justify-center text-[13px] font-bold uppercase">
          {firstName.charAt(0)}
        </div>
        <span className="text-[13px] font-bold text-zinc-900">{firstName} {lastName}</span>
      </div>

      <div className="space-y-2.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-zinc-400 font-medium">Phone</span>
          <span className="text-zinc-900 font-bold font-mono">{phoneNumber || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400 font-medium">Tier</span>
          <span className="text-zinc-900 font-bold">
            {user ? user.tier || "Standard" : guestInfo ? "Guest" : "Standard"}
          </span>
        </div>
      </div>

      {/* Admin */}
      {createdByAdmin && (
        <div className="mt-4 pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px] font-bold uppercase rounded-full">
              {(createdByAdmin.firstName || "A").charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Created by</span>
              <span className="text-[11px] font-bold text-zinc-900">{createdByAdmin.firstName} {createdByAdmin.lastName}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
