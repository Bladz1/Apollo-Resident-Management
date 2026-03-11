'use client';

import React from 'react';
import { SystemNewsItem } from '../types';

type NewsTabProps = {
  newsView: 'create' | 'history';
  setNewsView: (view: 'create' | 'history') => void;
  newsDraft: { title: string; summary: string; content: string; version: string };
  setNewsDraft: React.Dispatch<React.SetStateAction<{ title: string; summary: string; content: string; version: string }>>;
  handleNewsSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  newsItems: SystemNewsItem[];
  loadNews: () => Promise<void>;
  handleDeleteNews: (id: string) => Promise<void>;
};

const NewsTab: React.FC<NewsTabProps> = ({
  newsView,
  setNewsView,
  newsDraft,
  setNewsDraft,
  handleNewsSubmit,
  newsItems,
  loadNews,
  handleDeleteNews,
}) => {
  return (
    <section className="w-full animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Tin tức hệ thống</h2>
          <div className="flex bg-slate-50 rounded-xl p-1">
            <button
              onClick={() => setNewsView('create')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                newsView === 'create' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              Tạo mới
            </button>
            <button
              onClick={() => {
                setNewsView('history');
                void loadNews();
              }}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                newsView === 'history' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              Lịch sử
            </button>
          </div>
        </div>
        {newsView === 'create' ? (
          <form onSubmit={handleNewsSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Tiêu đề..."
              value={newsDraft.title}
              onChange={(e) => setNewsDraft((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Tóm tắt..."
              value={newsDraft.summary}
              onChange={(e) => setNewsDraft((p) => ({ ...p, summary: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
            <textarea
              rows={4}
              placeholder="Nội dung..."
              value={newsDraft.content}
              onChange={(e) => setNewsDraft((p) => ({ ...p, content: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none resize-none"
            ></textarea>
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600 transition"
            >
              Đăng tin
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {newsItems.map((n) => (
              <div key={n.id} className="border border-slate-100 rounded-2xl p-4 hover:border-emerald-200 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                    <p className="text-[10px] text-slate-400 mb-2">
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : ''}
                    </p>
                    <p className="text-xs text-slate-600">{n.summary}</p>
                  </div>
                  <button
                    onClick={() => void handleDeleteNews(n.id)}
                    className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsTab;
