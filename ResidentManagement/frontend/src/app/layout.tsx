import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import './globals.css';
import "@/components/heart_beat/heart_beat"

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

// src/app/layout.tsx
import Header from '@/components/header/header';
import HeartBeat from '@/components/heart_beat/heart_beat';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${beVietnamPro.variable} antialiased`}>
        <Header />
        <HeartBeat></HeartBeat>
        <main>{children}

        </main>
        <footer className="bg-gray-800 text-white text-center p-4">
          <p>&copy; 2025 Hệ thống Quản lý Dân cư. Hotline: 1800 1096</p>
        </footer>
      </body>
    </html>
  );
}
