"use client";

import { Button } from "@/components/ui/Button";
import { useAuthLayout } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const { updateLayout } = useAuthLayout();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updateLayout({
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
  }, [updateLayout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      {!submitted ? (
        <>
          {/* Heading Section */}
          <div className="mb-14 text-center lg:text-left">
            <h1 className="text-[44px] lg:text-[56px] font-playfair font-medium leading-[1.1] mb-4 tracking-tight">
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
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-zinc-800 transition-colors">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-zinc-800 transition-colors">
                  <Lock className="w-4 h-4 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-12 py-4 bg-transparent border-b border-gray-200 focus:border-zinc-800 outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300"
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
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-zinc-800 transition-colors">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-zinc-800 transition-colors">
                  <Lock className="w-4 h-4 stroke-[1.5]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-8 pr-12 py-4 bg-transparent border-b border-gray-200 focus:border-zinc-800 outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300"
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
                className="w-full hover:bg-zinc-800 transition-all duration-500 tracking-[0.2em]"
              >
                UPDATE PASSWORD
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center lg:text-left py-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="w-20 h-20 bg-[#FDFCFB] rounded-none flex items-center justify-center mb-10 border border-zinc-800/20 mx-auto lg:mx-0 shadow-xl shadow-zinc-800/5">
            <ShieldCheck className="w-8 h-8 text-black stroke-1" />
          </div>
          <h2 className="text-[44px] lg:text-[56px] font-playfair font-medium tracking-tight leading-[1.1] mb-6">
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
