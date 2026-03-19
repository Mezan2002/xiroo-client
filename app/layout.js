import Footer from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Xiroo",
  description: "Xiroo Shop",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} antialiased`}>
      <body className="flex flex-col min-h-screen selection:bg-black selection:text-white">
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
