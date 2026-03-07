'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080/resident-management';

type SystemNewsItem = {
    id: string;
    title: string;
    summary: string;
    content: string;
    version: string;
    createdAt: string;
};

export default function UpdatesPage() {
    const [newsItems, setNewsItems] = useState<SystemNewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/system-news`)
            .then((res) => res.json())
            .then((data) => {
                setNewsItems(data.result ?? []);
            })
            .catch((err) => console.error('Error loading updates:', err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
                        📰 Tin tức & Cập nhật hệ thống
                    </h1>
                    <p className="mt-3 text-sm text-slate-500 md:text-base">
                        Lịch sử tất cả các bản cập nhật và tin tức từ hệ thống quản lý dân cư
                    </p>
                    <Link
                        href="/"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
                    >
                        ← Quay lại trang chủ
                    </Link>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-sm text-slate-500">Đang tải danh sách cập nhật...</div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && newsItems.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                        <p className="text-lg font-semibold text-slate-700">Chưa có cập nhật nào</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Hệ thống sẽ đăng tải thông tin cập nhật tại đây.
                        </p>
                    </div>
                )}

                {/* Timeline */}
                {!loading && newsItems.length > 0 && (
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-red-300 via-red-200 to-transparent" />

                        <div className="space-y-8">
                            {newsItems.map((item, index) => (
                                <div key={item.id} className="relative pl-16">
                                    {/* Timeline dot */}
                                    <div
                                        className={`absolute left-4 top-6 h-5 w-5 rounded-full border-2 border-white shadow-sm ${index === 0
                                                ? 'bg-red-500 ring-4 ring-red-100'
                                                : 'bg-slate-300'
                                            }`}
                                    />

                                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-red-200">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <p className="text-xs font-semibold uppercase text-slate-400">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })
                                                    : '—'}
                                            </p>
                                            {item.version && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700">
                                                    🏷️ {item.version}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="mt-3 text-lg font-bold text-slate-900">
                                            {item.title}
                                        </h2>
                                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                            {item.summary}
                                        </p>
                                        {item.content && (
                                            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 whitespace-pre-wrap border border-slate-100">
                                                {item.content}
                                            </div>
                                        )}
                                    </article>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
