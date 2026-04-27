"use client";
import { User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoggedOutLayout({ handleLoginRedirect, handleRegisterRedirect }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-12 text-center py-24 bg-white h-full">
      <div className="w-20 h-20 rounded-full border border-gray-100 flex items-center justify-center mb-10 bg-gray-50">
        <User className="w-[30px] h-[30px] text-gray-300 stroke-1" />
      </div>

      <h2 className="text-[24px] font-bold tracking-tighter leading-none uppercase mb-6 text-black">
        Join The Collection
      </h2>

      <p className="text-[11px] text-gray-400 leading-relaxed mb-12 uppercase tracking-[0.2em] font-medium text-center max-w-xs mx-auto">
        Sync your shopping experience across all devices. Save wishlists, track orders, and get faster checkout.
      </p>

      <div className="w-full space-y-4 max-w-[320px]">
        <Button
          onClick={handleLoginRedirect}
          variant="primary"
          size="lg"
          className="w-full bg-black text-white hover:bg-gray-800 border-none h-[56px] text-xs tracking-[0.2em] font-bold"
        >
          SIGN IN
        </Button>
        <Button
          onClick={handleRegisterRedirect}
          variant="outline"
          size="lg"
          className="w-full border-black bg-transparent text-black! hover:bg-black! hover:text-white! h-[56px] text-xs tracking-[0.2em] font-bold uppercase transition-colors"
        >
          CREATE ACCOUNT
        </Button>
      </div>
    </div>
  );
}
