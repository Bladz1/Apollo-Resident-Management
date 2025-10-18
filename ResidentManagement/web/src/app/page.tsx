
import ScrollToTop from "@/utils/scroll_to_top";
import HeroStyles from "@/utils/styles";
import Styles from "@/utils/styles";

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
  //  useEffect(() => {
  //   // Nếu URL đang có hash thì xóa để tránh trình duyệt tự nhảy khi reload lần sau
  //   if (typeof window !== 'undefined' && window.location.hash) {
  //     window.scrollTo(0, 0);
  //     history.replaceState(null, '', window.location.pathname + window.location.search);
  //   }

  //   // Tìm tất cả các button có class 'scroll-button'
  //   const scrollButtons = document.querySelectorAll('.scroll-button');

  //   // Hàm xử lý sự kiện click
  //   const handleScroll = (event: MouseEvent) => {
  //     // Ngăn hành vi mặc định (thay đổi URL) -> Giải quyết lỗi refresh
  //     event.preventDefault();

  //     const targetId = (event.currentTarget as HTMLAnchorElement).getAttribute('href');
  //     if (!targetId) return;

  //     const targetElement = document.querySelector(targetId);

  //     // Cuộn mượt mà đến mục tiêu
  //     if (targetElement) {
  //       targetElement.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'start'
  //       });

  //       // Xóa hash khỏi URL để lần reload sau trình duyệt không tự cuộn
  //       history.replaceState(null, '', window.location.pathname + window.location.search);
  //     }
  //   };

  //   // Gán sự kiện cho từng button
  //   scrollButtons.forEach(button => {
  //     button.addEventListener('click', handleScroll as EventListener);
  //   });

  //   // Rất quan trọng: Dọn dẹp event listener khi component bị hủy
  //   return () => {
  //     scrollButtons.forEach(button => {
  //       button.removeEventListener('click', handleScroll as EventListener);
  //     });
  //   };
  // }, []); // Mảng rỗng [] nghĩa là useEffect này chỉ chạy 1 lần duy nhất
  return (
  <div>
    <HeroStyles></HeroStyles>
    <ScrollToTop></ScrollToTop>
    <div className="relative overflow-hidden bg-slate-950 text-slate-50">
      <section className="relative hero-spotlight">
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-grid" aria-hidden />
          <div className="hero-orb orb-1" aria-hidden />
          <div className="hero-orb orb-2" aria-hidden />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200 backdrop-blur">
              Hệ thống Quản lý dân cư quốc gia
            </span>
            <h1 className="text-3xl md:text-5xl  leading-tight text-balance">
              Tiện lợi, an toàn và minh bạch trong mọi thủ tục cư trú
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-slate-200">
              Cổng thông tin chính thức hỗ trợ người dân thực hiện thủ tục hộ khẩu, tạm trú, khai báo tạm vắng và tra cứu thông tin dân cư nhanh chóng.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/login"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-6 py-3 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Đăng nhập hệ thống
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
                <span className="absolute inset-0 translate-y-full bg-white/60 transition-transform duration-500 group-hover:translate-y-0" />
              </a>
              <a
                href="#support"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition duration-300 hover:border-white hover:bg-white/10"
              >
                Trung tâm hỗ trợ
                <span aria-hidden className="animate-pulse">✦</span>
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {[{ label: 'Hồ sơ xử lý trong ngày', value: '4.512' }, { label: 'Tỷ lệ đúng hạn', value: '98%' }, { label: 'Hotline hỗ trợ', value: '1800 1096' }].map(
                (stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-white/40 hover:bg-white/10">
                    <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="relative">
            <div className="feature-card animate-float">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-500/20 text-2xl">🔐</span>
                <div>
                  <p className="text-sm text-red-200">Trạng thái an toàn</p>
                  <p className="text-lg font-semibold">Bảo mật cấp Nhà nước</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-200">
                Dữ liệu cư trú được mã hóa đầu cuối và bảo vệ bởi hạ tầng đạt chuẩn ISO 27001.
              </p>
            </div>
            <div className="feature-card absolute -bottom-10 left-8 w-[85%] animate-float-delayed">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-2xl">⚡</span>
                <div>
                  <p className="text-sm text-emerald-200">Hiệu suất xử lý</p>
                  <p className="text-lg font-semibold">Tự động hóa 70% thao tác</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-200">
                Hệ thống gợi ý biểu mẫu, kiểm tra dữ liệu và gửi thông báo tiến độ theo thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-slate-900/60">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h2 className="section-title">
            <span className="section-icon">⚠️</span>
            Cảnh báo và Thông báo quan trọng
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {alerts.map((alert, index) => (
              <article
                key={alert.title}
                className="group rounded-2xl border border-red-500/20 bg-red-500/10 p-6 shadow-lg shadow-red-900/20 transition duration-500 hover:translate-y-[-6px] hover:border-red-400/60 hover:bg-red-500/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-200">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-500/30 text-xs">{alert.level}</span>
                  {alert.title}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-100">{alert.content}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="section-title">
            <span className="section-icon">📰</span>
            Tin tức và cập nhật hệ thống
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {news.map((item, index) => (
              <article
                key={item.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-white/40 hover:bg-white/10"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-200">{item.date}</p>
                <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-rose-200">{item.title}</h3>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed">{item.description}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-rose-200 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Xem chi tiết
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 bg-slate-950/90">
        <div className="absolute inset-0 hero-grid" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h2 className="section-title">
            <span className="section-icon">🛠️</span>
            Hướng dẫn sử dụng dành cho người dân
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-500 hover:-translate-y-2 hover:border-amber-300/60 hover:bg-white/10"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-200">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="support" className="relative bg-gradient-to-r from-amber-400/20 via-transparent to-red-500/20">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">Cần hỗ trợ thêm?</p>
              <h2 className="text-2xl font-bold text-white">Đội ngũ chăm sóc luôn sẵn sàng 24/7</h2>
              <p className="text-sm text-slate-200">
                Nhận tư vấn về quy trình cư trú, báo cáo sự cố hoặc gửi góp ý trực tiếp đến cán bộ quản lý. Tất cả yêu cầu đều được phản hồi trong vòng 15 phút.
              </p>
            </div>
            <div className="grid gap-4 text-sm text-slate-100">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <span>Hotline phản ánh</span>
                <strong className="text-lg">1800 1096</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <span>Email hỗ trợ</span>
                <strong className="text-lg">hotro@quanlycuutru.gov.vn</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}

