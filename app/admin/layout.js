import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Xiroo Admin | SaaS Control Center",
  description: "Configure and customize your storefront.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white text-[#37352F] font-montserrat antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-5 lg:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
