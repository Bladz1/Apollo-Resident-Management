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
  fullName: string;
  gender?: string;
  birthday?: string;
  email: string;
  personalId?: string;
  phoneNumber?: string;
  address?: string;
  status?: UserRegisterStatus;
  password?: string;
  rawPassword?: string;
  roles?: { name: string }[];
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
  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feedback' | 'accounts' | 'fees' | 'news'>('dashboard');
  const [isScrolled, setIsScrolled] = useState(false);

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
  const [pendingUsersSort, setPendingUsersSort] = useState<'default' | 'name-asc' | 'name-desc'>('default');

  // Fees
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [feeDraft, setFeeDraft] = useState({
    categoryId: feeCategories[0]?.id ?? '',
    personalId: '',
    amount: '',
    dueDate: '',
  });

  // System News
  type SystemNewsItem = {
    id: string;
    title: string;
    summary: string;
    content: string;
    version: string;
    createdAt: string;
  };
  const [newsItems, setNewsItems] = useState<SystemNewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsView, setNewsView] = useState<'create' | 'history'>('create');
  const [newsDraft, setNewsDraft] = useState({ title: '', summary: '', content: '', version: '' });

  // Admin users state (for the right sidebar table)
  const [adminUsers, setAdminUsers] = useState<UserResponse[]>([]);
  const [loadingAdminUsers, setLoadingAdminUsers] = useState(false);

  // All Users Stats View
  const [isStatsViewOpen, setIsStatsViewOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const formatToLocalDate = (value: string) => {
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
    if (complaintsSearchPhone.trim()) {
      list = list.filter((c) =>
        c.phone.toLowerCase().includes(complaintsSearchPhone.trim().toLowerCase())
      );
    }
    if (complaintsSort === 'default') return list;
    return list.sort((a, b) => {
      if (complaintsSort === 'name-asc') return a.name.localeCompare(b.name);
      if (complaintsSort === 'name-desc') return b.name.localeCompare(a.name);
      if (complaintsSort === 'status') {
        const order = { 'PENDING': 0, 'ACCEPTED': 1, 'REJECTED': 2 };
        return order[a.status] - order[b.status];
      }
      if (complaintsSort === 'time-desc') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      if (complaintsSort === 'time-asc') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
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
          fullName: user.fullName,
          email: user.email,
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

  const sortedPendingUsers = useMemo(() => {
    let list = [...pendingUsers];
    if (pendingUsersSearchCCCD.trim()) {
      list = list.filter((u) =>
        u.personalId.toLowerCase().includes(pendingUsersSearchCCCD.trim().toLowerCase())
      );
    }
    if (pendingUsersSort === 'default') return list;
    return list.sort((a, b) => {
      if (pendingUsersSort === 'name-asc') return a.fullName.localeCompare(b.fullName);
      if (pendingUsersSort === 'name-desc') return b.fullName.localeCompare(a.fullName);
      return 0;
    });
  }, [pendingUsers, pendingUsersSearchCCCD, pendingUsersSort]);

  // ========== Fees ==========
  const handleFeeChange = (field: 'categoryId' | 'personalId' | 'amount' | 'dueDate', value: string) => {
    setFeeDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feeDraft.categoryId || !feeDraft.amount || !feeDraft.dueDate || !feeDraft.personalId.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin phí');
      return;
    }
    const category = feeCategories.find((item) => item.id === feeDraft.categoryId);
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

  // ========== System News ==========
  const loadNews = async () => {
    setLoadingNews(true);
    try {
      const response = await fetch(`${API_BASE_URL}/system-news`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('Không thể tải danh sách tin tức.');
      const data = (await response.json()) as ApiResponse<SystemNewsItem[]>;
      setNewsItems(data.result ?? []);
    } catch (error) {
      console.error('Load news error:', error);
    } finally {
      setLoadingNews(false);
    }
  };

  const handleNewsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsDraft.title.trim() || !newsDraft.summary.trim()) {
      alert('Vui lòng nhập tiêu đề và tóm tắt.');
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/system-news`, {
        method: 'POST',
        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(newsDraft),
      });
      if (!response.ok) throw new Error('Không thể tạo tin tức mới.');
      setNewsDraft({ title: '', summary: '', content: '', version: '' });
      await loadNews();
      alert('Đã tạo tin tức thành công!');
    } catch (error) {
      console.error('Create news error:', error);
    }
  };

  const handleDeleteNews = async (id: string) => {
    const ok = window.confirm('Bạn có chắc muốn xóa tin tức này không?');
    if (!ok) return;
    try {
      await fetch(`${API_BASE_URL}/system-news/${id}`, {
        method: 'DELETE',
        headers: buildAuthHeaders({ Accept: 'application/json' }),
      });
      setNewsItems((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Delete news error:', error);
    }
  };

  // ========== All Users Stats ==========
  const loadAllUsers = async () => {
    setLoadingAllUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: buildAuthHeaders({ Accept: 'application/json' }),
      });
      if (!response.ok) throw new Error('Không thể tải danh sách toàn bộ người dùng.');
      const data = (await response.json()) as ApiResponse<UserResponse[]>;
      setAllUsers(data.result ?? []);
    } catch (error) {
      console.error('Load all users error:', error);
    } finally {
      setLoadingAllUsers(false);
    }
  };

  const loadAdminUsers = async () => {
    setLoadingAdminUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/admins`, {
        method: 'GET',
        headers: buildAuthHeaders({ Accept: 'application/json' }),
      });
      if (!response.ok) throw new Error('Không thể tải danh sách admin.');
      const data = (await response.json()) as ApiResponse<UserResponse[]>;
      setAdminUsers(data.result ?? []);
    } catch (error) {
      console.error('Load admin users error:', error);
    } finally {
      setLoadingAdminUsers(false);
    }
  };

  useEffect(() => {
    void loadComplaints();
    void loadPendingUsers();
    void loadNews();
    void loadAdminUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar background overlay for mobile only */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white shadow-xl transition-all duration-300 ease-in-out lg:relative ${isSidebarOpen ? 'translate-x-0 ml-0' : '-translate-x-full lg:ml-[-16rem]'
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
          <button onClick={() => setActiveTab('dashboard')} className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('accounts')} className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'accounts' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>Account Manager</button>
          <button onClick={() => setActiveTab('feedback')} className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'feedback' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>Feedbacks</button>
          <button onClick={() => setActiveTab('fees')} className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'fees' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>Fee Settings</button>
          <button onClick={() => setActiveTab('news')} className={`w-full rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeTab === 'news' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}>Tin tức & Cập nhật</button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 relative">
        <main className="flex-1 overflow-y-auto scroll-smooth" onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}>
          <header className={`sticky top-0 z-30 flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled ? 'mx-auto mt-4 h-14 w-[92%] max-w-5xl rounded-full border border-slate-200/60 bg-white/80 shadow-lg backdrop-blur-md px-5' : 'h-16 w-full border-b border-slate-200 bg-white px-6'}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-emerald-600 transition-colors">
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

          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1 space-y-12">
                {activeTab === 'dashboard' && (
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="max-w-xl space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">Admin Panel</span>
                        <h2 className="text-3xl font-black text-slate-900">Trang tổng quan trung tâm điều hành</h2>
                        <p className="text-sm text-slate-600">Tổng quan các hoạt động quản trị hệ thống.</p>
                      </div>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-md min-w-[280px]">
                        <span className="mb-2 block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-center text-xs font-semibold text-slate-500 shadow-sm">Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-slate-900">CSDL Dân cư</p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">● Ổn định</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'accounts' && (
                  <section className="w-full animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 flex-wrap gap-4 bg-white">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900">Đăng ký tài khoản chờ duyệt</h2>
                          <p className="text-xs text-slate-500">Người dùng mới cần được phê duyệt</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <input type="text" placeholder="CCCD..." value={pendingUsersSearchCCCD} onChange={(e) => setPendingUsersSearchCCCD(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500" />
                          <button onClick={() => void loadPendingUsers()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Tải lại</button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr><th className="px-6 py-3 text-left">CCCD</th><th className="px-6 py-3 text-left">Họ tên</th><th className="px-6 py-3 text-left">SĐT</th><th className="px-6 py-3 text-left">Thao tác</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                            {loadingUsers ? <tr><td colSpan={4} className="px-6 py-8 text-center">Đang tải...</td></tr> : pendingUsers.length === 0 ? <tr><td colSpan={4} className="px-6 py-8 text-center">Không có yêu cầu.</td></tr> : sortedPendingUsers.map(u => (
                              <tr key={u.id} className="hover:bg-slate-50 transition"><td className="px-6 py-4 font-medium text-slate-900">{u.personalId}</td><td className="px-6 py-4">{u.fullName}</td><td className="px-6 py-4 text-slate-500">{u.phone}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => void handleApproveUser(u.id)} className="rounded-md bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white uppercase hover:bg-emerald-600">Duyệt</button><button onClick={() => void handleRejectUser(u.id)} className="rounded-md border border-rose-200 bg-white px-3 py-1 text-[10px] font-bold text-rose-600 uppercase hover:bg-rose-50">Xóa</button></div></td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'feedback' && (
                  <section className="w-full animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
                      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6 flex-wrap gap-4 bg-white">
                        <h2 className="text-xl font-semibold text-slate-900">Kiến nghị & phản ánh</h2>
                        <input type="text" placeholder="SĐT..." value={complaintsSearchPhone} onChange={(e) => setComplaintsSearchPhone(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-emerald-500" />
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                          <thead className="bg-slate-50 text-xs uppercase text-slate-500 text-left">
                            <tr><th className="px-6 py-3">Tên</th><th className="px-6 py-3">SĐT</th><th className="px-6 py-3">Ngày gửi</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Thao tác</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {loadingComplaints ? <tr><td colSpan={5} className="px-6 py-8 text-center">Đang tải...</td></tr> : localComplaints.length === 0 ? <tr><td colSpan={5} className="px-6 py-8 text-center">Chưa có phản ánh.</td></tr> : sortedComplaints.map(item => (
                              <tr key={item.id} className="hover:bg-slate-50 transition"><td className="px-6 py-4 font-medium text-slate-900">{item.name}</td><td className="px-6 py-4 text-slate-500">{item.phone}</td><td className="px-6 py-4 text-slate-400 text-xs">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '—'}</td><td className="px-6 py-4 text-slate-500 truncate max-w-[150px]">{item.email}</td><td className="px-6 py-4">{item.status === 'PENDING' ? <button onClick={() => handleViewComplaint(item)} className="rounded-md bg-sky-500 px-3 py-1 text-[10px] font-bold text-white uppercase hover:bg-sky-600">Xem</button> : <span className={`text-[10px] font-bold uppercase rounded-md px-2 py-0.5 ${item.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.status === 'ACCEPTED' ? 'Đã nhận' : 'Đã xóa'}</span>}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === 'fees' && (
                  <section className="w-full animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md p-8">
                      <h2 className="text-xl font-semibold text-slate-900 mb-6">Thiết lập khoản phí</h2>
                      <form onSubmit={handleFeeSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Loại phí</label>
                          <select value={feeDraft.categoryId} onChange={(e) => handleFeeChange('categoryId', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none">{feeCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select>
                        </div>
                        <div className="space-y-4"><label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Số CCCD</label><input type="text" value={feeDraft.personalId} onChange={(e) => handleFeeChange('personalId', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></div>
                        <div className="space-y-4"><label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Số tiền (VNĐ)</label><input type="number" value={feeDraft.amount} onChange={(e) => handleFeeChange('amount', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></div>
                        <div className="space-y-4"><label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Hạn nộp</label><input type="date" value={feeDraft.dueDate} onChange={(e) => handleFeeChange('dueDate', e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /></div>
                        <button type="submit" className="md:col-span-2 rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600 transition shadow-lg">Tạo phí</button>
                      </form>
                    </div>
                  </section>
                )}

                {activeTab === 'news' && (
                  <section className="w-full animate-[fadeIn_0.3s_ease-out]">
                    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-md p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-slate-900">Tin tức hệ thống</h2>
                        <div className="flex bg-slate-50 rounded-xl p-1">
                          <button onClick={() => setNewsView('create')} className={`px-4 py-2 text-xs font-bold rounded-lg transition ${newsView === 'create' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Tạo mới</button>
                          <button onClick={() => { setNewsView('history'); void loadNews(); }} className={`px-4 py-2 text-xs font-bold rounded-lg transition ${newsView === 'history' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Lịch sử</button>
                        </div>
                      </div>
                      {newsView === 'create' ? (
                        <form onSubmit={handleNewsSubmit} className="space-y-5">
                          <input type="text" placeholder="Tiêu đề..." value={newsDraft.title} onChange={(e) => setNewsDraft(p => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                          <input type="text" placeholder="Tóm tắt..." value={newsDraft.summary} onChange={(e) => setNewsDraft(p => ({ ...p, summary: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
                          <textarea rows={4} placeholder="Nội dung..." value={newsDraft.content} onChange={(e) => setNewsDraft(p => ({ ...p, content: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none resize-none"></textarea>
                          <button type="submit" className="w-full rounded-xl bg-emerald-500 py-4 text-sm font-bold text-white hover:bg-emerald-600 transition">Đăng tin</button>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          {newsItems.map(n => (
                            <div key={n.id} className="border border-slate-100 rounded-2xl p-4 hover:border-emerald-200 transition">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                                  <p className="text-[10px] text-slate-400 mb-2">{n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : ''}</p>
                                  <p className="text-xs text-slate-600">{n.summary}</p>
                                </div>
                                <button onClick={() => void handleDeleteNews(n.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg">🗑️</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* Right Sidebar - Admin List */}
              <div className="w-full shrink-0 lg:w-[320px]">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">ADMIN Accounts</h3>
                      <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {loadingAdminUsers ? <div className="text-center py-4"><div className="h-5 w-5 animate-spin border-2 border-emerald-500 border-t-transparent mx-auto"></div></div> : adminUsers.map(user => (
                        <div key={user.id} className="flex items-center gap-3 rounded-2xl bg-slate-50/50 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 font-bold text-white uppercase">{user.fullName?.charAt(0)}</div>
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{user.fullName}</p><p className="text-[10px] text-slate-500">Administrator</p></div>
                        </div>
                      ))}
                    </div>
                    <div onClick={() => { setIsStatsViewOpen(true); void loadAllUsers(); }} className="mt-8 rounded-2xl bg-slate-900/[0.03] p-4 cursor-pointer hover:bg-slate-900/[0.06] transition-colors">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Tổng số Admin</span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-white">{adminUsers.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Account Statistics View Modal */}
      {isStatsViewOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white animate-[fadeIn_0.2s_ease-out]">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 px-8 bg-slate-50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500 p-2 text-white"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
              <div><h2 className="text-lg font-bold text-slate-900">Thống kê tài khoản</h2><p className="text-xs text-slate-500">Excel Mode</p></div>
            </div>
            <button onClick={() => setIsStatsViewOpen(false)} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all">Đóng ✕</button>
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
                  {loadingAllUsers ? <tr><td colSpan={10} className="py-20 text-center"><div className="h-10 w-10 animate-spin border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div><p className="text-slate-400">Đang truy xuất dữ liệu...</p></td></tr> : allUsers.length === 0 ? <tr><td colSpan={10} className="py-20 text-center text-slate-400">Không tìm thấy dữ liệu.</td></tr> : allUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="sticky left-0 z-10 bg-white px-4 py-3 font-bold text-slate-900">{user.personalId || '—'}</td>
                      <td className="px-4 py-3">{user.fullName}</td>
                      <td className="px-4 py-3">{user.phoneNumber || '—'}</td>
                      <td className="px-4 py-3">{user.email || '—'}</td>
                      <td className="px-4 py-3 truncate max-w-[150px]" title={user.address}>{user.address || '—'}</td>
                      <td className="px-4 py-3">{user.gender || '—'}</td>
                      <td className="px-4 py-3">{user.birthday ? new Date(user.birthday).toLocaleDateString('vi-VN') : '—'}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${user.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : user.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{user.status}</span></td>
                      <td className="px-4 py-3"><div className="flex gap-1">{user.roles?.map(r => <span key={r.name} className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">{r.name}</span>)}</div></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><code className="bg-slate-50 px-2 py-0.5 rounded font-mono text-slate-400">{visiblePasswords.has(user.id) ? (user.rawPassword || user.password || 'N/A') : '••••••••'}</code><button onClick={() => togglePasswordVisibility(user.id)} className="text-slate-400 hover:text-emerald-500 transition-colors">{visiblePasswords.has(user.id) ? '👁️‍🗨️' : '👁️'}</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100"><p className="text-[10px] text-slate-400 font-medium">* Hệ thống sử dụng mã hóa BCrypt. Mật khẩu hiển thị là chuỗi băm bảo mật.</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
