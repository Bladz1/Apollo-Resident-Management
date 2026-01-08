'use client'; // ⚠️ phải ở dòng đầu tiên!

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("SUBMIT RUN");
    console.log("API_BASE_URL =", API_BASE_URL);
    console.log("FETCH TO =", `${API_BASE_URL}/auth/token`);


    setLoading(true);
    setStatus('idle');
    setMessage(null);
    setResponseBody(null);

    try {
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

      const resolvedUsername =
        usernameFromResponse ?? extractUsernameFromToken(tokenFromResponse) ?? username;

      const resolvedRoles = rolesFromResponse ?? extractRolesFromToken(tokenFromResponse) ?? [];
      const isAdmin = resolvedRoles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN');

      saveAuth(tokenFromResponse ?? null, resolvedUsername);

      setStatus('success');
      setMessage('Đăng nhập thành công! API đã phản hồi thành công.');
      router.push(isAdmin ? '/admin' : '/');
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
        {/* ✅ LIGHT LOGIN CARD */}
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path
                        fillRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-400 text-amber-500 focus:ring-amber-400"
                />
                Ghi nhớ đăng nhập
              </label>

              <Link href="#" className="font-semibold text-amber-700 hover:text-amber-600">
                Quên mật khẩu?
              </Link>
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

          {/* ✅ LIGHT ALERT BOX */}
          {status !== 'idle' && (
            <div
              role="alert"
              aria-live="polite"
              className={`w-full rounded-md border px-4 py-3 text-sm ${status === 'error'
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
