import { Be_Vietnam_Pro, Nunito_Sans, Roboto } from 'next/font/google';
import './globals.css';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-primary',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-secondary',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-secondary-alt',
  display: 'swap',
});

// src/app/layout.tsx
import Header from '@/components/header/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${nunitoSans.variable} ${roboto.variable} ${beVietnamPro.variable}`}>
        <Header />
        <main>{children}

        </main>
        <footer className="bg-gray-800 text-white text-center p-4">
          <p>&copy; 2025 Hệ thống Quản lý Dân cư. Hotline: 1800 1096</p>
        </footer>
      </body>
    </html>
  );
}
