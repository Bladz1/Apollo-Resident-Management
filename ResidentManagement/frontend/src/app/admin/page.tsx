'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  API_BASE_URL,
  ApiResponse,
  Complaint,
  FeeRecord,
  PendingUser,
  UserResponse,
  SystemNewsItem,
  feeCategories,
  buildAuthHeaders,
  formatToLocalDate,
} from './types';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardTab from './components/DashboardTab';
import AccountsTab from './components/AccountsTab';
import FeedbackTab from './components/FeedbackTab';
import FeesTab from './components/FeesTab';
import NewsTab from './components/NewsTab';
import AdminList from './components/AdminList';
import StatsModal from './components/StatsModal';

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
      const normalized: PendingUser[] = (data.result ?? [])
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
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 relative">
        <main
          className="flex-1 overflow-y-auto scroll-smooth"
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 20)}
        >
          <Header
            activeTab={activeTab}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isScrolled={isScrolled}
          />

          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col gap-8 lg:flex-row">
              <div className="flex-1 space-y-12">
                {activeTab === 'dashboard' && <DashboardTab />}

                {activeTab === 'accounts' && (
                  <AccountsTab
                    pendingUsers={pendingUsers}
                    loadingUsers={loadingUsers}
                    pendingUsersSearchCCCD={pendingUsersSearchCCCD}
                    setPendingUsersSearchCCCD={setPendingUsersSearchCCCD}
                    loadPendingUsers={loadPendingUsers}
                    sortedPendingUsers={sortedPendingUsers}
                    handleApproveUser={handleApproveUser}
                    handleRejectUser={handleRejectUser}
                  />
                )}

                {activeTab === 'feedback' && (
                  <FeedbackTab
                    loadingComplaints={loadingComplaints}
                    localComplaints={localComplaints}
                    complaintsSearchPhone={complaintsSearchPhone}
                    setComplaintsSearchPhone={setComplaintsSearchPhone}
                    sortedComplaints={sortedComplaints}
                    handleViewComplaint={handleViewComplaint}
                  />
                )}

                {activeTab === 'fees' && (
                  <FeesTab
                    feeDraft={feeDraft}
                    handleFeeChange={handleFeeChange}
                    handleFeeSubmit={handleFeeSubmit}
                  />
                )}

                {activeTab === 'news' && (
                  <NewsTab
                    newsView={newsView}
                    setNewsView={setNewsView}
                    newsDraft={newsDraft}
                    setNewsDraft={setNewsDraft}
                    handleNewsSubmit={handleNewsSubmit}
                    newsItems={newsItems}
                    loadNews={loadNews}
                    handleDeleteNews={handleDeleteNews}
                  />
                )}
              </div>

              {/* Right Sidebar - Admin List */}
              <AdminList
                adminUsers={adminUsers}
                loadingAdminUsers={loadingAdminUsers}
                setIsStatsViewOpen={setIsStatsViewOpen}
                loadAllUsers={loadAllUsers}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Account Statistics View Modal */}
      <StatsModal
        isStatsViewOpen={isStatsViewOpen}
        setIsStatsViewOpen={setIsStatsViewOpen}
        allUsers={allUsers}
        loadingAllUsers={loadingAllUsers}
        visiblePasswords={visiblePasswords}
        togglePasswordVisibility={togglePasswordVisibility}
      />
    </div>
  );
}
