'use client';

import React from 'react';
import { PendingUser } from '../types';

type AccountsTabProps = {
  pendingUsers: PendingUser[];
  loadingUsers: boolean;
  pendingUsersSearchCCCD: string;
  setPendingUsersSearchCCCD: (val: string) => void;
  loadPendingUsers: () => Promise<void>;
  sortedPendingUsers: PendingUser[];
  handleApproveUser: (id: string) => Promise<void>;
  handleRejectUser: (id: string) => Promise<void>;
};

const AccountsTab: React.FC<AccountsTabProps> = ({
  pendingUsers,
  loadingUsers,
  pendingUsersSearchCCCD,
  setPendingUsersSearchCCCD,
  loadPendingUsers,
  sortedPendingUsers,
  handleApproveUser,
  handleRejectUser,
}) => {
  return (
    <section className="w-full animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 flex-wrap gap-4 bg-white">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Đăng ký tài khoản chờ duyệt</h2>
            <p className="text-xs text-slate-500">Người dùng mới cần được phê duyệt</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="CCCD..."
              value={pendingUsersSearchCCCD}
              onChange={(e) => setPendingUsersSearchCCCD(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => void loadPendingUsers()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Tải lại
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">CCCD</th>
                <th className="px-6 py-3 text-left">Họ tên</th>
                <th className="px-6 py-3 text-left">SĐT</th>
                <th className="px-6 py-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
              {loadingUsers ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : pendingUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    Không có yêu cầu.
                  </td>
                </tr>
              ) : (
                sortedPendingUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.personalId}</td>
                    <td className="px-6 py-4">{u.fullName}</td>
                    <td className="px-6 py-4 text-slate-500">{u.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => void handleApproveUser(u.id)}
                          className="rounded-md bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white uppercase hover:bg-emerald-600"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => void handleRejectUser(u.id)}
                          className="rounded-md border border-rose-200 bg-white px-3 py-1 text-[10px] font-bold text-rose-600 uppercase hover:bg-rose-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AccountsTab;
