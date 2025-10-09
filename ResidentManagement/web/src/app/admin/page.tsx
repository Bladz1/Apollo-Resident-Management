const overviewStats = [
  {
    label: 'Hồ sơ chờ duyệt',
    value: '128',
    trend: '+12',
    trendLabel: 'so với hôm qua',
  },
  {
    label: 'Yêu cầu cư trú khẩn',
    value: '14',
    trend: '+3',
    trendLabel: 'cần xử lý trước 18:00',
  },
  {
    label: 'Báo cáo bất thường',
    value: '5',
    trend: '-2',
    trendLabel: 'đã giải quyết',
  },
];

const pendingApprovals = [
  {
    id: 'HS-2024-9812',
    citizen: 'Nguyễn Văn Minh',
    type: 'Đăng ký thường trú',
    submittedAt: '09:24 - 24/05/2025',
    status: 'Đang kiểm tra',
  },
  {
    id: 'HS-2024-9804',
    citizen: 'Trần Thị Thu',
    type: 'Gia hạn tạm trú',
    submittedAt: '08:10 - 24/05/2025',
    status: 'Chờ bổ sung',
  },
  {
    id: 'HS-2024-9795',
    citizen: 'Lê Quốc Huy',
    type: 'Xác nhận tạm vắng',
    submittedAt: '20:16 - 23/05/2025',
    status: 'Sẵn sàng duyệt',
  },
  {
    id: 'HS-2024-9790',
    citizen: 'Phạm Thị Lan',
    type: 'Điều chỉnh nhân khẩu',
    submittedAt: '19:02 - 23/05/2025',
    status: 'Đang kiểm tra',
  },
];

const recentActivities = [
  {
    time: '10:42',
    actor: 'Nguyễn An (Quản trị viên)',
    action: 'Phê duyệt hồ sơ tạm trú HS-2024-9788',
    priority: 'normal',
  },
  {
    time: '09:58',
    actor: 'Hệ thống cảnh báo',
    action: 'Phát hiện đăng nhập trái phép từ IP 203.113.5.87',
    priority: 'high',
  },
  {
    time: '09:15',
    actor: 'Trần Quỳnh (Kiểm duyệt)',
    action: 'Gửi yêu cầu bổ sung giấy tờ hồ sơ HS-2024-9804',
    priority: 'normal',
  },
  {
    time: '08:45',
    actor: 'Tự động hóa',
    action: 'Đồng bộ dữ liệu dân cư với CSDL Quốc gia',
    priority: 'low',
  },
];

const systemAlerts = [
  {
    title: 'Cảnh báo an toàn thông tin',
    description:
      'Phát hiện 2 lần đăng nhập thất bại liên tiếp từ tài khoản quản trị cấp huyện.',
    severity: 'critical',
  },
  {
    title: 'Giám sát dịch vụ',
    description: 'API đồng bộ nhân khẩu phản hồi chậm hơn 35% so với bình thường.',
    severity: 'warning',
  },
  {
    title: 'Sao lưu dữ liệu',
    description: 'Phiên sao lưu định kỳ 06:00 đã hoàn thành và được lưu tại DC-HN-03.',
    severity: 'info',
  },
];

const teamMembers = [
  {
    name: 'Vũ Minh Đức',
    role: 'Trưởng phòng quản trị',
    status: 'Đang trực',
    shift: '07:30 - 15:30',
  },
  {
    name: 'Đặng Thu Uyên',
    role: 'Kiểm duyệt viên',
    status: 'Đang xử lý hồ sơ',
    shift: '08:00 - 16:00',
  },
  {
    name: 'Phan Công Nam',
    role: 'Chuyên viên an ninh',
    status: 'Theo dõi hệ thống',
    shift: 'Trực tuyến 24/7',
  },
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

export default function AdminDashboardPage() {
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
              <button className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/40">
                Xem chi tiết trạng thái
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {overviewStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition hover:border-white/30 hover:bg-white/10"
              >
                <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-emerald-200">
                  {stat.trend}
                  <span className="ml-1 text-slate-300">{stat.trendLabel}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-12">
        <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Hồ sơ cần xử lý</h2>
                <p className="text-xs text-slate-400">Danh sách cập nhật trong 15 phút gần nhất</p>
              </div>
              <button className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/40 hover:text-white">
                Xuất báo cáo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                  <tr>
                    <th scope="col" className="px-8 py-3 text-left">Mã hồ sơ</th>
                    <th scope="col" className="px-4 py-3 text-left">Công dân</th>
                    <th scope="col" className="px-4 py-3 text-left">Loại thủ tục</th>
                    <th scope="col" className="px-4 py-3 text-left">Thời gian gửi</th>
                    <th scope="col" className="px-4 py-3 text-left">Trạng thái</th>
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

          <aside className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Hoạt động gần đây</h2>
                <span className="text-xs text-slate-400">09:00 - 11:00</span>
              </div>
              <div className="mt-5 space-y-4">
                {recentActivities.map((log) => (
                  <div
                    key={`${log.time}-${log.actor}`}
                    className="flex gap-3 rounded-2xl border border-white/5 bg-white/5 p-4"
                  >
                    <div className="text-sm font-semibold text-emerald-200">{log.time}</div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">{log.actor}</p>
                      <p className="text-sm text-slate-300">{log.action}</p>
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                          log.priority === 'high'
                            ? 'bg-red-500/20 text-red-200'
                            : log.priority === 'normal'
                              ? 'bg-amber-400/10 text-amber-200'
                              : 'bg-emerald-400/10 text-emerald-200'
                        }`}
                      >
                        {log.priority === 'high'
                          ? 'Mức độ khẩn'
                          : log.priority === 'normal'
                            ? 'Mức độ trung bình'
                            : 'Tự động hóa'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-950 p-6 shadow-xl shadow-emerald-900/30 backdrop-blur">
              <h2 className="text-lg font-semibold text-white">Đội ngũ đang trực</h2>
              <p className="mt-1 text-xs text-slate-300">Thông tin ca trực cập nhật tự động từ hệ thống nhân sự</p>
              <div className="mt-5 space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{member.name}</p>
                      <p className="text-xs text-slate-300">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-emerald-200">{member.status}</p>
                      <p className="text-[11px] text-slate-400">{member.shift}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Trung tâm cảnh báo</h2>
              <button className="text-xs font-semibold text-emerald-200 hover:text-emerald-100">Cấu hình</button>
            </div>
            <div className="mt-5 space-y-4">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.title}
                  className={`rounded-2xl border px-4 py-4 text-sm transition ${
                    alert.severity === 'critical'
                      ? 'border-red-500/40 bg-red-500/10 text-red-100'
                      : alert.severity === 'warning'
                        ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
                        : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
                  }`}
                >
                  <h3 className="text-base font-semibold text-white">{alert.title}</h3>
                  <p className="mt-1 text-sm">{alert.description}</p>
                  <button className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white">
                    Xem chi tiết
                    <span aria-hidden>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Tự động hóa quy trình</h2>
                <p className="text-xs text-slate-400">Theo dõi trạng thái kịch bản đang hoạt động</p>
              </div>
              <button className="rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300 hover:text-emerald-100">
                Tạo kịch bản mới
              </button>
            </div>
            <div className="grid gap-6 px-8 py-6 md:grid-cols-2">
              {automationRules.map((rule) => (
                <div key={rule.name} className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-inner shadow-black/40">
                  <p className="text-sm font-semibold text-white">{rule.name}</p>
                  <p className="mt-2 text-sm text-slate-300">{rule.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>Cập nhật: {rule.updatedAt}</span>
                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                      {rule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

