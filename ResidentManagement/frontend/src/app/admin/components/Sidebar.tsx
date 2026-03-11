'use client';

import React from 'react';

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: 'dashboard' | 'feedback' | 'accounts' | 'fees' | 'news';
  setActiveTab: (tab: 'dashboard' | 'feedback' | 'accounts' | 'fees' | 'news') => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) => {
  return (
    <>
      {/* Sidebar background overlay for mobile only */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white shadow-xl transition-all duration-300 ease-in-out lg:relative ${
          isSidebarOpen ? 'translate-x-0 ml-0' : '-translate-x-full lg:ml-[-16rem]'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <span className="text-lg font-bold text-emerald-600">Admin Tools</span>
          <button
            className="text-slate-500 hover:text-slate-700 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="space-y-1 p-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'accounts' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Account Manager
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'feedback' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Feedbacks
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'fees' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Fee Settings
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${
              activeTab === 'news' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tin tức & Cập nhật
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
