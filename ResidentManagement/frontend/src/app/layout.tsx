import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import './globals.css';

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
import TokenRefreshProvider from '@/components/auth/TokenRefreshProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${beVietnamPro.variable} antialiased`}>
        <TokenRefreshProvider />
        <Header />
        <main>
          {children}
        </main>
        <footer className="bg-gray-800 p-4 text-center text-xs text-white sm:text-sm">
          <p>&copy; 2025 Hệ thống Quản lý Dân cư. Hotline: 1800 1096</p>
        </footer>
      </body>
    </html>
  );
}
