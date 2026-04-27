"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/api/useAuth";
import { useLayout } from "@/hooks/useLayout";
import { useToast } from "@/hooks/useToast";

export const useRegisterLogic = () => {
  const { updateAuthLayout } = useLayout();
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });

  useEffect(() => {
    updateAuthLayout({
      imageSrc: "/images/auth/register.png",
      heading: <>Visionary <br /><span className="italic font-bold">Experience</span></>,
      description: "Step into a world where technology becomes an art form. Your membership grants you priority access to limited edition drops.",
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
      onSuccess: () => router.push(`/verify-email?email=${encodeURIComponent(formData.email)}&mode=otp`),
      onError: (err) => toast.error(err.message || "--- Onboarding Failure ---"),
    });
  };

  return { formData, showPassword, setShowPassword, handleChange, handleSubmit, registerMutation };
};
