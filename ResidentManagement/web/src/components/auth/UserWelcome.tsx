'use client';

import { useEffect, useState } from 'react';
import {
  AUTH_CHANGE_EVENT,
  AuthChangeDetail,
  loadAuth,
  loadUsername,
} from '@/utils/auth-storage';

type UserWelcomeProps = {
  className?: string;
};

const DEFAULT_GREETING_NAME = 'Người dùng';

export default function UserWelcome({ className }: UserWelcomeProps) {
  const [greetingName, setGreetingName] = useState<string | null>(null);

  useEffect(() => {
    const updateGreeting = (detail?: AuthChangeDetail | null) => {
      const resolveDisplayName = (candidate: string | null | undefined) => {
        const trimmed = candidate?.trim() ?? '';
        return trimmed.length > 0 ? trimmed : DEFAULT_GREETING_NAME;
      };

      if (detail) {
        if (detail.token) {
          const fallback = detail.username ?? loadUsername();
          setGreetingName(resolveDisplayName(fallback ?? null));
        } else {
          setGreetingName(null);
        }
        return;
      }

      const stored = loadAuth();
      if (stored) {
        const fallback = loadUsername();
        setGreetingName(resolveDisplayName(stored.username || fallback || null));
      } else {
        setGreetingName(null);
      }
    };

    updateGreeting();

    const handleAuthChanged = (event: Event) => {
      const customEvent = event as CustomEvent<AuthChangeDetail>;
      updateGreeting(customEvent.detail ?? null);
    };

    const handleStorage = () => {
      updateGreeting();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChanged as EventListener);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChanged as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  if (!greetingName) {
    return null;
  }

  return (
    <p className={className ?? 'text-base md:text-lg text-slate-200'}>
      Xin chào,
      {' '}
      <span className="font-semibold text-white">{greetingName}</span>
      ! Rất vui được đồng hành cùng bạn hôm nay.
    </p>
  );
}
