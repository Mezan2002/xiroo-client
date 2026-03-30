"use client";
import React, { useEffect } from "react";
import { Shield, TrendingUp, Sparkles, Award, Zap } from "lucide-react";
import { useLoyalty } from "@/hooks/api/useLoyalty";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/api/useUser";

export default function LoyaltyPage() {
  const { toast } = useToast();
  const { user: currentUser, loading: isUserLoading } = useUser();

  // Unified Prestige & Loyalty Synchronization
  const { useLoyaltySettings } = useLoyalty();
  const { 
    data: settingsResponse, 
    isLoading: isLoyaltyLoading,
    error: loyaltyError 
  } = useLoyaltySettings();
  
  const loyaltySettings = settingsResponse?.data || settingsResponse;

  // Effect-based error reporting for the query
  useEffect(() => {
    if (loyaltyError) {
      toast.error("Failed to retrieve prestige metrics: " + loyaltyError.message);
    }
  }, [loyaltyError, toast]);

  const isLoading = isUserLoading || isLoyaltyLoading;

  if (isLoading) return <div className="py-24 text-center italic text-gray-400 animate-pulse uppercase tracking-[0.2em] font-medium">Synchronizing Prestige Status...</div>;
  if (!currentUser || !loyaltySettings) return null;

  const userData = currentUser; // Use the most fresh data from context

  const currentTier = (userData.tier || "bronze").toLowerCase();
  const currentTierConfig = loyaltySettings.tierConfig.find(t => t.tier.toLowerCase() === currentTier);

  const tierStyles = {
    bronze: "from-[#CD7F32] to-[#A0522D] shadow-[#CD7F3220]",
    silver: "from-[#909090] to-[#606060] shadow-[#90909020]",
    gold: "from-[#D4AF37] to-[#B8860B] shadow-[#D4AF3730]",
    platinum: "from-[#708090] to-[#2F4F4F] shadow-[#70809020]",
    diamond: "from-[#0A4D68] to-[#052C3E] shadow-[#0A4D6840]",
  };

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Digital Membership Card */}
      <div className={`relative overflow-hidden rounded-none p-6 sm:p-10 md:p-14 text-white shadow-2xl bg-linear-to-br ${tierStyles[currentTier]} transition-all duration-700`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 md:w-8 md:h-8 opacity-80" strokeWidth={1.5} />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-80">Prestige Registry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold tracking-tight uppercase leading-none">
              {currentTier} Member
            </h2>
            <div className="pt-2 md:pt-4 flex items-center gap-6 md:gap-8 flex-wrap">
              <div>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Accumulated Hub</p>
                <p className="text-xl md:text-2xl font-bold tracking-tighter">{userData.points || 0} PTS</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-white/20" />
              <div>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Member Since</p>
                <p className="text-xl md:text-2xl font-bold tracking-tighter">{new Date(userData.createdAt).getFullYear()}</p>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-center md:items-end gap-2 shrink-0">
             <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Award className="w-8 h-8 md:w-10 md:h-10 opacity-80" strokeWidth={1} />
             </div>
             <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-40">Identity Verified</p>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/10 rounded-full blur-2xl" />
      </div>

      {/* Prestige Privileges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        <div className="lg:col-span-4 space-y-4 md:space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-black shrink-0" />
            <h3 className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-black">Active Privileges</h3>
          </div>
          <p className="text-[12px] md:text-[13px] text-gray-500 leading-relaxed font-medium">
            Your current prestige level grants you access to an exclusive sanctuary of boutique benefits designed to elevate your Xiroo experience.
          </p>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {currentTierConfig?.benefits?.map((benefit, idx) => (
            <div key={idx} className="p-4 md:p-6 border border-gray-100 bg-gray-50 flex items-center gap-4 group hover:bg-black hover:text-white transition-all duration-500">
               <div className="w-2 h-2 rounded-full bg-zinc-300 group-hover:bg-zinc-700 transition-colors shrink-0" />
               <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest">{benefit}</span>
            </div>
          ))}
          {(!currentTierConfig?.benefits || currentTierConfig.benefits.length === 0) && (
            <div className="col-span-full py-10 md:py-12 border border-dashed border-gray-200 text-center">
              <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest italic">No specific privileges gained yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Prestige Evolution (Timeline) */}
      <div className="space-y-8 md:space-y-12">
        <div className="flex items-center gap-3 pb-6 md:pb-8 border-b border-gray-100">
           <TrendingUp className="w-5 h-5 text-black shrink-0" />
           <h3 className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-black">Prestige Evolution</h3>
        </div>

        <div className="relative space-y-10 md:space-y-20 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
          {loyaltySettings.tierConfig.map((tier, idx) => {
            const isReached = userData.points >= tier.minPoints;
            const isCurrent = currentTier === tier.tier.toLowerCase();

            return (
              <div key={tier.tier} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group select-none">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-xl z-20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-700 ${isReached ? "bg-black text-white" : "bg-gray-100 text-gray-300"}`}>
                  {isReached ? <Zap size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>

                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 sm:p-6 md:p-8 border border-gray-100 bg-white transition-all duration-500 group-hover:bg-[#FAFAFA]">
                  <div className="flex items-center justify-between gap-2 mb-3 md:mb-4 flex-wrap">
                     <time className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{tier.minPoints}+ points</time>
                     {isCurrent && (
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100">Current</span>
                     )}
                  </div>
                  <h4 className="text-lg md:text-xl font-montserrat font-bold text-black uppercase tracking-tight mb-3 md:mb-4">{tier.tier}</h4>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {tier.benefits.map((benefit, bIdx) => (
                      <span key={bIdx} className="text-[8px] md:text-[9px] font-bold tracking-widest px-2 py-1 bg-gray-50 text-gray-400 border border-gray-100 italic">{benefit}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
