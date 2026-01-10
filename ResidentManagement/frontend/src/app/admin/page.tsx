'use client';

import { useEffect, useState } from 'react';

import { TOKEN_KEY } from '@/utils/auth-storage';

const overviewStats = [
  { label: 'Hồ sơ chờ duyệt', value: '128', trend: '+12', trendLabel: 'so với hôm qua' },
  { label: 'Yêu cầu cư trú khẩn', value: '14', trend: '+3', trendLabel: 'cần xử lý trước 18:00' },
  { label: 'Báo cáo bất thường', value: '5', trend: '-2', trendLabel: 'đã giải quyết' },
];

const pendingApprovals = [
  { id: 'HS-2024-9812', citizen: 'Nguyễn Văn Minh', type: 'Đăng ký thường trú', submittedAt: '09:24 - 24/05/2025', status: 'Đang kiểm tra' },
  { id: 'HS-2024-9804', citizen: 'Trần Thị Thu', type: 'Gia hạn tạm trú', submittedAt: '08:10 - 24/05/2025', status: 'Chờ bổ sung' },
  { id: 'HS-2024-9795', citizen: 'Lê Quốc Huy', type: 'Xác nhận tạm vắng', submittedAt: '20:16 - 23/05/2025', status: 'Sẵn sàng duyệt' },
  { id: 'HS-2024-9790', citizen: 'Phạm Thị Lan', type: 'Điều chỉnh nhân khẩu', submittedAt: '19:02 - 23/05/2025', status: 'Đang kiểm tra' },
];

const recentActivities = [
  { time: '10:42', actor: 'Nguyễn An (Quản trị viên)', action: 'Phê duyệt hồ sơ tạm trú HS-2024-9788', priority: 'normal' },
  { time: '09:58', actor: 'Hệ thống cảnh báo', action: 'Phát hiện đăng nhập trái phép từ IP 203.113.5.87', priority: 'high' },
  { time: '09:15', actor: 'Trần Quỳnh (Kiểm duyệt)', action: 'Gửi yêu cầu bổ sung giấy tờ hồ sơ HS-2024-9804', priority: 'normal' },
  { time: '08:45', actor: 'Tự động hóa', action: 'Đồng bộ dữ liệu dân cư với CSDL Quốc gia', priority: 'low' },
];

const systemAlerts = [
  {
    title: 'Cảnh báo an toàn thông tin',
    description: 'Phát hiện 2 lần đăng nhập thất bại liên tiếp từ tài khoản quản trị cấp huyện.',
    severity: 'critical',
  },
  { title: 'Giám sát dịch vụ', description: 'API đồng bộ nhân khẩu phản hồi chậm hơn 35% so với bình thường.', severity: 'warning' },
  { title: 'Sao lưu dữ liệu', description: 'Phiên sao lưu định kỳ 06:00 đã hoàn thành và được lưu tại DC-HN-03.', severity: 'info' },
];

const teamMembers = [
  { name: 'Vũ Minh Đức', role: 'Trưởng phòng quản trị', status: 'Đang trực', shift: '07:30 - 15:30' },
  { name: 'Đặng Thu Uyên', role: 'Kiểm duyệt viên', status: 'Đang xử lý hồ sơ', shift: '08:00 - 16:00' },
  { name: 'Phan Công Nam', role: 'Chuyên viên an ninh', status: 'Theo dõi hệ thống', shift: 'Trực tuyến 24/7' },
];

const automationRules = [
  {
    name: 'Duyệt nhanh hồ sơ tái đăng ký',
    description: 'Tự động chấp nhận hồ sơ tái đăng ký cư trú nếu thông tin khớp 100% với kỳ trước.',
    updatedAt: '22/05/2025',
    status: 'Đang kích hoạt',
  },
  {
    name: 'Chặn truy cập bất thường',
    description: 'Phong tỏa tài khoản nếu phát hiện 5 lần đăng nhập sai liên tiếp trong 10 phút.',
    updatedAt: '20/05/2025',
    status: 'Đang giám sát',
  },
  {
    name: 'Cảnh báo hồ sơ trễ hạn',
    description: 'Gửi thông báo tới cán bộ phụ trách khi hồ sơ quá hạn xử lý trên 24 giờ.',
    updatedAt: '18/05/2025',
    status: 'Đang kích hoạt',
  },
];

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080';

type FeedbackStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

