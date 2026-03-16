'use client';

import React from 'react';
import { feeCategories } from '../types';

type FeesTabProps = {
  feeDraft: {
    categoryId: string;
    personalId: string;
    amount: string;
    dueDate: string;
  };
  cccdError?: string | null;
  amountError?: string | null;
  handleAmountBlur: () => void;
  handleFeeChange: (field: 'categoryId' | 'personalId' | 'amount' | 'dueDate', value: string) => void;
  handleFeeSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

const FeesTab: React.FC<FeesTabProps> = ({ 
  feeDraft, 
  cccdError, 
  amountError, 
  handleFeeChange, 
  handleAmountBlur, 
  handleFeeSubmit 
}) => {
  return (
    <section className="w-full animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Thiết lập khoản phí</h2>
        <form onSubmit={handleFeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Loại phí</label>
            <select
              value={feeDraft.categoryId}
              onChange={(e) => handleFeeChange('categoryId', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none"
            >
              {feeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Số CCCD</label>
            <input
              type="text"
              value={feeDraft.personalId}
              onChange={(e) => handleFeeChange('personalId', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
            {cccdError && <p className="text-red-500 text-xs mt-1">{cccdError}</p>}
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
              Số tiền (VNĐ)
            </label>
            <input
              type="number"
              value={feeDraft.amount}
              onChange={(e) => handleFeeChange('amount', e.target.value)}
              onBlur={handleAmountBlur}
              className={`w-full rounded-xl border ${
                amountError ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-200 focus:ring-emerald-500/50'
              } bg-slate-50 px-4 py-3 text-sm outline-none transition-colors duration-200`}
            />
            {amountError && <p className="text-red-500 text-xs mt-1 animate-[fadeIn_0.2s_ease-out]">{amountError}</p>}
          </div>
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Hạn nộp</label>
            <input
              type="date"
              value={feeDraft.dueDate}
              onChange={(e) => handleFeeChange('dueDate', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600 transition shadow-lg"
          >
            Tạo phí
          </button>
        </form>
      </div>
    </section>
  );
};

export default FeesTab;
