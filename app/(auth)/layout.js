"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import { AuthProvider } from "@/context/AuthContext";

export default function AuthGroupLayout({ children }) {
  return (
    <AuthProvider>
      <AuthLayout>
        {children}
      </AuthLayout>
    </AuthProvider>
  );
}
