import { JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

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

import AppInitializer from "@/components/AppInitializer";
import QueryProvider from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import ConditionalLayout from "@/components/shared/ConditionalLayout";
import RouteGuard from "@/components/shared/RouteGuard";
import { SocketProvider } from "@/context/SocketContext";
import dynamic from "next/dynamic";

const ToastContainer = dynamic(
  () => import("@/components/shared/ToastContainer"),
);

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen selection:bg-black selection:text-white">
        <ReduxProvider>
          <QueryProvider>
            <SocketProvider>
              <AppInitializer>
                <RouteGuard>
                  <ConditionalLayout>{children}</ConditionalLayout>
                </RouteGuard>
                <ToastContainer />
              </AppInitializer>
            </SocketProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
