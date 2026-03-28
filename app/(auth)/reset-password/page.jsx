"use client";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLayout } from "@/hooks/useLayout";
import { useAuth } from "@/hooks/api/useAuth";
import { useEffect, useState, Suspense } from "react";


function ResetPasswordContent() {
  const { updateAuthLayout } = useLayout();


  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPasswordMutation } = useAuth();
  
  const email = searchParams.get("email");
  const otp = searchParams.get("code");

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    updateAuthLayout({
      imageSrc: "/images/auth/reset.png",
      heading: (
        <>
          New <br />
          <span className="italic font-bold">Beginnings</span>
        </>
      ),
      description:
        "Create a new secure gateway to your Xiroo account. We recommend a complex combination of characters for maximum prestige and security.",
      badgeText: "Security Protocol",
    });
  }, [updateAuthLayout]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Security Mismatch: Passwords do not match.");
      return;
    }
    
    resetPasswordMutation.mutate({ email, otp, newPassword: password }, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  return (
    <>
      {!submitted ? (
        <>
          {/* Heading Section */}
          <div className="mb-14 text-center lg:text-left">
            <h1 className="text-[44px] lg:text-[56px] font-montserrat font-semibold leading-[1.1] mb-4 tracking-tight">
              Reset <br />
              <span className="italic font-bold">Secret</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold max-w-xs mx-auto lg:mx-0 uppercase tracking-[0.3em] leading-relaxed">
              Define your new security credential.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Password Field */}
            <div className="space-y-2 group">
              <label className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${password ? 'text-zinc-800' : 'text-gray-400 group-focus-within:text-zinc-800'}`}>
                New Password
              </label>
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${password ? 'text-zinc-800' : 'text-gray-300 group-focus-within:text-zinc-800'}`}>
                  <Lock className="w-4 h-4 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-8 pr-12 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300 ${password ? 'border-zinc-800' : 'border-gray-200 focus:border-zinc-800'}`}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  showHoverIcon={false}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-zinc-800 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2 group">
              <label className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${confirmPassword ? 'text-zinc-800' : 'text-gray-400 group-focus-within:text-zinc-800'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${confirmPassword ? 'text-zinc-800' : 'text-gray-300 group-focus-within:text-zinc-800'}`}>
                  <Lock className="w-4 h-4 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-8 pr-12 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300 ${confirmPassword ? 'border-zinc-800' : 'border-gray-200 focus:border-zinc-800'}`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={resetPasswordMutation.isPending}
                className="w-full hover:bg-zinc-800 transition-all duration-500 tracking-[0.2em]"
              >
                {resetPasswordMutation.isPending ? "CONFIGURING..." : "UPDATE CREDENTIALS"}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center lg:text-left py-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="w-20 h-20 bg-[#FDFCFB] rounded-none flex items-center justify-center mb-10 border border-zinc-800/20 mx-auto lg:mx-0 shadow-xl shadow-zinc-800/5">
            <ShieldCheck className="w-8 h-8 text-black stroke-1" />
          </div>
          <h2 className="text-[44px] lg:text-[56px] font-montserrat font-semibold tracking-tight leading-[1.1] mb-6">
            Password <br />
            <span className="italic font-bold">Secured.</span>
          </h2>
          <p className="text-[12px] text-gray-400 font-medium mb-12 leading-relaxed lg:max-w-xs uppercase tracking-widest">
            Your credentials have been successfully updated. You may now log in
            with your new secret.
          </p>
          <Link
            href="/login"
            className="text-gray-600 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-zinc-800/50 underline-offset-4 text-[12px] font-medium italic"
          >
            ← Proceed to Log In
          </Link>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-800 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
