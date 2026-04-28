"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

const BottomNavbar = dynamic(() => import("./BottomNavbar"));
const Footer = dynamic(() => import("./Footer"));
const Newsletter = dynamic(() => import("./Newsletter"));

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
      <Newsletter />
      <Footer />
      {/* <ChatBubble /> */}
      <BottomNavbar />
      {/* <InitialModal /> */}
    </div>
  );
}

