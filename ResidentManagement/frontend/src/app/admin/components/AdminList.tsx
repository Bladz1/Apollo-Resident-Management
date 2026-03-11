'use client';

import React from 'react';
import { UserResponse } from '../types';

type AdminListProps = {
  adminUsers: UserResponse[];
  loadingAdminUsers: boolean;
  setIsStatsViewOpen: (open: boolean) => void;
  loadAllUsers: () => Promise<void>;
};

const AdminList: React.FC<AdminListProps> = ({
  adminUsers,
  loadingAdminUsers,
  setIsStatsViewOpen,
  loadAllUsers,
}) => {
  return (
    <div className="w-full shrink-0 lg:w-[320px]">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">ADMIN Accounts</h3>
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            {loadingAdminUsers ? (
              <div className="text-center py-4">
                <div className="h-5 w-5 animate-spin border-2 border-emerald-500 border-t-transparent mx-auto"></div>
              </div>
            ) : (
              adminUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 rounded-2xl bg-slate-50/50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-white uppercase">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[10px] text-slate-500">Administrator</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div
            onClick={() => {
              setIsStatsViewOpen(true);
              void loadAllUsers();
            }}
            className="mt-8 rounded-2xl bg-slate-900/[0.03] p-4 cursor-pointer hover:bg-slate-900/[0.06] transition-colors"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Tổng số Admin</span>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-white">{adminUsers.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminList;
