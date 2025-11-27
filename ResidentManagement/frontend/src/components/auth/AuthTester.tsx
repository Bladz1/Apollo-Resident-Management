'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/resident-management';

type EndpointDescription = {
  before: string;
  after: string;
};

export type AuthTesterCopy = {
  endpointPath: string;
  card: {
    title: string;
    description: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    rememberMeLabel: string;
    forgotPasswordLabel: string;
    forgotPasswordHref: string;
    submitIdleLabel: string;
    submitLoadingLabel: string;
    footerText: string;
    footerLinkLabel: string;
    footerLinkHref: string;
  };
  messages: {
    idle: string;
    success: string;
    errorTemplate: string;
    network: string;
  };
  aside: {
    badgeLabel: string;
    heading: string;
    endpointDescription: EndpointDescription;
    statusTitle: string;
    responseTitle: string;
    defaultResponseText: string;
    tipsTitle: string;
    tips: string[];
  };
};

function formatError(template: string, statusCode: number) {
  return template.replace('{status}', statusCode.toString());
}

export function AuthTester({ copy }: { copy: AuthTesterCopy }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [responseBody, setResponseBody] = useState<string | null>(null);

  const endpoint = `${API_BASE_URL}${copy.endpointPath}`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setStatus('idle');
    setMessage(null);
    setResponseBody(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      const formatted = (() => {
        try {
          return JSON.stringify(JSON.parse(text), null, 2);
        } catch (error) {
          return text;
        }
      })();

      setResponseBody(formatted || '');

      if (!response.ok) {
        setStatus('error');
        setMessage(formatError(copy.messages.errorTemplate, response.status));
        return;
      }

      setStatus('success');
      setMessage(copy.messages.success);
    } catch (error) {
      setStatus('error');
      setMessage(copy.messages.network);
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
          <h1 className="text-3xl font-black tracking-tight text-white">{copy.card.title}</h1>
          <p className="text-sm leading-relaxed text-slate-200">{copy.card.description}</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-semibold text-slate-100">
                {copy.card.usernameLabel}
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder={copy.card.usernamePlaceholder}
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-100">
                {copy.card.passwordLabel}
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white shadow-inner shadow-black/20 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60"
                placeholder={copy.card.passwordPlaceholder}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-slate-950/80 text-amber-400 focus:ring-amber-400" />
                {copy.card.rememberMeLabel}
              </label>
              <Link href={copy.card.forgotPasswordHref} className="font-semibold text-amber-200 hover:text-amber-100">
                {copy.card.forgotPasswordLabel}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-4 py-2.5 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? copy.card.submitLoadingLabel : copy.card.submitIdleLabel}
            </button>
          </form>

          <p className="text-center text-xs text-slate-300">
            {copy.card.footerText}{' '}
            <Link href={copy.card.footerLinkHref} className="font-semibold text-amber-200 hover:text-amber-100">
              {copy.card.footerLinkLabel}
            </Link>
          </p>
        </section>

        <aside className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-red-900/80 via-slate-950 to-amber-900/40 p-8 shadow-2xl shadow-red-900/40 backdrop-blur-xl">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">{copy.aside.badgeLabel}</p>
            <h2 className="text-2xl font-bold text-white">{copy.aside.heading}</h2>
            <p className="text-sm leading-relaxed text-slate-200">
              {copy.aside.endpointDescription.before}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">{endpoint}</code>
              {copy.aside.endpointDescription.after}
            </p>
          </div>

          <dl className="space-y-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-amber-200">{copy.aside.statusTitle}</dt>
              <dd
                className={`mt-2 font-medium ${
                  status === 'success' ? 'text-emerald-300' : status === 'error' ? 'text-rose-300' : 'text-slate-100'
                }`}
              >
                {message ?? copy.messages.idle}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <dt className="text-xs uppercase tracking-wide text-amber-200">{copy.aside.responseTitle}</dt>
              <dd className="mt-2 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-amber-100/90">
                {responseBody ?? copy.aside.defaultResponseText}
              </dd>
            </div>
          </dl>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            <p className="font-semibold text-amber-200">{copy.aside.tipsTitle}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {copy.aside.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
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