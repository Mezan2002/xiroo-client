"use client";

import SocialAuthButton from "@/components/auth/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { useLayout } from "@/hooks/useLayout";
import { useAuth } from "@/hooks/api/useAuth";
import { useUser } from "@/hooks/api/useUser";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function LoginForm() {
  const { updateAuthLayout } = useLayout();


  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useUser();
  const { loginMutation } = useAuth();

  const { toast } = useToast();
  const router = useRouter();
  
  // High-Performance Redirect for Authenticated Protocol
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirect = searchParams.get("redirect");
      router.replace(redirect ? decodeURIComponent(redirect) : "/");
    }
  }, [isAuthenticated, user, router, searchParams]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    updateAuthLayout({
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
  }, [updateAuthLayout]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate(formData, {
      onSuccess: () => {
        const redirect = searchParams.get("redirect");
        router.push(redirect ? decodeURIComponent(redirect) : "/");
      },
      onError: (err) => {
        if (err.code === "VERIFICATION_REQUIRED") {
          toast.info("Security Verification Pending. Please Check Your Email.");
          router.push(`/verify-email?email=${encodeURIComponent(formData.email)}&mode=otp`);
        } else {
          toast.error(err.message || "--- Identification Failure ---");
        }
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <>
      <div className="mb-14 text-center lg:text-left">
        <h1 className="text-[44px] lg:text-[56px] font-montserrat font-semibold leading-[1.1] mb-2 tracking-tight">
          Welcome <br />
          <span className="italic font-bold">Back</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-4">
          Enter your identity to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2 group">
          <label className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${formData.email ? 'text-zinc-800' : 'text-gray-400 group-focus-within:text-zinc-800'}`}>
            Email
          </label>
          <div className="relative">
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${formData.email ? 'text-zinc-800' : 'text-gray-300 group-focus-within:text-zinc-800'}`}>
              <Mail className="w-4 h-4 stroke-[1.5]" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300 ${formData.email ? 'border-zinc-800' : 'border-gray-200 focus:border-zinc-800'}`}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <div className="flex justify-between items-center">
            <label className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${formData.password ? 'text-zinc-800' : 'text-gray-400 group-focus-within:text-zinc-800'}`}>
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
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${formData.password ? 'text-zinc-800' : 'text-gray-300 group-focus-within:text-zinc-800'}`}>
              <Lock className="w-4 h-4 stroke-[1.5]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-8 pr-12 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-500 placeholder:text-gray-300 ${formData.password ? 'border-zinc-800' : 'border-gray-200 focus:border-zinc-800'}`}
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
            disabled={loginMutation.isPending}
            className="w-full hover:bg-zinc-800 transition-all duration-500"
          >
            {loginMutation.isPending ? "IDENTIFYING..." : "SIGN IN"}
          </Button>
        </div>

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

        <SocialAuthButton onClick={handleGoogleLogin} />

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400 text-sm">Authenticating...</div>}>
      <LoginForm />
    </Suspense>
  );
}
