"use client";

import SocialAuthButton from "@/components/auth/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { useAuthLayout } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { updateLayout } = useAuthLayout();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    updateLayout({
      imageSrc: "/images/auth/login.png",
      heading: (
        <>
          Welcome <br />
          <span className="italic font-bold">Back</span>
        </>
      ),
      description:
        "Xiroo redefines your living space by merging high-performance electronic precision with professional-grade culinary mastery.",
      badgeText: "Limited Edition",
    });
  }, [updateLayout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  return (
    <>
      {/* Heading Section */}
      <div className="mb-14 text-center lg:text-left">
        <h1 className="text-[44px] lg:text-[56px] font-playfair font-medium leading-[1.1] mb-2 tracking-tight">
          Welcome <br />
          <span className="italic font-bold">Back</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-4">
          Enter your identity to continue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Field */}
        <div className="space-y-2 group">
          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-zinc-800 transition-colors duration-300">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-zinc-800 transition-colors">
              <Mail className="w-4 h-4 stroke-[1.5]" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-8 pr-4 py-4 bg-transparent border-b border-gray-200 focus:border-zinc-800 outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-zinc-800 transition-colors duration-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-black transition-colors underline decoration-gray-400/30 hover:decoration-zinc-800/50 underline-offset-4"
            >
              Forgot?
            </Link>
          </div>
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
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-zinc-800 transition-colors z-20"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full hover:bg-zinc-800 transition-all duration-500"
          >
            SIGN IN
          </Button>
        </div>

        {/* Social Login Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-white px-4 text-gray-300">
              or continue with
            </span>
          </div>
        </div>

        {/* Social Button */}
        <SocialAuthButton />

        {/* Footer Links */}
        <div className="pt-10 text-center">
          <p className="text-[12px] font-medium text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-gray-600 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-zinc-800/50 underline-offset-4 ml-1"
            >
              Join Now
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
