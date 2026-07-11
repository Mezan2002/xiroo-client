import { JetBrains_Mono, Libre_Barcode_39, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const barcodeFont = Libre_Barcode_39({
  variable: "--font-barcode",
  subsets: ["latin"],
  weight: "400",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "XIROO | HOME",
  description: "XIROO SHOP. LIVE YOUR DREAM!",
  icons: {
    icon: "/favicon.png",
  },
};

import AppInitializer from "@/components/AppInitializer";
import FacebookPixel from "@/components/Marketing/FacebookPixel";
import QueryProvider from "@/components/providers/QueryProvider";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import ConditionalLayout from "@/components/shared/ConditionalLayout";
import RouteGuard from "@/components/shared/RouteGuard";
import { SocketProvider } from "@/context/SocketContext";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ToastContainer = dynamic(
  () => import("@/components/shared/ToastContainer"),
);

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${mono.variable} ${barcodeFont.variable} antialiased overflow-x-hidden`}
    >
      <body className="min-h-screen selection:bg-black selection:text-white overflow-x-hidden">
        <ReduxProvider>
          <QueryProvider>
            <SocketProvider>
              <AppInitializer>
                <Suspense fallback={null}>
                  <FacebookPixel />
                </Suspense>
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
