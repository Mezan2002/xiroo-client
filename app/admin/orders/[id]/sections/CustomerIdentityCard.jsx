"use client";

const Card = ({ children, title, action, className = "" }) => (
  <div
    className={`bg-white border border-zinc-200 rounded-none overflow-hidden ${className}`}
  >
    {(title || action) && (
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-zinc-900 tracking-tight">
          {title}
        </h3>
        {action}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const DetailSection = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
      {label}
    </span>
    <span className="text-[12px] font-bold text-zinc-900 tracking-tight">
      {value}
    </span>
  </div>
);

export default function CustomerIdentityCard({ user, guestInfo }) {
  const firstName = user?.firstName || guestInfo?.firstName || "?";
  const lastName = user?.lastName || guestInfo?.lastName || "";
  const email = user?.email || guestInfo?.email;
  const phoneNumber = user?.phoneNumber || guestInfo?.phone;

  return (
    <Card title="Customer Identity">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <div className="size-9 shrink-0 bg-black text-white flex items-center justify-center text-[18px] font-medium uppercase">
            {firstName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900">
              {firstName} {lastName}
            </span>
            <span className="text-[10px] text-zinc-800 font-semibold uppercase">
              {email}
            </span>
          </div>
        </div>
        <div className="pt-6 border-t border-zinc-100 flex flex-col gap-4">
          <DetailSection
            label="Communication"
            value={phoneNumber || "NO_CONTACT_DATA"}
          />
          <DetailSection
            label="Account Tier"
            value={
              user
                ? user.tier || "Standard"
                : guestInfo
                  ? "Guest Client"
                  : "Standard"
            }
          />
        </div>
      </div>
    </Card>
  );
}
