const alerts = [
  {
    title: 'Cảnh báo bảo mật tài khoản',
    content:
      'Tuyệt đối không chia sẻ mã OTP, mật khẩu hoặc thông tin cá nhân với bất kỳ ai. Hệ thống không bao giờ yêu cầu người dùng cung cấp thông tin nhạy cảm qua điện thoại.',
    level: 'Khẩn',
  },
  {
    title: 'Bảo trì hệ thống định kỳ',
    content:
      'Hệ thống sẽ tạm ngưng từ 22:00 đến 23:30 ngày 25/05 để nâng cấp hạ tầng. Vui lòng chủ động thực hiện các giao dịch quan trọng trước thời gian này.',
    level: 'Thông báo',
  },
];

const news = [
  {
    title: 'Ra mắt tính năng tra cứu hồ sơ trực tuyến',
    date: '20/05/2025',
    description:
      'Người dân có thể theo dõi tiến độ xử lý hồ sơ cư trú trực tuyến mà không cần đến trực tiếp cơ quan hành chính.',
  },
  {
    title: 'Tích hợp chữ ký số trong đăng ký tạm trú',
    date: '18/05/2025',
    description:
      'Hệ thống hỗ trợ ký số đối với các thủ tục đăng ký tạm trú, giúp giảm thời gian chờ xử lý hồ sơ.',
  },
  {
    title: 'Tập huấn cán bộ quản trị dữ liệu dân cư',
    date: '15/05/2025',
    description:
      'Bộ phận quản trị được đào tạo chuyên sâu về an toàn thông tin và quy trình chuẩn hóa dữ liệu dân cư.',
  },
];

const steps = [
  {
    title: '1. Đăng ký tài khoản',
    detail:
      'Sử dụng số CCCD gắn chip và số điện thoại đã đăng ký để tạo tài khoản truy cập hệ thống. Mỗi người dân chỉ có một tài khoản duy nhất.',
  },
  {
    title: '2. Xác thực danh tính',
    detail:
      'Hoàn tất xác thực qua ứng dụng VNeID hoặc đến cơ quan công an gần nhất để kích hoạt đầy đủ quyền hạn sử dụng.',
  },
  {
    title: '3. Sử dụng dịch vụ',
    detail:
      'Tra cứu thông tin hộ khẩu, đăng ký tạm trú, cập nhật nhân khẩu và theo dõi hồ sơ trực tuyến ngay sau khi đăng nhập.',
  },
];

export default function Home() {
  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-red-900 via-red-700 to-red-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block uppercase tracking-wide text-yellow-300 text-sm font-semibold mb-3">
              Hệ thống Quản lý dân cư quốc gia
            </span>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Tiện lợi, an toàn và minh bạch trong mọi thủ tục cư trú
            </h1>
            <p className="text-base md:text-lg text-red-100 mb-6">
              Cổng thông tin chính thức hỗ trợ người dân thực hiện thủ tục hộ khẩu, tạm trú, khai báo tạm vắng và tra cứu thông tin dân cư nhanh chóng.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/login"
                className="bg-yellow-400 text-red-900 font-semibold px-5 py-3 rounded-lg shadow hover:bg-yellow-300 transition"
              >
                Đăng nhập hệ thống
              </a>
              <a
                href="/support"
                className="border border-white px-5 py-3 rounded-lg hover:bg-white/10 transition"
              >
                Trung tâm hỗ trợ
              </a>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Thống kê nhanh</h2>
            <ul className="space-y-3 text-red-50">
              <li className="flex items-center justify-between">
                <span>Hồ sơ xử lý trong ngày</span>
                <strong>4.512</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Tỷ lệ giải quyết đúng hạn</span>
                <strong>98%</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Đường dây nóng hỗ trợ</span>
                <strong>1800 1096</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">⚠️</span>
          Cảnh báo và Thông báo quan trọng
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {alerts.map((alert) => (
            <article
              key={alert.title}
              className="bg-white border-l-4 border-red-700 rounded-lg shadow p-5"
            >
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                [{alert.level}] {alert.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{alert.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
            <span className="mr-3 text-3xl">📰</span>
            Tin tức và cập nhật hệ thống
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.title}
                className="bg-red-50 border border-red-100 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-sm text-red-700 font-semibold uppercase tracking-wide mb-2">
                  {item.date}
                </p>
                <h3 className="text-lg font-bold text-red-900 mb-3">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
          <span className="mr-3 text-3xl">🛠️</span>
          Hướng dẫn sử dụng dành cho người dân
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className="bg-white rounded-xl shadow p-6 border border-red-100"
            >
              <h3 className="text-lg font-semibold text-red-800 mb-3">{step.title}</h3>
              <p className="text-gray-700 leading-relaxed">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

