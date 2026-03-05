'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TOKEN_KEY } from '@/utils/auth-storage';
import Image from 'next/image';


const feeCategories = [
  {
    id: 'health-social',
    label: 'Phí y tế - xã hội',
    description: 'Bao gồm quỹ y tế, hỗ trợ xã hội, và chăm sóc cộng đồng.',
  },
  {
    id: 'administrative',
    label: 'Phí hành chính công',
    description: 'Lệ phí cấp giấy tờ, đăng ký dịch vụ công và xác thực hồ sơ.',
  },
  {
    id: 'transport',
    label: 'Phí giao thông',
    description: 'Phí đường bộ, phương tiện công cộng, và hạ tầng giao thông.',
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080/resident-management';

type FeedbackStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

type Complaint = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: FeedbackStatus;
  title?: string;
  description?: string;
  content?: string;
  attachmentUrl?: string;
  createdAt?: string;
};

type UserRegisterStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

type PendingUser = {
  id: string;
  personalId: string;
  fullName: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  status: UserRegisterStatus;
  email?: string;
};

type UserResponse = {
  id: string;
  username: string;
  personalId?: string;
  phoneNumber?: string;
  address?: string;
  status?: UserRegisterStatus;
};

type FeeRecord = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  amount: string;
  dueDate: string;
  createdAt: string;
};

type ApiResponse<T> = {
  result: T;
};

