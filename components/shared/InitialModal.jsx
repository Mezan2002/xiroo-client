"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";

export default function InitialModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Session-based persistence: Ensure it only shows once per browser session
    const hasBeenShown = sessionStorage.getItem("xiroo_initial_modal_shown");
    if (!hasBeenShown) {
      // 1.5s delay for a more premium, settled page load experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    sessionStorage.setItem("xiroo_initial_modal_shown", "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter Subscription:", email);
    // Transition to success state
    setIsSubscribed(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("XIROO10");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-500">
      <div 
        className="relative w-full max-w-5xl bg-white shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Architectural Close Button */}
        <button 
          onClick={closeModal}
          className="absolute top-0 right-0 z-10 p-5 bg-white text-zinc-900 border-l border-b border-zinc-100 hover:bg-zinc-900 hover:text-white transition-all duration-300 group"
          aria-label="Dismiss Welcome Modal"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Editorial Content Layer: 45/55 Split */}
        <div className="relative w-full md:w-[45%] h-72 md:h-auto overflow-hidden bg-zinc-100">
          <Image
            src="/images/luxury-modal-bg.png"
            alt="Editorial High Fashion Detail"
            fill
            className="object-cover transition-transform duration-[20s] scale-110 animate-in zoom-out-100"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
        </div>

        {/* Clean Magazine-Style Content Section */}
        <div className="relative w-full md:w-[55%] p-10 md:p-16 flex flex-col justify-center bg-white overflow-hidden min-h-[450px]">
          <div className="relative z-10 space-y-8 max-w-md mx-auto w-full">
            {!isSubscribed ? (
              /* --- SIGNUP VIEW (REVERTED TO CLEAN DESIGN) --- */
              <div className="space-y-8 animate-in fade-in-0 duration-500">
                 <div className="space-y-4">
                   <span className="inline-block text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-400">
                     Editorial Access
                   </span>
                   
                   <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-[1.1] tracking-tighter">
                     Sublime <span className="block font-light italic font-serif text-zinc-400">Elegance.</span>
                   </h2>
                 </div>
                 
                 <p className="text-zinc-500 text-[13px] font-medium leading-relaxed tracking-wide">
                   Welcome to Xiroo. Join our private collective and receive exclusive early access to new collections and **10% OFF** your first luxury order.
                 </p>

                 <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                   <div className="relative group">
                     <input
                       type="email"
                       required
                       placeholder="name@luxury-brand.com"
                       value={email}
                       onChange={(e) => setEmail(e.currentTarget.value)}
                       className="w-full py-4 border-b border-zinc-200 bg-transparent outline-hidden focus:border-zinc-900 transition-colors text-sm placeholder:text-zinc-300 placeholder:italic placeholder:font-light"
                     />
                   </div>
                   <Button 
                     type="submit"
                     className="w-full py-6 rounded-0 text-[10px] tracking-[0.4em] uppercase font-black bg-zinc-900 hover:bg-black text-white hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                   >
                     Claim Access
                   </Button>
                 </form>

                 <div className="flex items-center justify-between pt-4">
                   <span className="text-[9px] text-zinc-300 font-bold tracking-[0.1em] uppercase">No Spam. Just Style.</span>
                   <button 
                     onClick={closeModal}
                     className="text-[9px] text-zinc-400 font-bold tracking-[0.1em] uppercase hover:text-zinc-900 transition-colors cursor-pointer underline underline-offset-4 decoration-zinc-100"
                   >
                     No Thanks
                   </button>
                 </div>
              </div>
            ) : (
              /* --- SUCCESS / COUPON VIEW --- */
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                 <div className="space-y-4">
                   <div className="flex items-center gap-2">
                     <Check className="w-3 h-3 text-zinc-400" />
                     <span className="text-[10px] font-semibold tracking-[0.4em] uppercase text-zinc-900">
                       Access Granted
                     </span>
                   </div>
                   
                   <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-[1.1] tracking-tighter">
                     Welcome to <span className="block font-light italic font-serif text-zinc-400">The House.</span>
                   </h2>
                 </div>
                 
                 <p className="text-zinc-500 text-[13px] font-medium leading-relaxed tracking-wide pt-2">
                   Your exclusive journey begins now. Please use the code below during checkout for your welcome gift.
                 </p>

                 <div className="space-y-6">
                   {/* Clean Magazine-Style Coupon Display */}
                   <div className="relative flex flex-col items-center justify-center p-8 bg-white border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-md">
                      <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-zinc-300 mb-2">Checkout Code</span>
                      <h3 className="text-4xl font-extrabold tracking-[0.2em] text-zinc-900 select-all">XIROO10</h3>
                      <button 
                        onClick={copyToClipboard}
                        className="mt-6 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400 hover:text-zinc-900 transition-colors group/btn"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-zinc-900" />
                            <span>COPIED TO CLIPBOARD</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 group-hover/btn:-translate-y-0.5 transition-transform" />
                            <span>Click to Copy</span>
                          </>
                        )}
                      </button>
                   </div>

                   <Button 
                     onClick={closeModal}
                     className="w-full py-6 rounded-0 text-[10px] tracking-[0.4em] uppercase font-black bg-zinc-900 hover:bg-black text-white hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                   >
                     <ShoppingBag className="w-4 h-4" />
                     Start Shopping
                   </Button>
                 </div>

                 <p className="text-[9px] text-zinc-300 font-bold tracking-[0.1em] uppercase text-center italic">
                   Code valid for 24 hours only. No minimum purchase required.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
