'use client';  // ⚠️ phải ở dòng đầu tiên!

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractRolesFromToken, extractUsernameFromToken, saveAuth } from '@/utils/auth-storage';
import { AuthTesterCopy } from '@/components/auth/AuthTester';
import styles from './login.module.css';

const LOGIN_COPY: AuthTesterCopy = {
  endpointPath: '/auth/login',
  card: {
    title: 'Đăng nhập hệ thống',
    description:
      'Trang đăng nhập được thiết kế theo phong cách tối giản giống GitHub nhưng được phối màu đồng nhất với chủ đề đỏ - vàng của landing page. Sử dụng biểu mẫu bên dưới để gửi yêu cầu tới API xác thực và kiểm tra phản hồi ngay lập tức.',
    usernameLabel: 'Tên đăng nhập',
    usernamePlaceholder: 'vd: admin',
    passwordLabel: 'Mật khẩu',
    passwordPlaceholder: '••••••••',
    rememberMeLabel: 'Ghi nhớ đăng nhập',
    forgotPasswordLabel: 'Quên mật khẩu?',
    forgotPasswordHref: '#',
    submitIdleLabel: 'Đăng nhập',
    submitLoadingLabel: 'Đang kiểm tra...',
    footerText: 'Chưa có tài khoản?',
    footerLinkLabel: 'Đăng ký ngay',
    footerLinkHref: '/register',
  },
  messages: {
    idle: 'Nhập thông tin và nhấn đăng nhập để bắt đầu kiểm tra.',
    success: 'Đăng nhập thành công! API đã phản hồi thành công.',
    errorTemplate: 'Đăng nhập thất bại (HTTP {status}). Vui lòng kiểm tra API.',
    network: 'Không thể kết nối tới API. Hãy kiểm tra lại server hoặc cấu hình URL.',
  },
  aside: {
    statusTitle: 'Thông báo',
    responseTitle: 'Phản hồi từ API',
    defaultResponseText: 'Chưa có phản hồi.',
    tipsTitle: 'Mẹo kiểm thử nhanh',
    tips: [
      'Chỉnh NEXT_PUBLIC_API_BASE_URL trong file .env.local nếu API chạy ở địa chỉ khác.',
      'Quan sát phần "Phản hồi từ API" để xem JSON hoặc thông báo lỗi trả về.',
      'Sử dụng DevTools để kiểm tra request payload khi cần gỡ lỗi sâu hơn.',
    ],
  },
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:8080/resident-management';

type AuthExtractionResult = {
  token?: string;
  username?: string;
  roles?: string[];
};

function normalizeRoles(value: unknown): string[] | null {
  if (!value) {
    return null;
  }

  const collected = new Set<string>();
  const queue: unknown[] = [value];
  const visited = new Set<object>();

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

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
      if (visited.has(current as object)) {
        continue;
      }

      visited.add(current as object);

      for (const candidate of Object.values(current as Record<string, unknown>)) {
        queue.push(candidate);
      }
    }
  }

  if (collected.size === 0) {
    return null;
  }

  return Array.from(collected);
}

function pickRolesFromRecord(record: Record<string, unknown>): string[] | null {
  const candidateKeys = ['roles', 'role', 'authorities', 'permissions', 'scopes', 'scope'];

  for (const key of candidateKeys) {
    const roles = normalizeRoles(record[key]);
    if (roles && roles.length > 0) {
      return roles;
    }
  }

  const realmAccess = record['realm_access'];
  if (realmAccess && typeof realmAccess === 'object') {
    const roles = normalizeRoles((realmAccess as Record<string, unknown>)['roles']);
    if (roles && roles.length > 0) {
      return roles;
    }
  }

  const resourceAccess = record['resource_access'];
  if (resourceAccess && typeof resourceAccess === 'object') {
    for (const value of Object.values(resourceAccess as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        const roles = normalizeRoles((value as Record<string, unknown>)['roles']);
        if (roles && roles.length > 0) {
          return roles;
        }
      }
    }
  }

  return null;
}

