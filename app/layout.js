import { Montserrat, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Xiroo",
  description: "Xiroo Shop",
  icons: {
    icon: "/favicon.png",
  },
};

import ConditionalLayout from "@/components/shared/ConditionalLayout";
import { ToastProvider } from "@/context/ToastContext";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import QueryProvider from "@/components/providers/QueryProvider";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen selection:bg-black selection:text-white">
        <ToastProvider>
          <ReduxProvider>
            <QueryProvider>
              <UserProvider>
                <CartProvider>
                  <WishlistProvider>
                    <ConditionalLayout>{children}</ConditionalLayout>
                  </WishlistProvider>
                </CartProvider>
              </UserProvider>
            </QueryProvider>
          </ReduxProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
