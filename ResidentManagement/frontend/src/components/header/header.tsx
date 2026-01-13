'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SupportButton from '@/components/header/support_button';
import {
  AUTH_CHANGE_EVENT,
  AuthChangeDetail,
  clearAuth,
  extractRolesFromToken,
  loadAuth,
  loadUsername,
} from '../../utils/auth-storage';

type HeaderAuthState = {
  isAuthenticated: boolean;
  username: string | null;
  isAdmin: boolean;
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authState, setAuthState] = useState<HeaderAuthState>({
    isAuthenticated: false,
    username: null,
    isAdmin: false,
  });

  const resolveAdmin = (token: string | null, usernameCandidate: string | null) => {
    const roles = token ? extractRolesFromToken(token) ?? [] : [];
    const normalizedRoles = roles.map((role) => role.toUpperCase());
    const hasRoleAdmin = normalizedRoles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN');
    const username = usernameCandidate?.toLowerCase() ?? '';

    return hasRoleAdmin || username.includes('admin');
  };

  useEffect(() => {
    const updateState = (hasToken: boolean, usernameCandidate: string | null, token: string | null) => {
      const normalized = usernameCandidate?.trim() ?? null;
      const isAdmin = hasToken ? resolveAdmin(token, normalized) : false;
      setAuthState({
        isAuthenticated: hasToken,
        username: normalized && normalized.length > 0 ? normalized : null,
        isAdmin,
      });
    };

    const syncAuthState = (detail?: AuthChangeDetail | null) => {
      if (detail) {
        if (detail.token) {
          const fallbackUsername = detail.username ?? loadUsername();
          updateState(true, fallbackUsername ?? null, detail.token);
        } else {
          updateState(false, null, null);
        }
        return;
      }

      const stored = loadAuth();

      if (stored) {
        const fallback = loadUsername();
        updateState(true, stored.username || fallback || null, stored.token);
      } else {
        updateState(false, null, null);
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
  const isAdmin = authState.isAdmin;
  const displayName = authState.username ?? 'Người dùng';

  const handleLogout = async () => {
    await clearAuth();
    setAuthState({
      isAuthenticated: false,
      username: null,
      isAdmin: false,
    });
    setIsOpen(false);
    setIsProfileOpen(false);
  };


  return (
    <header className="bg-gradient-to-r from-red-800 via-red-950 to-red-800 text-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            className="h-9 w-9 rounded-md bg-transparent sm:h-10 sm:w-10"
            src="/images/logo.png"
            alt="Quốc kỳ Việt Nam"
            width={40}
            height={40}

          />
          <h1 className="max-w-[180px] text-xs font-semibold leading-snug text-balance sm:max-w-none sm:text-sm md:text-lg">
            <Link href="/">Hệ thống Quản lý Dân cư và Hộ khẩu</Link>
          </h1>
        </div>

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
            <div className="relative flex items-center gap-3">
              <span className="text-sm font-semibold text-yellow-200">Xin chào, {displayName}</span>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-yellow-200 transition hover:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                aria-label="Mở menu tài khoản"
              >
                <Image src="/images/PicturePlaceholder.png" alt="Ảnh đại diện" width={40} height={40} className="h-full w-full object-cover" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-yellow-400 text-red-900 shadow-lg z-[9999]">
                  <div className="border-b border-yellow-200 px-4 py-3 text-sm font-semibold">
                    {displayName}
                  </div>
                  <div className="py-2 text-sm">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 font-medium hover:bg-yellow-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 font-medium hover:bg-yellow-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Quản trị
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left font-semibold text-red-800 hover:bg-yellow-300"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-100"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        <div className="relative z-50 ml-auto flex items-center gap-2 md:hidden">
          {isAuthenticated && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-yellow-200"
                aria-label="Mở меnu tài khoản"
              >
                <Image
                  src="/images/PicturePlaceholder.png"
                  alt="Ảnh đại diện"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              </button>

              {isProfileOpen && (
                <div className="fixed right-3 top-14 w-[calc(100vw-1.5rem)] max-w-[13rem] rounded-lg bg-yellow-400 text-red-900 shadow-lg z-[9999]">
                  <div className="border-b border-yellow-200 px-4 py-3 text-sm font-semibold">
                    {displayName}
                  </div>

                  <div className="py-2 text-sm">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 font-medium hover:bg-yellow-300"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Hồ sơ
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 font-medium hover:bg-yellow-300"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Quản trị
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left font-semibold text-red-800 hover:bg-yellow-300"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
            <svg
              className="h-6 w-6"
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

            <div className="fixed right-3 top-14 w-[calc(100vw-1.5rem)] max-w-[12rem] rounded-lg bg-yellow-400 p-2 text-white space-y-2 z-[9998] shadow-lg">
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
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-yellow-800"
                      onClick={() => setIsOpen(false)}
                    >
                      Hồ sơ
                    </Link>
                  </li>
                ) : null}

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
