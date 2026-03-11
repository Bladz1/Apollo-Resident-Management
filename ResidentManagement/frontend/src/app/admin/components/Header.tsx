'use client';

import React from 'react';

type HeaderProps = {
  activeTab: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isScrolled: boolean;
};

const Header: React.FC<HeaderProps> = ({ activeTab, isSidebarOpen, setIsSidebarOpen, isScrolled }) => {
  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'mx-auto mt-4 h-14 w-[92%] max-w-5xl rounded-full border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-md px-5'
          : 'h-16 w-full border-b border-slate-200 bg-white px-6'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold capitalize text-slate-800">
          {activeTab === 'dashboard' && 'Dashboard'}
          {activeTab === 'accounts' && 'Account Manager'}
          {activeTab === 'feedback' && 'Kiến nghị & Phản ánh'}
          {activeTab === 'fees' && 'Thiết lập Phí'}
          {activeTab === 'news' && 'Tin tức'}
        </h1>
      </div>
    </header>
  );
};

export default Header;
