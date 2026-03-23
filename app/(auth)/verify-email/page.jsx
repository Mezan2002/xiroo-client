"use client";

import { Button } from "@/components/ui/Button";
import { useAuthLayout } from "@/context/AuthContext";
import { Mail, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";

function VerifyEmailContent() {
  const { updateLayout } = useAuthLayout();
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";
  const mode = searchParams.get("mode");
  const isOtp = mode === "otp";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
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
        ? "For your protection, we've issued a one-time security code. Please enter the digits below to authorize your password recovery."
        : "We've sent a secure verification link to your email. Confirming your identity is the final step to accessing the Xiroo collection.",
      badgeText: isOtp ? "Shield Protected" : "Identity Locked",
    });
  }, [updateLayout, isOtp]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus the last filled box or next one
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus forward
    if (value && index < 5) {
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
    setVerifying(true);
    const code = otp.join("");
    console.log("Verifying OTP:", code);
    
    // Simulate API call
    setTimeout(() => {
      setVerifying(false);
      router.push(`/reset-password?email=${encodeURIComponent(email)}&code=${code}`);
    }, 1500);
  };

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      alert("Verification code resent.");
    }, 2000);
  };

  return (
    <div className="text-center lg:text-left py-6 lg:py-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#FDFCFB] rounded-none flex items-center justify-center mb-8 lg:mb-10 border border-zinc-800/20 mx-auto lg:mx-0 shadow-xl shadow-zinc-800/5">
        {isOtp ? (
          <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8 text-black stroke-1" />
        ) : (
          <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-black stroke-1" />
        )}
      </div>

      <h1 className="text-[36px] lg:text-[56px] font-montserrat font-semibold tracking-tight leading-[1.1] mb-4 lg:mb-6">
        {isOtp ? (
          <>
            Verify <br />
            <span className="italic font-bold">Code</span>
          </>
        ) : (
          <>
            Check your <br />
            <span className="italic font-bold">Inbox</span>
          </>
        )}
      </h1>

      <p className="text-[10px] lg:text-[12px] text-gray-400 font-medium mb-8 lg:mb-12 leading-relaxed lg:max-w-sm uppercase tracking-widest">
        {isOtp 
          ? `We've dispatched a 6-digit security code to your email: ${email}`
          : "A verification link has been dispatched to your registered email address. Please follow the link to complete your onboarding."}
      </p>

      <form onSubmit={handleVerify} className="space-y-8 lg:space-y-12">
        {isOtp && (
          <div className="flex justify-between gap-2 lg:gap-4 max-w-sm mx-auto lg:mx-0">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-14 lg:w-14 lg:h-20 text-center text-2xl lg:text-3xl font-montserrat font-bold bg-transparent border-b-2 border-zinc-200 focus:border-black outline-none transition-all duration-300 placeholder:text-zinc-100"
                placeholder="0"
                required
              />
            ))}
          </div>
        )}

        <div className="space-y-6">
          <Button
            type="submit"
            disabled={verifying || (isOtp && otp.some(d => !d))}
            variant="primary"
            size="lg"
            className="w-full hover:bg-zinc-800 transition-all duration-500 tracking-[0.2em]"
          >
            {verifying ? "VERIFYING..." : isOtp ? "VERIFY IDENTITY" : "RESEND VERIFICATION"}
          </Button>

          {!isOtp && (
            <div className="text-center lg:text-left">
              <Link
                href="/login"
                className="text-gray-600 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-zinc-800/50 underline-offset-4 text-[12px] font-medium italic"
              >
                Confirmed? Log In
              </Link>
            </div>
          )}

          {isOtp && (
            <div className="text-center lg:text-left pt-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center justify-center lg:justify-start gap-2 mx-auto lg:mx-0 group"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
                {resending ? "Dispatched..." : "Resend Security Code"}
              </button>
            </div>
          )}
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
