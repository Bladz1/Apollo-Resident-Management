'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { extractRolesFromToken, extractUsernameFromToken, saveAuth } from '@/utils/auth-storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080/resident-management';

type AuthExtractionResult = {
  token?: string;
  username?: string;
  roles?: string[];
};

/* ===== Helpers ===== */
function normalizeRoles(value: unknown): string[] | null {
  if (!value) return null;

  const collected = new Set<string>();
  const queue: unknown[] = [value];
  const visited = new Set<object>();

  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;

    if (typeof current === 'string') {
      current
        .split(/[;,]/)
        .flatMap((s) => s.split(/\s+/))
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
        .forEach((s) => collected.add(s));
      continue;
    }

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    if (typeof current === 'object') {
      if (visited.has(current)) continue;
      visited.add(current);
      queue.push(...Object.values(current as Record<string, unknown>));
    }
  }

  return collected.size ? Array.from(collected) : null;
}

function extractAuthDetails(payload: unknown): AuthExtractionResult {
  const visited = new Set<object>();
  const queue: object[] = [];

  if (payload && typeof payload === 'object') queue.push(payload as object);

  const result: AuthExtractionResult = {};

  const pickString = (obj: Record<string, unknown>, keys: string[]) =>
    keys.map((k) => obj[k]).find((v) => typeof v === 'string' && v.trim()) as string | undefined;

  while (queue.length && (!result.token || !result.username || !result.roles)) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    const record = current as Record<string, unknown>;

    result.token ??= pickString(record, ['token', 'jwt', 'accessToken', 'access_token']);
    result.username ??= pickString(record, ['username', 'userName', 'name']);
    result.roles ??= normalizeRoles(record.roles) ?? undefined;

    for (const key of ['data', 'result', 'user', 'account', 'profile']) {
      if (record[key] && typeof record[key] === 'object') {
        queue.push(record[key] as object);
      }
    }
  }

  return result;
}

/* ===== Page ===== */
function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = useMemo(() => searchParams.get('next') || '/', [searchParams]);

  const [personalId, setPersonalId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalId,
        password,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Login failed');
    }

    const parsed = await res.json();

    const { token, username: usernameFromResponse, roles } =
      extractAuthDetails(parsed);

    if (!token) return;

    const resolvedUsername =
      usernameFromResponse ??
      extractUsernameFromToken(token) ??
      username;

    const resolvedRoles =
      roles ?? extractRolesFromToken(token) ?? [];

    const isAdmin = resolvedRoles.some(
      (role) => role === 'ADMIN' || role === 'ROLE_ADMIN'
    );

    saveAuth(token, resolvedUsername);

    if (
      nextPath &&
      nextPath !== '/' &&
      (nextPath.startsWith('/profile') || nextPath.startsWith('/admin'))
    ) {
      router.replace(nextPath);
      return;
    }

    router.replace(isAdmin ? '/admin' : '/');
  } catch (error) {
    console.error('Login error:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className="relative flex min-h-screen items-center justify-center text-slate-900"
      style={{
        backgroundImage: "url('/images/trongdong.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <h1 className="mb-6 text-3xl font-black tracking-tight">Đăng nhập hệ thống</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Tên đăng nhập</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border px-4 py-2.5 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-300"
              placeholder="CCCD hoặc SĐT"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-4 py-2.5 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-lg disabled:opacity-70"
          >
            {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold text-amber-700 hover:text-amber-600">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Đang tải...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
