"use client";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import { Info, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLoyalty } from "@/hooks/api/useLoyalty";
import { useToast } from "@/hooks/useToast";



export default function AdminLoyalty() {
  const { toast } = useToast();
  const { useLoyaltySettings, updateLoyaltySettings } = useLoyalty();
  const { data: fetchedSettings, isLoading } = useLoyaltySettings();

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  const handleUpdate = async () => {
    updateLoyaltySettings.mutate(settings, {
      onSuccess: () => {
        toast.success("Loyalty Matrix Calibrated Successfully.");
      },
      onError: (err) => {
        toast.error(err.message || "Calibration Failure.");
      }
    });
  };


  const updateTierConfig = (index, field, value) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[index] = { ...newTierConfig[index], [field]: value };
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  const addBenefit = (index) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[index].benefits.push("");
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  const removeBenefit = (tierIndex, benefitIndex) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[tierIndex].benefits.splice(benefitIndex, 1);
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  const updateBenefit = (tierIndex, benefitIndex, value) => {
    const newTierConfig = [...settings.tierConfig];
    newTierConfig[tierIndex].benefits[benefitIndex] = value;
    setSettings({ ...settings, tierConfig: newTierConfig });
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center italic text-gray-400">
        Synchronizing Matrix...
      </div>
    );
  if (!settings) return null;

  return (
    <div className="space-y-16 pb-24 animate-in fade-in duration-700">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings", href: "/admin/settings" },
          { label: "Loyalty Matrix", active: true },
        ]}
        title="Loyalty Matrix"
        icon={ShieldCheck}
      />

      <div className="max-w-7xl space-y-16">
        {/* Point Accrual Strategy */}
        <section className="space-y-10">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-black" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Point Accrual Strategy
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Points Per 100 BDT Spent
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={settings.pointsPerHundred}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pointsPerHundred: Number(e.target.value),
                    })
                  }
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[14px] font-bold tracking-tight"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                  PTS / 100 ৳
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Delivery Success Bonus
              </label>
              <div className="relative group">
                <input
                  type="number"
                  value={settings.pointsPerOrder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      pointsPerOrder: Number(e.target.value),
                    })
                  }
                  className="w-full h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[14px] font-bold tracking-tight"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                  PTS / Order
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prestige Hierarchy */}
        <section className="space-y-10">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-black" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                Prestige Hierarchy
              </h3>
            </div>
          </div>

          <div className="space-y-16">
            {settings.tierConfig.map((tier, idx) => (
              <div key={tier.tier} className="space-y-8">
                {/* Tier Identity Header */}
                <div className="pb-2 border-b-2 border-black w-fit">
                  <p className="text-[12px] font-bold text-black uppercase tracking-[0.2em]">
                    {tier.tier}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Shared Label Baseline */}
                  <div className="lg:col-span-3 space-y-4">
                    <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block h-4">
                      Activation Points
                    </label>
                    <div className="relative group">
                      <input
                        type="number"
                        value={tier.minPoints}
                        onChange={(e) =>
                          updateTierConfig(
                            idx,
                            "minPoints",
                            Number(e.target.value),
                          )
                        }
                        className="w-full h-14 px-6 bg-[#F9F9F9] border border-gray-100 focus:border-black focus:bg-white outline-none transition-all text-[14px] font-bold"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-9 space-y-4">
                    <div className="flex items-center justify-between h-4">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                        Membership Privileges
                      </label>
                      <button
                        onClick={() => addBenefit(idx)}
                        className="p-1.5 hover:bg-black hover:text-white transition-colors border border-gray-100"
                        title="Add Privilege"
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tier.benefits.map((benefit, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-center gap-2 group"
                        >
                          <input
                            value={benefit}
                            placeholder="Define privilege..."
                            onChange={(e) =>
                              updateBenefit(idx, bIdx, e.target.value)
                            }
                            className="flex-1 h-14 px-6 bg-white border border-gray-100 focus:border-black outline-none transition-all text-[12px] font-medium"
                          />
                          <button
                            onClick={() => removeBenefit(idx, bIdx)}
                            className="p-2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {tier.benefits.length === 0 && (
                        <div className="col-span-full h-14 flex items-center px-6 border border-dashed border-gray-100">
                          <p className="text-[10px] text-zinc-300 uppercase italic tracking-widest">
                            No privileges defined for this level.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Controls */}
        <div className="pt-16 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4 text-zinc-400 max-w-md">
            <Info size={14} />
            <p className="text-[10px] font-medium uppercase tracking-widest italic">
              Registry changes take effect immediately across all synchronized
              identity records.
            </p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={updateLoyaltySettings.isPending}
            className="h-14 px-12 bg-black text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-3"
          >
            {updateLoyaltySettings.isPending ? (
              "Calibrating..."
            ) : (
              <>
                <Save size={14} />
                Confirm Matrix Calibration
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}
