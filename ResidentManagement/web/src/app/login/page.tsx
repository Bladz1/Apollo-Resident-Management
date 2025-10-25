'use client';  // ⚠️ phải ở dòng đầu tiên!

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractUsernameFromToken, saveAuth } from '@/utils/auth-storage';
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
    footerLinkLabel: 'Liên hệ quản trị để được cấp quyền',
    footerLinkHref: '#',
  },
  messages: {
    idle: 'Nhập thông tin và nhấn đăng nhập để bắt đầu kiểm tra.',
    success: 'Đăng nhập thành công! API đã phản hồi thành công.',
    errorTemplate: 'Đăng nhập thất bại (HTTP {status}). Vui lòng kiểm tra API.',
    network: 'Không thể kết nối tới API. Hãy kiểm tra lại server hoặc cấu hình URL.',
  },
  aside: {
    badgeLabel: 'Trạng thái API',
    heading: 'Theo dõi phản hồi ngay tức thì',
    endpointDescription: {
      before: 'Trang này sẽ gọi tới endpoint ',
      after: '. Hãy đảm bảo backend đang chạy và cho phép CORS từ domain của ứng dụng.',
    },
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
};

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

  while (queue.length > 0 && (!result.token || !result.username)) {
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

      const result = parsed ? JSON.stringify(parsed, null, 2) : text;

      setResponseBody(result || '');

      if (!response.ok) {
        setStatus('error');
        setMessage(`Đăng nhập thất bại (HTTP ${response.status}). Vui lòng kiểm tra API.`);
        return;
      }

      const { token: tokenFromResponse, username: usernameFromResponse } = extractAuthDetails(parsed);
      const resolvedUsername =
        usernameFromResponse ?? extractUsernameFromToken(tokenFromResponse) ?? username;

      saveAuth(tokenFromResponse ?? null, resolvedUsername);

      setStatus('success');
      setMessage('Đăng nhập thành công! API đã phản hồi thành công.');
      router.push('/');
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
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder={LOGIN_COPY.card.passwordPlaceholder}
              />
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