type Complaint = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  status: FeedbackStatus;
  title?: string;
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
  const [localComplaints, setLocalComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [complaintError, setComplaintError] = useState<string | null>(null);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [feeError, setFeeError] = useState<string | null>(null);
  const [feeDraft, setFeeDraft] = useState({
    categoryId: feeCategories[0]?.id ?? '',
    personalId: '',
    amount: '',
    dueDate: '',
  });

  const loadComplaints = async () => {
    setLoadingComplaints(true);
    setComplaintError(null);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/feedbacks`, { headers });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Không thể tải danh sách phản ánh.');
      }

      const data = (await response.json()) as ApiResponse<Complaint[]>;
      setLocalComplaints(data.result ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tải danh sách phản ánh.';
      setComplaintError(message);
    } finally {
      setLoadingComplaints(false);
    }
  };

  useEffect(() => {
    void loadComplaints();
  }, []);

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/feedbacks/${id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Cập nhật trạng thái thất bại.');
    }

    const data = (await response.json()) as ApiResponse<Complaint>;
    return data.result;
  };

  const handleAccept = async (id: string) => {
    try {
      const updated = await updateStatus(id, 'ACCEPTED');
      setLocalComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: updated.status } : c)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cập nhật trạng thái thất bại.';
      setComplaintError(message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const updated = await updateStatus(id, 'REJECTED');
      setLocalComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: updated.status } : c)));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Cập nhật trạng thái thất bại.';
      setComplaintError(message);
    }
  };

  const handleFeeChange = (field: 'categoryId' | 'personalId' | 'amount' | 'dueDate', value: string) => {
    setFeeDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeeError(null);

    if (!feeDraft.categoryId || !feeDraft.amount || !feeDraft.dueDate || !feeDraft.personalId) {
      setFeeError('Vui lòng nhập đầy đủ CCCD, loại phí, số tiền và hạn nộp.');
      return;
    }

    const category = feeCategories.find((item) => item.id === feeDraft.categoryId);
    const token = localStorage.getItem(TOKEN_KEY);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const response = await fetch(`${API_BASE_URL}/fees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          feeType: feeDraft.categoryId,
          categoryId: feeDraft.categoryId,
          name: category?.label ?? 'Khoản phí mới',
          agency: 'Ủy ban nhân dân',
          amount: Number(feeDraft.amount),
          dueDate: feeDraft.dueDate,
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
        createdAt: new Date().toLocaleString('vi-VN', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
      };

      setFeeRecords((prev) => [newRecord, ...prev].slice(0, 5));
      setFeeDraft({
        categoryId: feeDraft.categoryId,
        personalId: '',
        amount: '',
        dueDate: '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể tạo phí mới.';
      setFeeError(message);
    }
  };

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
              <h1 className="text-3xl font-black text-white md:text-4xl">
                Giám sát toàn diện tình trạng cư trú và hạ tầng hệ thống
              </h1>
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
        {/* SECTION 1 */}
        <section className="w-full">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Hồ sơ cần xử lý</h2>
                <p className="text-xs text-slate-400">Danh sách cập nhật trong 15 phút gần nhất</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th scope="col" className="w-[160px] px-8 py-3 text-left">Mã hồ sơ</th>
                    <th scope="col" className="px-4 py-3 text-left">Công dân</th>
                    <th scope="col" className="px-4 py-3 text-left">Loại thủ tục</th>
                    <th scope="col" className="w-[190px] px-4 py-3 text-left">Thời gian gửi</th>
                    <th scope="col" className="w-[160px] px-4 py-3 text-left">Trạng thái</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5 text-slate-200">
                  {pendingApprovals.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/5">
                      <td className="px-8 py-4 font-semibold text-white">{item.id}</td>
                      <td className="px-4 py-4">{item.citizen}</td>
                      <td className="px-4 py-4 text-slate-300">{item.type}</td>
                      <td className="px-4 py-4 text-slate-400">{item.submittedAt}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="w-full">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Kiến nghị & phản ánh</h2>
                <p className="text-xs text-slate-400">Danh sách phản ánh của người dân gửi lên hệ thống</p>
              </div>
            </div>

            {complaintError && (
              <div className="border-b border-white/5 px-8 py-4 text-sm text-rose-200">
                {complaintError}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th className="px-8 py-3 text-left">Họ và tên</th>
                    <th className="w-[150px] px-4 py-3 text-left">SĐT</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Địa chỉ liên hệ</th>
                    <th className="w-[260px] px-4 py-3 text-left">Trạng thái</th>
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
                      <td colSpan={5} className="px-8 py-6 text-center text-sm text-slate-400">
                        Chưa có phản ánh mới.
                      </td>
                    </tr>
                  )}
                  {localComplaints.map((item) => (
                    <tr key={item.id} className="transition hover:bg-white/5">
                      <td className="px-8 py-4 font-semibold text-white">{item.name}</td>
                      <td className="px-4 py-4">{item.phone}</td>
                      <td className="px-4 py-4 text-slate-300">{item.email}</td>
                      <td className="px-4 py-4 text-slate-400">{item.address}</td>

                      {/* ✅ When rejected: hide accept button, center the remaining badge */}
                      <td className="px-4 py-4">
                        <div className="flex min-w-[260px] justify-center">
                          {item.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleAccept(item.id)}
                                className="w-32 rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-400"
                              >
                                Xác nhận
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(item.id)}
                                className="w-32 rounded-md border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-400/10"
                              >
                                Từ chối
                              </button>
                            </div>
                          )}

                          {item.status === 'ACCEPTED' && (
                            <span className="w-32 rounded-md bg-emerald-500 px-3 py-1 text-center text-xs font-semibold text-white">
                              Đã tiếp nhận
                            </span>
                          )}

                          {item.status === 'REJECTED' && (
                            <span className="w-32 rounded-md bg-rose-500 px-3 py-1 text-center text-xs font-semibold text-white">
                              Đã từ chối
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
        </section>

        {/* SECTION 3 */}
        <section className="w-full">
          <div className="w-full rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white"> Thiết lập các loại phí, số tiền và hạn nộp cho từng dịch vụ công</h2>
                
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

                {feeError && (
                  <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {feeError}
                  </div>
                )}

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
