'use client';

import { useState } from 'react';

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

type ComplaintStatus = 'pending' | 'accepted' | 'rejected';

type Complaint = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: ComplaintStatus;
};

const complaints: Complaint[] = [
  { fullName: 'Nguyễn Văn A', phone: '0901 234 567', email: 'nguyenvana@gmail.com', address: 'Quận 1, TP.HCM', status: 'pending' },
  { fullName: 'Trần Thị B', phone: '0987 654 321', email: 'tranthib@yahoo.com', address: 'Hà Đông, Hà Nội', status: 'pending' },
];

export default function AdminDashboardPage() {
  const [localComplaints, setLocalComplaints] = useState<Complaint[]>(complaints);

  const handleAccept = (i: number) => {
    setLocalComplaints((prev) => prev.map((c, idx) => (idx === i ? { ...c, status: 'accepted' } : c)));
  };

  const handleReject = (i: number) => {
    setLocalComplaints((prev) => prev.map((c, idx) => (idx === i ? { ...c, status: 'rejected' } : c)));
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
                  {localComplaints.map((item, index) => (
                    <tr key={index} className="transition hover:bg-white/5">
                      <td className="px-8 py-4 font-semibold text-white">{item.fullName}</td>
                      <td className="px-4 py-4">{item.phone}</td>
                      <td className="px-4 py-4 text-slate-300">{item.email}</td>
                      <td className="px-4 py-4 text-slate-400">{item.address}</td>

                      {/* ✅ When rejected: hide accept button, center the remaining badge */}
                      <td className="px-4 py-4">
                        <div className="flex min-w-[260px] justify-center">
                          {item.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleAccept(index)}
                                className="w-32 rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-400"
                              >
                                Xác nhận
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(index)}
                                className="w-32 rounded-md border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-200 hover:bg-rose-400/10"
                              >
                                Từ chối
                              </button>
                            </div>
                          )}

                          {item.status === 'accepted' && (
                            <span className="w-32 rounded-md bg-emerald-500 px-3 py-1 text-center text-xs font-semibold text-white">
                              Đã tiếp nhận
                            </span>
                          )}

                          {item.status === 'rejected' && (
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
      </main>
    </div>
  );
}
