
import ScrollToTop from "@/utils/scroll_to_top";
import styles from "./custom_css/css.module.css";
import alerts from "./data/alerts_data";
import news from "./data/news_data";
import steps from "./data/steps_data";
import UserWelcome from "@/components/auth/UserWelcome";
import CityHologram from "@/components/interactive/CityHologram";

const commandHighlights = [
  {
    tag: "Realtime",
    title: "Trực quan hóa 3D",
    description:
      "Toàn bộ hoạt động cư trú được dựng mô hình 3 chiều và cập nhật từng mili-giây giúp cán bộ dễ dàng quan sát.",
  },
  {
    tag: "Insight",
    title: "Phân tích ngữ cảnh",
    description:
      "Trí tuệ nhân tạo phát hiện bất thường từ dòng dữ liệu, gợi ý hành động tức thời và cảnh báo theo mức ưu tiên.",
  },
  {
    tag: "Automation",
    title: "Điều phối quy trình",
    description:
      "Các biểu mẫu và nhiệm vụ được tự động phân tuyến đến cơ quan phụ trách, hạn chế tối đa thao tác thủ công.",
  },
  {
    tag: "Trust",
    title: "Xác thực đa lớp",
    description:
      "Chuẩn bảo mật Zero Trust, sinh trắc học và xác thực hành vi đảm bảo dữ liệu cư dân luôn an toàn tuyệt đối.",
  },
];

const immersivePanels = [
  {
    icon: "🛰️",
    title: "Quét vệ tinh khu vực",
    description:
      "Kết hợp dữ liệu GIS và cảm biến để theo dõi biến động dân cư, cảnh báo rủi ro thiên tai ngay trên giao diện 3D.",
    gradient: "from-rose-500/30 via-amber-400/10 to-red-500/20",
  },
  {
    icon: "💠",
    title: "Bảng điều khiển mô-đun",
    description:
      "Mỗi phân hệ cư trú là một khối lập thể có thể xoay kéo, bật/tắt lớp dữ liệu nhằm tập trung vào chỉ số quan trọng.",
    gradient: "from-sky-500/30 via-purple-500/20 to-indigo-500/10",
  },
  {
    icon: "📡",
    title: "Tín hiệu IoT",
    description:
      "Hàng ngàn thiết bị camera, cảm biến môi trường gửi dữ liệu về trung tâm, hiển thị bằng luồng sáng động.",
    gradient: "from-emerald-400/30 via-teal-400/10 to-cyan-500/20",
  },
  {
    icon: "🛡️",
    title: "Giám sát an ninh",
    description:
      "Tường lửa hành vi, bản đồ rủi ro và báo cáo tấn công mạng thể hiện dưới dạng lưới bảo vệ bao quanh thành phố số.",
    gradient: "from-red-500/25 via-rose-500/10 to-fuchsia-500/20",
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
    <ScrollToTop></ScrollToTop>
    <div className="relative overflow-hidden bg-slate-950 text-slate-50">
      <section className={`relative ${styles["hero-spotlight"]}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`${styles["hero-grid"]}`} aria-hidden />
          <div className={`${styles["hero-orb"]} ${styles["orb-1"]}`} aria-hidden />
          <div className={`${styles["hero-orb"]} ${styles["orb-2"]}`} aria-hidden />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className={`space-y-6 ${styles["animate-fade-in"]}`}>
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200 backdrop-blur">
              Hệ thống Quản lý dân cư quốc gia
            </span>
            <h1 className="text-3xl md:text-5xl leading-tight text-balance">
              Tiện lợi, an toàn và minh bạch trong mọi thủ tục cư trú
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-slate-200">
              Cổng thông tin chính thức hỗ trợ người dân thực hiện thủ tục hộ khẩu, tạm trú, khai báo tạm vắng và tra cứu thông tin dân cư nhanh chóng.
            </p>
            <UserWelcome className="text-base md:text-lg text-amber-200" />
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
                <span aria-hidden className={`${styles["animate-pulse"]}`}>✦</span>
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

          <div className="relative space-y-6">
            <CityHologram />
            <div className="grid gap-4 sm:grid-cols-2">
              {commandHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-500 hover:-translate-y-1 hover:border-amber-300/60 hover:bg-white/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                    {item.tag}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-200">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-slate-950">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 20% -10%, rgba(248, 113, 113, 0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(253, 224, 71, 0.12), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-6">
            <span className={styles["immersive-badge"]}>Trung tâm điều hành ảo</span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Tái hiện hạ tầng cư trú trong không gian 3D
            </h2>
            <p className="text-base md:text-lg text-slate-200">
              Không chỉ là giao diện web, hệ thống hiển thị một thành phố số với các lớp dữ liệu được dựng 3 chiều, cho phép xoay,
              phóng to và theo dõi trạng thái từng phân hệ ngay lập tức.
            </p>
            <ul className="grid gap-3 text-sm text-slate-200/90">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-300">✦</span>
                Bản đồ nhiệt cư trú, tần suất xử lý hồ sơ và lưu lượng người dân hiển thị bằng luồng sáng động.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-300">✦</span>
                Tích hợp thiết bị IoT và camera AI, mỗi tín hiệu bất thường lập tức tạo hiệu ứng rung trên mô hình.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-amber-300">✦</span>
                Phối hợp giữa các sở ngành thông qua chế độ trình chiếu cùng lúc nhiều lớp dữ liệu chuyên biệt.
              </li>
            </ul>
          </div>
          <div className={styles["immersive-grid"]}>
            {immersivePanels.map((panel) => (
              <article
                key={panel.title}
                className={`${styles["immersive-card"]} bg-gradient-to-br ${panel.gradient}`}
              >
                <span className={styles["immersive-icon"]}>{panel.icon}</span>
                <h3 className={styles["immersive-heading"]}>{panel.title}</h3>
                <p className={styles["immersive-desc"]}>{panel.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-slate-900/60">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h2 className={`${styles["section-title"]}`}>
            <span className={`${styles["section-icon"]}`}>⚠️</span>
            Cảnh báo và Thông báo quan trọng
          </h2>
          <div className={`grid gap-6 md:grid-cols-2 ${styles["wrapper"]}`}>
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
          <h2 className={`${styles["section-title"]}`}>
            <span className={`${styles["section-icon"]}`}>📰</span>
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
        <div className={`absolute inset-0 ${styles["hero-grid"]}`} aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h2 className={`${styles["section-title"]}`}>
            <span className={`${styles["section-icon"]}`}>🛠️</span>
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

