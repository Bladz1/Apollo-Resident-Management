'use client';

import React from 'react';
import { Complaint } from '../types';

type FeedbackTabProps = {
  loadingComplaints: boolean;
  localComplaints: Complaint[];
  complaintsSearchPhone: string;
  setComplaintsSearchPhone: (val: string) => void;
  sortedComplaints: Complaint[];
  handleViewComplaint: (item: Complaint) => void;
};

const FeedbackTab: React.FC<FeedbackTabProps> = ({
  loadingComplaints,
  localComplaints,
  complaintsSearchPhone,
  setComplaintsSearchPhone,
  sortedComplaints,
  handleViewComplaint,
}) => {
  return (
    <section className="w-full animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 flex-wrap gap-4 bg-white">
          <h2 className="text-xl font-semibold text-slate-900">Kiến nghị & phản ánh</h2>
          <input
            type="text"
            placeholder="SĐT..."
            value={complaintsSearchPhone}
            onChange={(e) => setComplaintsSearchPhone(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 text-left">
              <tr>
                <th className="px-6 py-3">Tên</th>
                <th className="px-6 py-3">SĐT</th>
                <th className="px-6 py-3">Ngày gửi</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingComplaints ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : localComplaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center">
                    Chưa có phản ánh.
                  </td>
                </tr>
              ) : (
                sortedComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900 truncate max-w-[200px]" title={item.name}>
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.phone}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 truncate max-w-[150px]">{item.email}</td>
                    <td className="px-6 py-4">
                      {item.status === 'PENDING' ? (
                        <button
                          onClick={() => handleViewComplaint(item)}
                          className="rounded-md bg-sky-500 px-3 py-1 text-[10px] font-bold text-white uppercase hover:bg-sky-600"
                        >
                          Xem
                        </button>
                      ) : (
                        <span
                          className={`text-[10px] font-bold uppercase rounded-md px-2 py-0.5 ${
                            item.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.status === 'ACCEPTED' ? 'Đã nhận' : 'Đã xóa'}
                        </span>
                      )}
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

export default FeedbackTab;
