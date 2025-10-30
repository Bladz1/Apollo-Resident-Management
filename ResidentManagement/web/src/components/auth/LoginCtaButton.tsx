'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
  AUTH_CHANGE_EVENT,
  AuthChangeDetail,
  loadAuth,
} from '@/utils/auth-storage';

function hasValidToken(token: string | null | undefined): boolean {
  return typeof token === 'string' && token.trim().length > 0;
}

const baseClassName =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-6 py-3 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5';

type LoginCtaButtonProps = {
  className?: string;
};

export default function LoginCtaButton({ className }: LoginCtaButtonProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const updateVisibility = (detail?: AuthChangeDetail | null) => {
      if (detail) {
        setShouldShow(!hasValidToken(detail.token));
        return;
      }

      const stored = loadAuth();
      setShouldShow(!stored || !hasValidToken(stored.token));
    };

    const handleAuthChanged = (event: Event) => {
      const customEvent = event as CustomEvent<AuthChangeDetail>;
      updateVisibility(customEvent.detail ?? null);
    };

    const handleStorage = () => {
      updateVisibility();
    };

    updateVisibility();

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChanged as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChanged as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!shouldShow) {
    return null;
  }

  const combinedClassName = className ? `${baseClassName} ${className}` : baseClassName;

  return (
    <Link href="/login" className={combinedClassName}>
      <span className="relative z-10 flex items-center gap-2">
        Đăng nhập hệ thống
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
      <span className="absolute inset-0 translate-y-full bg-white/60 transition-transform duration-500 group-hover:translate-y-0" />
    </Link>
  );
}