function extractAuthDetails(payload: unknown): AuthExtractionResult {
  const visited = new Set<object>();
  const queue: object[] = [];

  if (payload && typeof payload === 'object') {
    queue.push(payload as object);
  }

  const pickString = (source: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }
    return undefined;
  };

  const result: AuthExtractionResult = {};

  while (queue.length > 0 && (!result.token || !result.username || !result.roles)) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') {
      continue;
    }

    if (visited.has(current as object)) {
      continue;
    }

    visited.add(current as object);

    const record = current as Record<string, unknown>;

    if (!result.token) {
      result.token = pickString(record, ['token', 'jwt', 'accessToken', 'access_token']);
    }

    result.roles = result.roles ?? pickRolesFromRecord(record) ?? undefined;

    if (!result.username) {
      result.username = pickString(record, ['username', 'userName', 'name']);
    }

    const nestedKeys = ['result', 'data', 'user', 'account', 'profile'];
    for (const key of nestedKeys) {
      const value = record[key];
      if (value && typeof value === 'object') {
        queue.push(value as object);
      }
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

      const {
        token: tokenFromResponse,
        username: usernameFromResponse,
        roles: rolesFromResponse,
      } = extractAuthDetails(parsed);
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
      setMessage('Không thể kết nối tới API. Hãy kiểm tra lại server hoặc cấu hình URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-160px)] bg-slate-950 text-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="login-grid" aria-hidden />
        <div className="login-orb orb-top" aria-hidden />
        <div className="login-orb orb-bottom" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:flex-row lg:items-stretch">
        <section className="w-full max-w-xl space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-red-900/30 backdrop-blur-xl">
          <h1 className="text-3xl font-black tracking-tight text-white">Đăng nhập hệ thống</h1>
          <p className="text-sm leading-relaxed text-slate-200">{LOGIN_COPY.card.description}</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-100">
                {LOGIN_COPY.card.usernameLabel}
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder={LOGIN_COPY.card.usernamePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-100">
                {LOGIN_COPY.card.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                  placeholder={LOGIN_COPY.card.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-slate-950/80 text-amber-400 focus:ring-amber-400" />
                {LOGIN_COPY.card.rememberMeLabel}
              </label>
              <Link href={LOGIN_COPY.card.forgotPasswordHref} className="font-semibold text-amber-200 hover:text-amber-100">
                {LOGIN_COPY.card.forgotPasswordLabel}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? LOGIN_COPY.card.submitLoadingLabel : LOGIN_COPY.card.submitIdleLabel}
            </button>
          </form>

          <p className="text-center text-xs text-slate-300">
            {LOGIN_COPY.card.footerText}{' '}
            <Link href={LOGIN_COPY.card.footerLinkHref} className="font-semibold text-amber-200 hover:text-amber-100">
              {LOGIN_COPY.card.footerLinkLabel}
            </Link>
          </p>
        </section>

        <aside className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-red-900/80 via-slate-950 to-amber-900/40 p-8 shadow-2xl shadow-red-900/40 backdrop-blur-xl">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">{LOGIN_COPY.aside.badgeLabel}</p>
            <h2 className="text-2xl font-bold text-white">{LOGIN_COPY.aside.heading}</h2>
            <p className="text-sm leading-relaxed text-slate-200">
              {LOGIN_COPY.aside.endpointDescription.before}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">{API_BASE_URL + LOGIN_COPY.endpointPath}</code>
              {LOGIN_COPY.aside.endpointDescription.after}
            </p>
          </div>

          <dl className="space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-amber-200">{LOGIN_COPY.aside.statusTitle}</dt>
              <dd className={`mt-2 font-medium ${status === 'success' ? 'text-emerald-300' : status === 'error' ? 'text-rose-300' : 'text-slate-100'}`}>
                {message ?? LOGIN_COPY.messages.idle}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-amber-200">{LOGIN_COPY.aside.responseTitle}</dt>
              <dd className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-amber-100/90">
                {responseBody ?? LOGIN_COPY.aside.defaultResponseText}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
