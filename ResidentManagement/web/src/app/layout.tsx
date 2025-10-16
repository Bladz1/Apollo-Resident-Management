import type { Metadata } from 'next';
import {Inter, DM_Serif_Text} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['greek'],
})
const dmSerifText = DM_Serif_Text({
  subsets: ['latin'],
  weight: ['400'],
})
 
// src/app/layout.tsx
import Header from '@/components/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={dmSerifText.className}>
        <Header />
        <main>{children}
          
        </main>
        <footer className="bg-gray-800 text-white text-center p-4 mt-4">
          <p>&copy; 2025 Hệ thống Quản lý Dân cư. Hotline: 18001096</p>
        </footer>
      </body>
    </html>
  );
}