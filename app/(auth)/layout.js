import AuthLayout from "@/components/auth/AuthLayout";

export default function AuthGroupLayout({ children }) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}

