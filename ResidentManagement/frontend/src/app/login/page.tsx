'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { extractRolesFromToken, extractUsernameFromToken, saveAuth } from '@/utils/auth-storage';
import styles from './login.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080';

type AuthExtractionResult = {
  token?: string;
  username?: string;
  roles?: string[];
};

function normalizeRoles(value: unknown): string[] | null {
  if (!value) return null;

  const collected = new Set<string>();
  const queue: unknown[] = [value];
  const visited = new Set<object>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (typeof current === 'string') {
      current
        .split(/[;,]/)
        .flatMap((segment) => segment.split(/\s+/))
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0)
        .map((segment) => segment.toUpperCase())
        .forEach((segment) => collected.add(segment));
      continue;
    }

    if (Array.isArray(current)) {
      current.forEach((item) => queue.push(item));
      continue;
    }

    if (typeof current === 'object') {
      if (visited.has(current as object)) continue;
      visited.add(current as object);

      for (const candidate of Object.values(current as Record<string, unknown>)) {
        queue.push(candidate);
      }
    }
  }

  return collected.size ? Array.from(collected) : null;
}

function pickRolesFromRecord(record: Record<string, unknown>): string[] | null {
  const candidateKeys = ['roles', 'role', 'authorities', 'permissions', 'scopes', 'scope'];

  for (const key of candidateKeys) {
    const roles = normalizeRoles(record[key]);
    if (roles?.length) return roles;
  }

  const realmAccess = record['realm_access'];
  if (realmAccess && typeof realmAccess === 'object') {
    const roles = normalizeRoles((realmAccess as Record<string, unknown>)['roles']);
    if (roles?.length) return roles;
  }

  const resourceAccess = record['resource_access'];
  if (resourceAccess && typeof resourceAccess === 'object') {
    for (const value of Object.values(resourceAccess as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        const roles = normalizeRoles((value as Record<string, unknown>)['roles']);
        if (roles?.length) return roles;
      }
    }
  }

  return null;
}

function extractAuthDetails(payload: unknown): AuthExtractionResult {
  const visited = new Set<object>();
  const queue: object[] = [];

  if (payload && typeof payload === 'object') queue.push(payload as object);

  const pickString = (source: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    }
    return undefined;
  };

  const result: AuthExtractionResult = {};

  while (queue.length > 0 && (!result.token || !result.username || !result.roles)) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current as object)) continue;

    visited.add(current as object);
    const record = current as Record<string, unknown>;

    if (!result.token) {
      result.token = pickString(record, ['token', 'jwt', 'accessToken', 'access_token']);
    }

    result.roles = result.roles ?? pickRolesFromRecord(record) ?? undefined;

    if (!result.username) {
      result.username = pickString(record, ['username', 'userName', 'name']);
    }

    for (const key of ['result', 'data', 'user', 'account', 'profile']) {
      const value = record[key];
      if (value && typeof value === 'object') queue.push(value as object);
    }
  }

  return result;
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ next chỉ dùng khi middleware đá qua login?next=/profile hoặc /admin
  const nextPath = useMemo(() => searchParams.get('next') || '/', [searchParams]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setStatus('idle');
    setMessage(null);
    setResponseBody(null);

    try {
      // 1) ✅ gọi backend thật để lấy token
      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      let parsed: unknown = null;

      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = null;
      }

      const formattedResponse = parsed ? JSON.stringify(parsed, null, 2) : text;
      setResponseBody(formattedResponse || '');

      if (!response.ok) {
        setStatus('error');
        setMessage(`Đăng nhập thất bại (HTTP ${response.status}). Vui lòng kiểm tra API.`);
        return;
      }

      const { token: tokenFromResponse, username: usernameFromResponse, roles: rolesFromResponse } =
        extractAuthDetails(parsed);

      if (!tokenFromResponse) {
        setStatus('error');
        setMessage('API không trả về token. Kiểm tra response của /auth/token.');
        return;
      }

      const resolvedUsername =
        usernameFromResponse ?? extractUsernameFromToken(tokenFromResponse) ?? username;

      const resolvedRoles = rolesFromResponse ?? extractRolesFromToken(tokenFromResponse) ?? [];
      const isAdmin = resolvedRoles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN');

      // 2) ✅ set cookie httpOnly để middleware đọc được
      const cookieRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenFromResponse }),
        credentials: 'same-origin', // ✅ đủ để lưu cookie cho cùng domain
      });

      if (!cookieRes.ok) {
        const errText = await cookieRes.text().catch(() => '');
        setStatus('error');
        setMessage(`Không set được cookie đăng nhập. (HTTP ${cookieRes.status})`);
        setResponseBody(errText || formattedResponse || '');
        return;
      }

      // 3) ✅ lưu localStorage để header hiển thị
      saveAuth(tokenFromResponse, resolvedUsername);

      setStatus('success');
      setMessage('Đăng nhập thành công!');

      // 4) ✅ ưu tiên next nếu nó là route protected
      if (nextPath && nextPath !== '/' && (nextPath.startsWith('/profile') || nextPath.startsWith('/admin'))) {
        router.replace(nextPath);
        return;
      }

      // nếu không có next hợp lệ → điều hướng theo role
      router.replace(isAdmin ? '/admin' : '/');
    } catch {
      setStatus('error');
      setMessage('Sai thông tin đăng nhập. Vui lòng thử lại !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center text-slate-900"
      style={{
        backgroundImage: "url('/images/trongdong.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="login-grid" aria-hidden />
        <div className="login-orb orb-top" aria-hidden />
        <div className="login-orb orb-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 py-0 lg:flex-row lg:items-center lg:justify-center">
        <section className="w-full max-w-xl space-y-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Đăng nhập hệ thống</h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-700">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300"
                placeholder="CCCD hoặc SĐT"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                Mật khẩu
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300"
                  placeholder=""
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-semibold text-amber-700 hover:text-amber-600">
              Đăng ký ngay
            </Link>
          </p>

          {status !== 'idle' && (
            <div
              role="alert"
              aria-live="polite"
              className={`w-full rounded-md border px-4 py-3 text-sm ${
                status === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              }`}
            >
              <div className="font-semibold">{status === 'error' ? 'Lỗi đăng nhập' : 'Thành công'}</div>

              {message && <div className="mt-1">{message}</div>}

              {responseBody && (
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-[11px] font-mono text-slate-700">
                  {responseBody}
                </pre>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center text-slate-600">Đang tải...</div>}
    >
      <LoginPageContent />
    </Suspense>
  );
}
