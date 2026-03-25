"use client";

import { Button } from "@/components/ui/Button";
import { useAuthLayout } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { apiRequest } from "@/lib/api";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { updateLayout } = useAuthLayout();
  const { forgotPasswordMutation } = useUser();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    updateLayout({
      imageSrc: "/images/auth/forgot.png",
      heading: (
        <>
          Personal <br />
          <span className="italic font-bold">Assistance</span>
        </>
      ),
      description:
        "Our dedicated concierge team is standing by to ensure your boutique experience remains uninterrupted and secure.",
      badgeText: "Support & Care",
    });
  }, [updateLayout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPasswordMutation.mutate({ email }, {
      onSuccess: () => {
        router.push(`/verify-email?email=${encodeURIComponent(email)}&mode=reset`);
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
              Recover <br />
              <span className="italic font-bold">Access</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold max-w-xs mx-auto lg:mx-0 uppercase tracking-[0.3em] leading-relaxed">
              Enter your email to receive an exclusive recovery link.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-2 group">
              <label className={`text-[9px] font-semibold uppercase tracking-[0.2em] transition-colors ${email ? 'text-zinc-800' : 'text-gray-400 group-focus-within:text-zinc-800'}`}>
                Email Identity
              </label>
              <div className="relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${email ? 'text-zinc-800' : 'text-gray-300 group-focus-within:text-zinc-800'}`}>
                  <Mail className="w-4 h-4 stroke-[1.5]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-8 pr-4 py-4 bg-transparent border-b outline-none text-[15px] font-medium transition-all duration-300 placeholder:text-gray-300 ${email ? 'border-zinc-800' : 'border-gray-200 focus:border-zinc-800'}`}
                  placeholder="fashion@xiroo.com"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={forgotPasswordMutation.isPending}
              className="w-full hover:bg-zinc-800 transition-all duration-500 tracking-[0.2em]"
            >
              {forgotPasswordMutation.isPending ? "DISPATCHING..." : "SEND RESET LINK"}
            </Button>
          </form>

          <div className="mt-12 text-center lg:text-left pt-8 border-t border-gray-50">
            <p className="text-[12px] font-medium text-gray-400">
              Know your password?{" "}
              <Link
                href="/login"
                className="text-gray-600 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-zinc-800/50 underline-offset-4 ml-1"
              >
                Go to Identity
              </Link>
            </p>
          </div>
        </>
      ) : (
        <div className="text-center lg:text-left py-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          <div className="w-20 h-20 bg-[#FDFCFB] rounded-none flex items-center justify-center mb-10 border border-zinc-800/20 mx-auto lg:mx-0 shadow-xl shadow-zinc-800/5">
            <Mail className="w-8 h-8 text-black stroke-1" />
          </div>
          <h2 className="text-[44px] lg:text-[56px] font-montserrat font-semibold tracking-tight leading-[1.1] mb-6">
            Link <br />
            <span className="italic font-bold">Sent.</span>
          </h2>
          <p className="text-[12px] text-gray-400 font-medium mb-12 leading-relaxed lg:max-w-xs uppercase tracking-widest">
            We&apos;ve sent an exclusive recovery link to <br />
            <span className="text-black font-bold border-b border-zinc-800/50 text-[14px] mt-2 block italic">
              {email}
            </span>
          </p>
          <Link
            href="/login"
            className="text-gray-600 hover:text-black transition-colors underline decoration-gray-300 hover:decoration-zinc-800/50 underline-offset-4 text-[12px] font-medium italic"
          >
            ← Back to Login
          </Link>
        </div>
      )}
    </>
  );
}
