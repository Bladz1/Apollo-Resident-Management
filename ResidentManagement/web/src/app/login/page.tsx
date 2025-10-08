import { AuthTester, AuthTesterCopy } from '@/components/auth/AuthTester';

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

export default function LoginPage() {
  return <AuthTester copy={LOGIN_COPY} />;
'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/resident-management';

export default function LoginPage() {
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      const result = (() => {
        try {
          return JSON.stringify(JSON.parse(text), null, 2);
        } catch (error) {
          return text;
        }
      })();

      setResponseBody(result || '');

      if (!response.ok) {
        setStatus('error');
        setMessage(`Đăng nhập thất bại (HTTP ${response.status}). Vui lòng kiểm tra API.`);
        return;
      }

      setStatus('success');
      setMessage('Đăng nhập thành công! API đã phản hồi thành công.');
    } catch (error) {
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
          <p className="text-sm leading-relaxed text-slate-200">
            Trang đăng nhập được thiết kế theo phong cách tối giản giống GitHub nhưng được phối màu đồng nhất với chủ đề đỏ - vàng của landing page.
            Sử dụng biểu mẫu bên dưới để gửi yêu cầu tới API xác thực và kiểm tra phản hồi ngay lập tức.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-100">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="vd: admin"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-100">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-slate-950/80 text-amber-400 focus:ring-amber-400" />
                Ghi nhớ đăng nhập
              </label>
              <Link href="#" className="font-semibold text-amber-200 hover:text-amber-100">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-300">
            Chưa có tài khoản?{' '}
            <Link href="#" className="font-semibold text-amber-200 hover:text-amber-100">
              Liên hệ quản trị để được cấp quyền
            </Link>
          </p>
        </section>

        <aside className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-red-900/80 via-slate-950 to-amber-900/40 p-8 shadow-2xl shadow-red-900/40 backdrop-blur-xl">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">Trạng thái API</p>
            <h2 className="text-2xl font-bold text-white">Theo dõi phản hồi ngay tức thì</h2>
            <p className="text-sm leading-relaxed text-slate-200">
              Trang này sẽ gọi tới endpoint <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">{API_BASE_URL}/auth/login</code>.
              Hãy đảm bảo backend đang chạy và cho phép CORS từ domain của ứng dụng.
            </p>
          </div>

          <dl className="space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-amber-200">Thông báo</dt>
              <dd className={`mt-2 font-medium ${status === 'success' ? 'text-emerald-300' : status === 'error' ? 'text-rose-300' : 'text-slate-100'}`}>
                {message ?? 'Nhập thông tin và nhấn đăng nhập để bắt đầu kiểm tra.'}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-amber-200">Phản hồi từ API</dt>
              <dd className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-amber-100/90">
                {responseBody ?? 'Chưa có phản hồi.'}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <p className="font-semibold text-amber-200">Mẹo kiểm thử nhanh</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Chỉnh <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_API_BASE_URL</code> trong file <code className="rounded bg-white/10 px-1">.env.local</code> nếu API chạy ở địa chỉ khác.</li>
              <li>Quan sát phần "Phản hồi từ API" để xem JSON hoặc thông báo lỗi trả về.</li>
              <li>Sử dụng DevTools để kiểm tra request payload khi cần gỡ lỗi sâu hơn.</li>
            </ul>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .login-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 46px 46px;
          opacity: 0.5;
        }

        .login-orb {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.75;
        }

        .orb-top {
          top: -6rem;
          right: -6rem;
          background: radial-gradient(circle, rgba(248, 113, 113, 0.55), transparent 65%);
        }

        .orb-bottom {
          bottom: -8rem;
          left: -4rem;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.45), transparent 70%);
        }
      `}</style>
    </div>
  );
}
