'use client';

import React from 'react';

const DashboardTab: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
            Admin Panel
          </span>
          <h2 className="text-3xl font-black text-slate-900">Trang tổng quan trung tâm điều hành</h2>
          <p className="text-sm text-slate-600">Tổng quan các hoạt động quản trị hệ thống.</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-md min-w-[280px]">
          <span className="mb-2 block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-center text-xs font-semibold text-slate-500 shadow-sm">
            Cập nhật: {new Date().toLocaleDateString('vi-VN')}
          </span>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-slate-900">CSDL Dân cư</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              ● Ổn định
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
