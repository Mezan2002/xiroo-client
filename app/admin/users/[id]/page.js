"use client";
import DataTable from "@/components/admin/shared/DataTable";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import UserForm from "@/components/admin/users/UserForm";
import { useLoyalty } from "@/hooks/api/useLoyalty";
import { useUsers } from "@/hooks/api/useUsers";
import { useToast } from "@/hooks/useToast";
import { Clock, Shield, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const ORDER_COLUMNS = [
  { key: "id", label: "Registry ID", type: "text" },
  { key: "date", label: "Transaction Date", type: "text" },
  { key: "items", label: "Volume", type: "text" },
  { key: "total", label: "Expenditure", type: "text" },
  { key: "status", label: "Logistics State", type: "status" },
];

export default function UserDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { useUserDetail, updateUser } = useUsers();
  const { useLoyaltySettings } = useLoyalty();

  const { data: userData, isLoading: isUserLoading } = useUserDetail(id);
  const { data: loyaltySettings, isLoading: isLoyaltyLoading } =
    useLoyaltySettings();

  const isPageLoading = isUserLoading || isLoyaltyLoading;

  const currentTierConfig = loyaltySettings?.tierConfig?.find(
    (t) => t.tier.toLowerCase() === (userData?.tier || "bronze").toLowerCase(),
  );

  const handleSubmit = async (data) => {
    updateUser.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("User Registry Synchronized Successfully.");
          router.push("/admin/users");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to modify user registry.");
        },
      },
    );
  };

  if (isPageLoading)
    return (
      <div className="h-screen flex items-center justify-center italic text-gray-400">
        Checking Identity...!
      </div>
    );
  if (!userData) return null;

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: "Identity Refinement", active: true },
        ]}
        title="Identity Analysis"
        icon={User}
      />

      <div className="space-y-16 max-w-7xl">
        <div className="space-y-6">
          {/* Intelligence Grid - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-[#FDFDFB] border border-gray-100 space-y-4">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Loyalty Engagement
              </p>
              <div className="flex items-end gap-2">
                <p className="text-[32px] font-bold tracking-tighter text-black leading-none">
                  {userData.points || 0}
                </p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase pb-1 tracking-widest">
                  Points
                </p>
              </div>
            </div>

            <div className="p-8 bg-white border border-gray-100 space-y-4">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Membership Tier
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[18px] font-bold tracking-tight text-black uppercase">
                  {userData.tier || "Bronze"}
                </p>
                {(() => {
                  const tier = (userData.tier || "bronze").toLowerCase();
                  const tierStyles = {
                    bronze: "bg-[#CD7F3210] border-[#CD7F32] text-[#CD7F32]",
                    silver: "bg-[#90909010] border-[#909090] text-[#909090]",
                    gold: "bg-[#D4AF3710] border-[#D4AF37] text-[#D4AF37]",
                    platinum: "bg-[#70809010] border-[#708090] text-[#708090]",
                    diamond: "bg-[#B9F2FF20] border-[#70D1F1] text-[#0A4D68]",
                  };
                  return (
                    <span
                      className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${tierStyles[tier] || tierStyles.bronze}`}
                    >
                      Verified
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="p-8 bg-white border border-gray-100 space-y-2">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Core Access
              </p>
              <p className="text-[18px] font-bold tracking-tight text-black uppercase">
                {userData.role}
              </p>
            </div>

            <div className="p-8 bg-black space-y-4">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                Administrative Context
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-white uppercase mb-1">
                    {userData.authType || "Direct"}
                  </p>
                  <p className="text-[9px] text-zinc-500 font-medium">
                    Authentication Vector
                  </p>
                </div>
                <Shield size={16} className="text-zinc-500" />
              </div>
            </div>
          </div>

          {/* Prestige Privileges Banner */}
          {currentTierConfig?.benefits?.length > 0 && (
            <div className="p-8 bg-[#FAFAFA] border border-gray-100 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-1 h-4 bg-black" />
                <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">
                  Prestige Privileges
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {currentTierConfig.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[11px] font-medium text-zinc-600 lowercase italic">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile & History - Main Vertical Flow */}
        <div className="space-y-16">
          <section className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Shield size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Registry Profile
              </h3>
            </div>
            <UserForm
              initialData={userData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Clock size={16} className="text-zinc-300" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Transactional Lineage
              </h3>
            </div>
            <div className="border border-gray-100 bg-white p-1">
              <DataTable
                columns={ORDER_COLUMNS}
                data={[]} // Future: Integrate real order history
                loading={false}
              />
              <div className="px-3 py-10 text-center text-[11px] text-gray-300 uppercase tracking-widest italic border-t border-gray-50">
                Cross-referencing order registry...
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
