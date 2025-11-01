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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-4">
          <Image
            className="rounded-md border border-white/20 bg-slate-900/60 p-1"
            src="/images/logo.png"
            alt="Quốc kỳ Việt Nam"
            width={42}
            height={42}
            priority
          />
          <div className="leading-tight">
            <Link href="/" className="block text-lg font-semibold tracking-wide text-slate-100">
              Hệ thống Quản lý Dân cư và Hộ khẩu
            </Link>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-200">Bộ Công an Việt Nam</p>
          </div>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          <nav>
            <ul className="flex items-center gap-4 text-sm font-medium text-slate-200">
              <li>
                <Link href="/" className="transition hover:text-amber-300">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition hover:text-amber-300">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/search" className="transition hover:text-amber-300">
                  Tra cứu
                </Link>
              </li>
              <li>
                <SupportButton />
              </li>
              <li>
                <Link href="/news" className="transition hover:text-amber-300">
                  Tin tức
                </Link>
              </li>
            </ul>
          </nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-widest text-amber-200">
              <span>Xin chào, {displayName}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-amber-300/60 bg-amber-200/10 px-3 py-1 text-[11px] font-semibold text-amber-200 transition hover:bg-amber-200/20"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-4 py-2 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        <div className="relative md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
            aria-label="Mở menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/40">
              <ul className="py-2 text-sm">
                {isAuthenticated && (
                  <li className="px-4 pb-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
                    Xin chào, {displayName}
                  </li>
                )}
                <li>
                  <Link href="/" className="block px-4 py-2 transition hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="block px-4 py-2 transition hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    Dịch vụ
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="block px-4 py-2 transition hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    Tra cứu
                  </Link>
                </li>
                <li>
                  <Link href="/#support" className="block px-4 py-2 transition hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    Hỗ trợ
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="block px-4 py-2 transition hover:bg-white/10" onClick={() => setIsOpen(false)}>
                    Tin tức
                  </Link>
                </li>
                <li className="mt-1 border-t border-white/10" />
                {isAuthenticated ? (
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-amber-200 transition hover:bg-white/10"
                    >
                      Đăng xuất
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link href="/login" className="block px-4 py-2 text-amber-200 transition hover:bg-white/10" onClick={() => setIsOpen(false)}>
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