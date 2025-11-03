import {
  Inter,
  Be_Vietnam_Pro,
  Nunito_Sans,
  Public_Sans,
  Quicksand,
  Manrope,
  IBM_Plex_Sans,
} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  variable: '--font-bevietnam',
  weight: ['400', '600', '700'],
});
const nunito = Nunito_Sans({
  subsets: ['vietnamese'],
  variable: '--font-nunito',
  weight: ['400', '600', '700'],
});
const publicSans = Public_Sans({
  subsets: ['vietnamese'],
  variable: '--font-public',
  weight: ['400', '600', '700'],
});
const quicksand = Quicksand({
  subsets: ['vietnamese'],
  variable: '--font-quicksand',
  weight: ['400', '600'],
});
const manrope = Manrope({
  subsets: ['vietnamese'],
  variable: '--font-manrope',
  weight: ['400', '600', '700'],
});
const ibmPlex = IBM_Plex_Sans({
  subsets: ['vietnamese'],
  variable: '--font-plex',
  weight: ['400', '600'],
});

import Header from '@/components/header/header';
import FontSwitcher from '@/components/ui/FontSwitcher';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${inter.variable} ${beVietnam.variable} ${nunito.variable} ${publicSans.variable} ${quicksand.variable} ${manrope.variable} ${ibmPlex.variable} font-combo-1`}
      >
        <Header />
        <main>{children}</main>
        <FontSwitcher />
        <footer className="bg-gray-800 p-4 text-center text-white">
          <p>&copy; 2025 Hệ thống Quản lý Dân cư. Hotline: 1800 1096</p>
        </footer>
      </body>
    </html>
  );
}
