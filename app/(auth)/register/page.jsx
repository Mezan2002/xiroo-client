"use client";

import SocialAuthButton from "@/components/auth/SocialAuthButton";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/api/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function RegisterForm() {
  const { updateAuthLayout } = useLayout();
  const searchParams = useSearchParams();
  const { registerMutation } = useAuth();

  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    updateAuthLayout({
      imageSrc: "/images/auth/register.png",
      heading: (
        <>
          Visionary <br />
          <span className="italic font-bold">Experience</span>
        </>
      ),
      description:
        "Step into a world where technology becomes an art form. Your membership grants you priority access to limited edition drops.",
      badgeText: "Elite Access",
    });
  }, [updateAuthLayout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    registerMutation.mutate(formData, {
      onSuccess: () => {
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}&mode=otp`,
        );
      },
      onError: (err) => {
        toast.error(err.message || "--- Onboarding Failure ---");
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
          Join the <br />
          <span className="italic font-bold">Collection</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-4">
          Become part of our elite circle
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2 group">
            <label
              className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${formData.firstName ? "text-zinc-800" : "text-gray-400 group-focus-within:text-zinc-800"}`}
            >
              First Name
            </label>
            <div className="relative">
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${formData.firstName ? "text-zinc-800" : "text-gray-300 group-focus-within:text-zinc-800"}`}
              >
                <UserIcon className="w-3.5 h-3.5 stroke-[1.5]" />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full pl-8 pr-4 py-4 bg-transparent border-b outline-none text-[14px] transition-all placeholder:text-gray-300 ${formData.firstName ? "border-zinc-800" : "border-gray-200 focus:border-zinc-800"}`}
                placeholder="John"
                required
              />
            </div>
          </div>
          <div className="space-y-2 group">
            <label
              className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${formData.lastName ? "text-zinc-800" : "text-gray-400 group-focus-within:text-zinc-800"}`}
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-0 py-4 bg-transparent border-b outline-none text-[14px] transition-all placeholder:text-gray-300 ${formData.lastName ? "border-zinc-800" : "border-gray-200 focus:border-zinc-800"}`}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label
            className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${formData.email ? "text-zinc-800" : "text-gray-400 group-focus-within:text-zinc-800"}`}
          >
            Email Identity
          </label>
          <div className="relative">
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${formData.email ? "text-zinc-800" : "text-gray-300 group-focus-within:text-zinc-800"}`}
            >
              <Mail className="w-4 h-4 stroke-[1.5]" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-300 placeholder:text-gray-300 ${formData.email ? "border-zinc-800" : "border-gray-200 focus:border-zinc-800"}`}
              placeholder="fashion@xiroo.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <label
            className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${formData.password ? "text-zinc-800" : "text-gray-400 group-focus-within:text-zinc-800"}`}
          >
            Security Secret
          </label>
          <div className="relative">
            <div
              className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${formData.password ? "text-zinc-800" : "text-gray-300 group-focus-within:text-zinc-800"}`}
            >
              <Lock className="w-4 h-4 stroke-[1.5]" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-8 pr-12 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-300 placeholder:text-gray-300 ${formData.password ? "border-zinc-800" : "border-gray-200 focus:border-zinc-800"}`}
              placeholder="Create Password"
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

        <div className="flex items-start gap-4 py-2">
          <div className="relative flex items-center h-5">
            <input
              type="checkbox"
              className="w-4 h-4 border-gray-300 rounded-none focus:ring-black accent-black transition-all"
              required
            />
          </div>
          <label
            htmlFor="terms"
            className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-widest"
          >
            Confirming agreement to the{" "}
            <span className="text-black font-bold border-b border-black hover:text-zinc-800 hover:border-zinc-800 transition-colors cursor-pointer">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-black font-bold border-b border-black hover:text-zinc-800 hover:border-zinc-800 transition-colors cursor-pointer">
              Privacy
            </span>
            .
          </label>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={registerMutation.isPending}
            className="w-full hover:bg-zinc-800 transition-all duration-500 tracking-[0.2em]"
          >
            {registerMutation.isPending ? "INITIALIZING..." : "CREATE IDENTITY"}
          </Button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
            <span className="bg-white px-4 text-gray-300">or join via</span>
          </div>
        </div>

        <SocialAuthButton
          text="REGISTER WITH GOOGLE"
          onClick={handleGoogleLogin}
        />

        <div className="pt-8 text-center border-t border-gray-50 mt-8">
          <p className="text-[12px] font-medium text-gray-400">
            Already an elite member?{" "}
            <Link
              href="/login"
              className="text-gray-600 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-zinc-800/50 underline-offset-4 ml-1"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-gray-400 text-sm">
          Initializing Registry...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
