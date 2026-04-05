"use client";

import { usePathname } from "next/navigation";
import BottomNavbar from "./BottomNavbar";
import Footer from "./Footer";
import { Navbar } from "./Navbar";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Define routes that should NOT have the global header/footer
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/verify-email",
    "/reset-password",
  ];
  const isAuthRoute = authRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAuthRoute || isAdminRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow pb-24 lg:pb-0">{children}</main>
      <Footer />
      {/* <ChatBubble /> */}
      <BottomNavbar />
    </div>
  );
}
