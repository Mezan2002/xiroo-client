"use client";

import { Button } from "@/components/ui/Button";
import { useAuthLayout } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Mail, RefreshCw, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

function VerifyEmailContent() {
  const { updateLayout } = useAuthLayout();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyOtpMutation, resendOtpMutation } = useUser();
  const { toast } = useToast();
  const email = searchParams.get("email") || "your email";
  const mode = searchParams.get("mode");
  const isOtp = mode === "otp";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    updateLayout({
      imageSrc: isOtp ? "/images/auth/forgot.png" : "/images/auth/verify.png",
      heading: isOtp ? (
        <>
          Security <br />
          <span className="italic font-bold">Verification</span>
        </>
      ) : (
        <>
          Secure your <br />
          <span className="italic font-bold">Identity</span>
        </>
      ),
      description: isOtp 
        ? "For your protection, we've issued a one-time security code. Please enter the digits below to authorize your account activation."
        : "Confirming your identity is the final step to accessing the Xiroo collection. Please check your inbox for the security code.",
      badgeText: isOtp ? "Shield Protected" : "Identity Locked",
    });
  }, [updateLayout, isOtp]);

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/[^0-9]/g, "")
      .slice(0, 6)
      .split("");
      
    if (pastedData.length > 0) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 10);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const actualValue = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = actualValue;
    setOtp(newOtp);

    if (actualValue && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join("");
    
    verifyOtpMutation.mutate({ email, otp: code, type: isOtp ? undefined : "recovery" }, {
      onSuccess: () => {
        toast.success(isOtp ? "Identity Verified Successfully." : "Recovery Signature Validated.");
        setTimeout(() => {
          const redirect = searchParams.get("redirect");
          const redirectSuffix = redirect ? `&redirect=${redirect}` : "";
          if (isOtp) {
            router.push(`/login?verified=true${redirectSuffix}`);
          } else {
            router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${code}${redirectSuffix}`);
          }
        }, 2000);
      },
      onError: (err) => {
        toast.error(err.message || "Verification Failure: Invalid OTP Signature");
      },
    });
  };

  const handleResend = () => {
    resendOtpMutation.mutate({ email });
  };

  return (
    <div className="text-center lg:text-left py-6 lg:py-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FDFCFB] rounded-none flex items-center justify-center mb-8 lg:mb-10 border border-zinc-800/20 mx-auto lg:mx-0 shadow-xl shadow-zinc-800/5">
        <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-black stroke-1" />
      </div>

      <h1 className="text-[36px] lg:text-[56px] font-montserrat font-semibold tracking-tight leading-[1.1] mb-4 lg:mb-6">
        Verify <br />
        <span className="italic font-bold">Code</span>
      </h1>

      <p className="text-[10px] lg:text-[12px] text-gray-400 font-medium mb-8 lg:mb-12 leading-relaxed lg:max-w-sm uppercase tracking-widest">
        We&apos;ve dispatched a 6-digit security code to your email: <br/>
        <span className="text-black font-bold border-b border-black">{email}</span>
      </p>

      <form onSubmit={handleVerify} className="space-y-8 lg:space-y-12">
        <div className="flex justify-between gap-2 lg:gap-4 max-w-sm mx-auto lg:mx-0">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-14 lg:w-14 lg:h-20 text-center text-2xl lg:text-3xl font-montserrat font-bold bg-transparent border-b-2 border-zinc-200 focus:border-black outline-none transition-all duration-300 placeholder:text-zinc-100"
              placeholder="0"
              required
            />
          ))}
        </div>

        <div className="space-y-6">
          <Button
            type="submit"
            disabled={verifyOtpMutation.isPending || otp.some(d => !d)}
            variant="primary"
            size="lg"
            className="w-full hover:bg-zinc-800 transition-all duration-500 tracking-[0.2em]"
          >
            {verifyOtpMutation.isPending ? "VERIFYING IDENTITY..." : "VERIFY IDENTITY"}
          </Button>

          <div className="text-center lg:text-left pt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendOtpMutation.isPending}
              className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center justify-center lg:justify-start gap-2 mx-auto lg:mx-0 group"
            >
              <RefreshCw className={`w-3 h-3 ${resendOtpMutation.isPending ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
              {resendOtpMutation.isPending ? "Dispatching..." : "Resend Security Code"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-zinc-200" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
