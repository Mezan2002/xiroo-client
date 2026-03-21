import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen selection:bg-black selection:text-white">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
