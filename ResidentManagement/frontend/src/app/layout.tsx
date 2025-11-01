import type { Metadata } from "next";
import { DM_Serif_Text, Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/header/header";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Hệ thống Quản lý Dân cư",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="bg-slate-950">
      <body className={`${inter.variable} ${dmSerifText.variable}`}>
        <Header />
        <main>{children}</main>
        <footer className="bg-slate-950/90 text-slate-200 text-center text-sm tracking-wide border-t border-white/10 py-6">
          <p className="font-medium">&copy; 2025 Hệ thống Quản lý Dân cư. Hotline: 1800 1096</p>
        </footer>
      </body>
    </html>
  );
}