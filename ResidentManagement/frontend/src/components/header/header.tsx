'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SupportButton from '@/components/header/support_button';
import {
  AUTH_CHANGE_EVENT,
  AuthChangeDetail,
  clearAuth,
  loadAuth,
  loadUsername,
} from '../../utils/auth-storage';

type HeaderAuthState = {
  isAuthenticated: boolean;
  username: string | null;
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState<HeaderAuthState>({ isAuthenticated: false, username: null });

  useEffect(() => {
    const updateState = (hasToken: boolean, usernameCandidate: string | null) => {
      const normalized = usernameCandidate?.trim() ?? null;
      setAuthState({
        isAuthenticated: hasToken,
        username: normalized && normalized.length > 0 ? normalized : null,
      });
    };

    const syncAuthState = (detail?: AuthChangeDetail | null) => {
      if (detail) {
        if (detail.token) {
          const fallbackUsername = detail.username ?? loadUsername();
          updateState(true, fallbackUsername ?? null);
        } else {
          updateState(false, null);
        }
        return;
      }

      const stored = loadAuth();

      if (stored) {
        const fallback = loadUsername();
        updateState(true, stored.username || fallback || null);
      } else {
        updateState(false, null);
      }
    };

    syncAuthState();

    const handleStorage = () => {
      syncAuthState();
    };

    const handleAuthChanged = (event: Event) => {
      const customEvent = event as CustomEvent<AuthChangeDetail>;
      syncAuthState(customEvent.detail ?? null);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChanged as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChanged as EventListener);
    };
  }, []);

  const isAuthenticated = authState.isAuthenticated;
  const displayName = authState.username ?? 'Người dùng';

  const handleLogout = () => {
    clearAuth();
    setAuthState({ isAuthenticated: false, username: null });
    setIsOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-red-800 via-red-950 to-red-800 text-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        {/* Logo và Tiêu đề */}
        <div className="flex min-w-0 items-center gap-3">
          <Image
            className="rounded-md bg-transparent"
            src="/images/logo.png" // Thay bằng đường dẫn ảnh quốc kỳ trong public/
            alt="Quốc kỳ Việt Nam"
            width={40}
            height={40}

          />
          <h1 className="text-sm font-semibold leading-tight text-balance sm:text-base md:text-lg">
            <Link href="/">Hệ thống Quản lý Dân cư và Hộ khẩu</Link>
          </h1>
        </div>

        {/* Menu và Nút Đăng nhập (Desktop) */}
        <div className="hidden items-center gap-6 md:flex">
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/" className="hover:text-yellow-200">Trang chủ</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-yellow-200">Dịch vụ</Link>
              </li>
              
              <li>
                <SupportButton></SupportButton>
              </li> 
              <li>
                <Link href="/news" className="hover:text-yellow-200">Tin tức</Link>
              </li>
            </ul>
          </nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-yellow-200">Xin chào, {displayName}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-yellow-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500/20"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-100">
              <Link href="/login">Đăng nhập</Link>
            </button>
          )}
        </div>

        {/* Menu Hamburger (Mobile) */}
        <div className="relative ml-auto md:hidden">
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
                {isAuthenticated && (
                  <li className="px-4 py-2 text-sm font-semibold text-red-900">
                    Xin chào, {displayName}
                  </li>
                )}
                <li>
                  <Link href="/" className="block px-4 py-2 hover:bg-yellow-800" onClick={() => setIsOpen(false)}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="block px-4 py-2 hover:bg-yellow-800" onClick={() => setIsOpen(false)}>
                    Dịch vụ
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="block px-4 py-2 hover:bg-yellow-800" onClick={() => setIsOpen(false)}>
                    Tra cứu
                  </Link>
                </li>
                <li>
                  <Link href="/#support" className="block px-4 py-2 hover:bg-yellow-800" onClick={() => setIsOpen(false)}>
                    Hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="block px-4 py-2 hover:bg-yellow-800" onClick={() => setIsOpen(false)}>
                    Tin tức
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-md px-4 py-2 text-left font-semibold text-red-900 hover:bg-yellow-800"
                    >
                      Đăng xuất
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link href="/login" className="block px-4 py-2 hover:bg-yellow-800" onClick={() => setIsOpen(false)}>
                      Đăng nhập
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;