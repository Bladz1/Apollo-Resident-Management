// src/components/Header.tsx
'use client'; // Cần để sử dụng client-side logic

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-red-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo và Tiêu đề */}
        <div className="flex items-center space-x-4">
          <Image
            className="border rounded-md bg-transparent"
            src="/log1o.png" // Thay bằng đường dẫn ảnh quốc kỳ trong public/
            alt="Quốc kỳ Việt Nam"
            width={40}
            height={40}
           
          />
          <h1 className="text-xl font-bold">
            <Link href="/">Hệ thống Quản lý Dân cư và Hộ khẩu</Link>
          </h1>
        </div>

        {/* Menu và Nút Đăng nhập (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <ul className="flex  space-x-4">
              <li>
                <Link href="/" className="hover:text-blue-200">Trang chủ</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-200">Dịch vụ</Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-blue-200">Tra cứu</Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-blue-200">Hỗ trợ</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-blue-200">Tin tức</Link>
              </li>
            </ul>
          </nav>
          <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-100">
            <Link href="/login">Đăng nhập</Link>
          </button>
        </div>

        {/* Menu Hamburger (Mobile) */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-yellow-400 text-white p-2 rounded-lg space-y-2 z-10">
              <ul>
                <li>
                  <Link href="/" className="block px-4 py-2 hover:bg-blue-800" onClick={() => setIsOpen(false)}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="block px-4 py-2 hover:bg-blue-800" onClick={() => setIsOpen(false)}>
                    Dịch vụ
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="block px-4 py-2 hover:bg-blue-800" onClick={() => setIsOpen(false)}>
                    Tra cứu
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="block px-4 py-2 hover:bg-blue-800" onClick={() => setIsOpen(false)}>
                    Hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="block px-4 py-2 hover:bg-blue-800" onClick={() => setIsOpen(false)}>
                    Tin tức
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="block px-4 py-2 hover:bg-blue-800" onClick={() => setIsOpen(false)}>
                    Đăng nhập
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;