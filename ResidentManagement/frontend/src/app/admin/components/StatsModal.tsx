'use client';

import React from 'react';
import { UserResponse } from '../types';

type StatsModalProps = {
  isStatsViewOpen: boolean;
  setIsStatsViewOpen: (open: boolean) => void;
  allUsers: UserResponse[];
  loadingAllUsers: boolean;
  visiblePasswords: Set<string>;
  togglePasswordVisibility: (userId: string) => void;
};

const StatsModal: React.FC<StatsModalProps> = ({
  isStatsViewOpen,
  setIsStatsViewOpen,
  allUsers,
  loadingAllUsers,
  visiblePasswords,
  togglePasswordVisibility,
}) => {
  if (!isStatsViewOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-[fadeIn_0.2s_ease-out]">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 px-8 bg-slate-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500 p-2 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Thống kê tài khoản</h2>
            <p className="text-xs text-slate-500">Excel Mode</p>
          </div>
        </div>
        <button
          onClick={() => setIsStatsViewOpen(false)}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          Đóng ✕
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="inline-block min-w-full rounded-2xl border border-slate-200 bg-white shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-[11px]">
            <thead className="bg-slate-50 font-bold uppercase text-slate-500">
              <tr>
                <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left">CCCD</th>
                <th className="px-4 py-3 text-left">Họ tên</th>
                <th className="px-4 py-3 text-left">SĐT</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Địa chỉ</th>
                <th className="px-4 py-3 text-left">Giới tính</th>
                <th className="px-4 py-3 text-left">Ngày sinh</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Mật khẩu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingAllUsers ? (
                <tr>
                  <td colSpan={10} className="py-20 text-center">
                    <div className="h-10 w-10 animate-spin border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-400">Đang truy xuất dữ liệu...</p>
                  </td>
                </tr>
              ) : allUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-20 text-center text-slate-400">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              ) : (
                allUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white px-4 py-3 font-bold text-slate-900">
                      {user.personalId || '—'}
                    </td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.phoneNumber || '—'}</td>
                    <td className="px-4 py-3">{user.email || '—'}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={user.address}>
                      {user.address || '—'}
                    </td>
                    <td className="px-4 py-3">{user.gender || '—'}</td>
                    <td className="px-4 py-3">
                      {user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          user.status === 'ACCEPTED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : user.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {user.roles?.map((r) => (
                          <span key={r.name} className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">
                            {r.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="bg-slate-50 px-2 py-0.5 rounded font-mono text-slate-400">
                          {visiblePasswords.has(user.id)
                            ? user.rawPassword || user.password || 'N/A'
                            : '••••••••'}
                        </code>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                          {visiblePasswords.has(user.id) ? '👁️‍🗨️' : '👁️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-medium">
              * Hệ thống sử dụng mã hóa BCrypt. Mật khẩu hiển thị là chuỗi băm bảo mật.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
