import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Xiroo Admin | SaaS Control Center",
  description: "Configure and customize your storefront.",
};

export default function AdminLayout({ children }) {
  return (
    <AdminShell>
      {children}
    </AdminShell>
  );
}