export default function AdminDashboardPage() {
  // Complaints
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [localComplaints, setLocalComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintsSort, setComplaintsSort] = useState<'default' | 'name-asc' | 'name-desc' | 'status' | 'time-desc' | 'time-asc'>('default');
  const [complaintsSearchPhone, setComplaintsSearchPhone] = useState('');

  // Pending users
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [pendingUsersSearchCCCD, setPendingUsersSearchCCCD] = useState('');

  // Fees
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [feeDraft, setFeeDraft] = useState({
    categoryId: feeCategories[0]?.id ?? '',
    personalId: '',
    amount: '',
    dueDate: '',
  });
  const formatToLocalDate = (value: string) => {
    // value may already be YYYY-MM-DD
    return value.slice(0, 10);
  };


  const buildAuthHeaders = (base: Record<string, string>) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    const headers: Record<string, string> = { ...base };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  // ========== Complaints ==========
  const loadComplaints = async () => {
    setLoadingComplaints(true);

    try {
      const response = await fetch(`${API_BASE_URL}/feedbacks`, {
        method: 'GET',
        headers: buildAuthHeaders({ Accept: 'application/json' }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Không thể tải danh sách phản ánh.');
      }

      const data = (await response.json()) as ApiResponse<Complaint[]>;
      setLocalComplaints(data.result ?? []);
    } catch (error) {
      console.error('Load complaints error:', error);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleViewComplaint = (item: Complaint) => setSelectedComplaint(item);
  const closeComplaintModal = () => setSelectedComplaint(null);

  const deleteComplaint = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
      method: 'DELETE',
      headers: buildAuthHeaders({ Accept: 'application/json' }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Không thể xóa phản ánh.');
    }

    return true;
  };

  const handleDeleteComplaint = async (id: string) => {
    try {
      const ok = window.confirm('Bạn có chắc muốn từ chối và xóa phản ánh này không?');
      if (!ok) return;

      await deleteComplaint(id);
      await loadComplaints();
      setSelectedComplaint((prev) => (prev?.id === id ? null : prev));
    } catch (error) {
      console.error('Delete complaint error:', error);
    }
  };

  const acceptComplaint = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/feedbacks/${id}/status`, {
      method: 'PUT',
      headers: buildAuthHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Không thể cập nhật trạng thái phản ánh.');
    }

    return true;
  };

  const handleAcceptComplaint = async (id: string) => {
    try {
      await acceptComplaint(id);
      setLocalComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'ACCEPTED' } : c)));
      setSelectedComplaint((prev) => (prev?.id === id ? { ...prev, status: 'ACCEPTED' } : prev));
    } catch (error) {
      console.error('Accept complaint error:', error);
    }
  };

  const sortedComplaints = useMemo(() => {
    let list = [...localComplaints];

    // Filter by phone if provided
    if (complaintsSearchPhone.trim()) {
      list = list.filter((c) =>
        c.phone.toLowerCase().includes(complaintsSearchPhone.trim().toLowerCase())
      );
    }

    if (complaintsSort === 'default') return list;

    return list.sort((a, b) => {
      if (complaintsSort === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (complaintsSort === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (complaintsSort === 'status') {
        const order = { 'PENDING': 0, 'ACCEPTED': 1, 'REJECTED': 2 };
        return order[a.status] - order[b.status];
      }
      if (complaintsSort === 'time-desc') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Newest first
      }
      if (complaintsSort === 'time-asc') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB; // Oldest first
      }
      return 0;
    });
  }, [localComplaints, complaintsSort, complaintsSearchPhone]);

  // ========== Pending Users ==========
  const loadPendingUsers = async () => {
    setLoadingUsers(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/pending`, {
        method: 'GET',
        headers: buildAuthHeaders({ Accept: 'application/json' }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Không thể tải danh sách đăng ký chờ duyệt.');
      }

      const data = (await response.json()) as ApiResponse<UserResponse[]>;
      const normalized = (data.result ?? [])
        .filter((user) => user.status === 'PENDING')
        .map((user) => ({
          id: user.id,
          personalId: user.personalId ?? '',
          fullName: user.username,
          phone: user.phoneNumber,
          address: user.address,
          status: user.status ?? 'PENDING',
        }));

      setPendingUsers(normalized);
    } catch (error) {
      console.error('Load pending users error:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const approveUser = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/status/${id}`, {
      method: 'PUT',
      headers: buildAuthHeaders({ Accept: 'application/json', 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Duyệt tài khoản thất bại.');
    }

    return true;
  };

  const rejectUser = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: buildAuthHeaders({ Accept: 'application/json' }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Từ chối tài khoản thất bại.');
    }

    return true;
  };

  const handleApproveUser = async (id: string) => {
    try {
      await approveUser(id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Approve user error:', error);
    }
  };

  const handleRejectUser = async (id: string) => {
    try {
      const ok = window.confirm('Bạn có chắc muốn từ chối tài khoản này không?');
      if (!ok) return;

      await rejectUser(id);
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Reject user error:', error);
    }
  };

  const filteredPendingUsers = useMemo(() => {
    if (!pendingUsersSearchCCCD.trim()) return pendingUsers;
    return pendingUsers.filter((u) =>
      u.personalId.toLowerCase().includes(pendingUsersSearchCCCD.trim().toLowerCase())
    );
  }, [pendingUsers, pendingUsersSearchCCCD]);

  // ========== Fees ==========
  const handleFeeChange = (field: 'categoryId' | 'personalId' | 'amount' | 'dueDate', value: string) => {
    setFeeDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // im lặng nếu thiếu input
    if (
      !feeDraft.categoryId ||
      !feeDraft.amount ||
      !feeDraft.dueDate ||
      !feeDraft.personalId.trim()
    ) {
      alert('Vui lòng nhập đầy đủ thông tin phí');
      return;
    }


    const category = feeCategories.find((item) => item.id === feeDraft.categoryId);

    console.log(feeDraft.dueDate)

    try {
      const response = await fetch(`${API_BASE_URL}/fees`, {
        method: 'POST',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          feeType: feeDraft.categoryId,
          categoryId: feeDraft.categoryId,
          name: category?.label ?? 'Khoản phí mới',
          agency: 'Ủy ban nhân dân',
          amount: Number(feeDraft.amount),
          dueDate: formatToLocalDate(feeDraft.dueDate),
          status: 'Chưa nộp',
          description: `Khoản phí ${category?.label?.toLowerCase() ?? ''}`.trim(),
          personalId: feeDraft.personalId.trim(),
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Không thể tạo phí mới.');
      }

      const data = (await response.json()) as ApiResponse<FeeRecord>;
      const newRecord: FeeRecord = {
        id: data.result?.id ?? `fee-${Date.now()}`,
        categoryId: feeDraft.categoryId,
        categoryLabel: category?.label ?? 'Chưa xác định',
        amount: feeDraft.amount,
        dueDate: feeDraft.dueDate,
        createdAt: new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
      };

      setFeeRecords((prev) => [newRecord, ...prev].slice(0, 5));
      setFeeDraft({ categoryId: feeDraft.categoryId, personalId: '', amount: '', dueDate: '' });
    } catch (error) {
      console.error('Create fee error:', error);
    }
  };

  useEffect(() => {
    void loadComplaints();
    void loadPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute inset-0 opacity-60" aria-hidden>
          <div className="admin-grid" />
          <div className="admin-orb orb-left" />
          <div className="admin-orb orb-right" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
                Bảng điều khiển quản trị
              </span>
              <h1 className="text-3xl font-black text-white md:text-4xl">Giám sát toàn diện tình trạng cư trú và hạ tầng hệ thống</h1>
              <p className="text-sm text-slate-200 md:text-base">
                Cung cấp tầm nhìn tổng quan cho cán bộ quản trị: theo dõi hồ sơ, hoạt động người dùng, cảnh báo an ninh và tự động hóa quy trình trên cùng một giao diện trực quan.
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200 shadow-xl shadow-emerald-900/20 backdrop-blur">
              <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                <span>Trung tâm điều hành</span>
                <span>Trạng thái</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">CSDL Dân cư</p>
                  <p className="text-xs text-slate-400">Đồng bộ thời gian thực</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  ● Ổn định
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">

        {/* SECTION 2 - Complaints */}
        <section className="w-full">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6 flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Kiến nghị & phản ánh</h2>
                <p className="text-xs text-slate-400">Danh sách phản ánh của người dân gửi lên hệ thống</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Tìm theo CCCD/SĐT..."
                  value={complaintsSearchPhone}
                  onChange={(e) => setComplaintsSearchPhone(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none hover:bg-white/10 focus:border-emerald-500/50"
                  aria-label="Tìm theo CCCD/SĐT"
                />
                <button
                  type="button"
                  onClick={() => void loadComplaints()}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  Làm mới
                </button>
                <div className="flex items-center gap-2">
                  <label htmlFor="complaints-sort" className="text-xs text-slate-400">Sắp xếp:</label>
                  <select
                    id="complaints-sort"
                    value={complaintsSort}
                    onChange={(e) => setComplaintsSort(e.target.value as any)}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 outline-none hover:bg-white/10 focus:border-emerald-500/50"
                  >
                    <option value="default" className="bg-slate-900">Mặc định</option>
                    <option value="time-desc" className="bg-slate-900">Mới nhất</option>
                    <option value="time-asc" className="bg-slate-900">Cũ nhất</option>
                    <option value="name-asc" className="bg-slate-900">Tên A → Z</option>
                    <option value="name-desc" className="bg-slate-900">Tên Z → A</option>
                    <option value="status" className="bg-slate-900">Trạng thái (Chờ duyệt trước)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-8 py-3 text-left">Họ và tên</th>
                    <th className="w-[150px] px-4 py-3 text-left">SĐT</th>
                    <th className="w-[120px] px-4 py-3 text-left">Ngày tạo</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Địa chỉ liên hệ</th>
                    <th className="w-[260px] px-4 py-3 text-left">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5 text-slate-200">
                  {loadingComplaints && (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-sm text-slate-400">
                        Đang tải phản ánh...
                      </td>
                    </tr>
                  )}

                  {!loadingComplaints && localComplaints.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-6 text-center text-sm text-slate-400">
                        Chưa có phản ánh mới.
                      </td>
                    </tr>
                  )}

                  {!loadingComplaints && localComplaints.length > 0 && sortedComplaints.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-6 text-center text-sm text-slate-400">
                        Không tìm thấy phản ánh nào khớp với số điện thoại này.
                      </td>
                    </tr>
                  )}

                  {sortedComplaints.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/5">
                      <td className="px-8 py-4 font-semibold text-white">{item.name}</td>
                      <td className="px-4 py-4">{item.phone}</td>
                      <td className="px-4 py-4 text-slate-300 text-xs">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="px-4 py-4 text-slate-300">{item.email}</td>
                      <td className="px-4 py-4 text-slate-400">{item.address}</td>

                      <td className="px-4 py-4">
                        <div className="flex min-w-[260px] justify-center">
                          {item.status === 'PENDING' ? (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleViewComplaint(item)}
                                className="w-32 rounded-md bg-sky-500 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-400"
                              >
                                Xem nội dung
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDeleteComplaint(item.id)}
                                className="w-32 rounded-md border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-400/10"
                              >
                                Xóa
                              </button>
                            </div>
                          ) : item.status === 'ACCEPTED' ? (
                            <span className="w-40 rounded-md bg-emerald-500 px-3 py-1 text-center text-xs font-semibold text-white">
                              Đã tiếp nhận
                            </span>
                          ) : (
                            <span className="w-40 rounded-md bg-rose-500 px-3 py-1 text-center text-xs font-semibold text-white">
                              Đã xóa
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Nội dung phản ánh</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedComplaint.name} • {selectedComplaint.phone}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeComplaintModal}
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/5"
                  >
                    Đóng
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-slate-200">
                  {selectedComplaint.description?.trim() || selectedComplaint.content?.trim()
                    ? selectedComplaint.description?.trim() || selectedComplaint.content?.trim()
                    : 'Chưa có nội dung phản ánh.'}
                </div>

                {selectedComplaint.attachmentUrl && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Tệp đính kèm</p>

                    <Image
                      src={selectedComplaint.attachmentUrl}
                      alt="Ảnh đính kèm"
                      width={800}
                      height={600}
                      className="max-h-[300px] w-full rounded-lg border border-white/10 object-contain"
                    />

                    <a
                      href={selectedComplaint.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-sky-400 hover:underline"
                    >
                      Mở ảnh trong tab mới
                    </a>
                  </div>
                )}

                <div className="mt-4 text-xs text-slate-400">
                  Email: {selectedComplaint.email || '—'} • Địa chỉ: {selectedComplaint.address || '—'}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Pending users */}
        <section className="w-full">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Đăng ký tài khoản chờ duyệt</h2>
                <p className="text-xs text-slate-400">Danh sách người dùng mới đăng ký cần admin phê duyệt</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="text"
                  placeholder="Tìm theo CCCD..."
                  value={pendingUsersSearchCCCD}
                  onChange={(e) => setPendingUsersSearchCCCD(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none hover:bg-white/10 focus:border-emerald-500/50"
                  aria-label="Tìm theo CCCD"
                />
                <button
                  type="button"
                  onClick={() => void loadPendingUsers()}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                >
                  Làm mới
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="w-[200px] px-8 py-3 text-left">CCCD</th>
                    <th className="px-4 py-3 text-left">Họ và tên</th>
                    <th className="w-[170px] px-4 py-3 text-left">SĐT</th>
                    <th className="px-4 py-3 text-left">Địa chỉ</th>
                    <th className="w-[260px] px-4 py-3 text-left">Thao tác</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5 text-slate-200">
                  {loadingUsers && (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-sm text-slate-400">
                        Đang tải danh sách đăng ký...
                      </td>
                    </tr>
                  )}

                  {!loadingUsers && pendingUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-sm text-slate-400">
                        Không có đăng ký mới.
                      </td>
                    </tr>
                  )}

                  {!loadingUsers && pendingUsers.length > 0 && filteredPendingUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-8 py-6 text-center text-sm text-slate-400">
                        Không tìm thấy tài khoản chờ duyệt nào khớp với số CCCD này.
                      </td>
                    </tr>
                  )}

                  {filteredPendingUsers.map((u) => (
                    <tr key={u.id} className="transition hover:bg-white/5">
                      <td className="px-8 py-4 font-semibold text-white">{u.personalId || '—'}</td>
                      <td className="px-4 py-4">{u.fullName}</td>
                      <td className="px-4 py-4 text-slate-300">{u.phone || '—'}</td>
                      <td className="px-4 py-4 text-slate-400">{u.address || '—'}</td>

                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => void handleApproveUser(u.id)}
                              className="w-32 rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-400"
                            >
                              Chấp nhận
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleRejectUser(u.id)}
                              className="w-32 rounded-md border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-400/10"
                            >
                              Từ chối
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Fees */}
        <section className="w-full">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Thiết lập các loại phí, số tiền và hạn nộp cho từng dịch vụ công</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold text-slate-200">
                Cập nhật mới nhất: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>

            <div className="grid gap-8 px-8 py-8 lg:grid-cols-[1.2fr,0.8fr]">
              <form onSubmit={handleFeeSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Loại phí</span>
                    <select
                      value={feeDraft.categoryId}
                      onChange={(event) => handleFeeChange('categoryId', event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    >
                      {feeCategories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-slate-950">
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Số CCCD</span>
                    <input
                      type="text"
                      value={feeDraft.personalId}
                      onChange={(event) => handleFeeChange('personalId', event.target.value)}
                      placeholder="Nhập số CCCD"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    />
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Số tiền (VNĐ)</span>
                    <input
                      type="number"
                      min={0}
                      value={feeDraft.amount}
                      onChange={(event) => handleFeeChange('amount', event.target.value)}
                      placeholder="Ví dụ: 250000"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    />
                  </label>

                  <label className="space-y-2 text-sm text-slate-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hạn nộp</span>
                    <input
                      type="date"
                      value={feeDraft.dueDate}
                      onChange={(event) => handleFeeChange('dueDate', event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                    />
                  </label>

                  <div className="flex items-end md:col-span-2">
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                    >
                      Tạo phí mới
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gợi ý loại phí</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {feeCategories.map((category) => (
                      <div key={category.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
                        <p className="text-sm font-semibold text-white">{category.label}</p>
                        <p className="mt-1 text-xs text-slate-400">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </form>

              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5 text-xs text-emerald-100">
                  <p className="font-semibold text-emerald-50">Lưu ý vận hành</p>
                  <ul className="mt-3 space-y-2">
                    <li>• Kiểm tra lại hạn nộp để tránh trùng lặp kỳ thu.</li>
                    <li>• Cân đối số tiền theo quy định phí địa phương.</li>
                    <li>• Thông báo cho người dân qua hệ thống thông báo khi đã tạo phí.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
