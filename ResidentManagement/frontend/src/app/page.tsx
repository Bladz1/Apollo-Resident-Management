
import LoginCtaButton from "@/components/auth/LoginCtaButton";
import ScrollToTop from "@/utils/scroll_to_top";
import styles from "./custom_css/css.module.css";
import Image from "next/image";
import alerts from "./data/alerts_data"
import news from "./data/news_data";
import steps from "./data/steps_data";
import UserWelcome from "@/components/auth/UserWelcome";

export default function Home() {
  
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
                <LoginCtaButton />
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

            <div className="relative">
              <div
                className={`${styles["feature-card"]} ${styles["animate-float"]} flex flex-col items-center justify-center relative py-6 px-6 w-[320px]`}
              >
                <p className="text-lg font-semibold text-center text-red-200 mb-4">
                  Tích hợp đa dạng tiện ích
                </p>
                <div className="w-full flex justify-center">
                  <Image
                    src="/images/7.png"
                    alt="Tích hợp đa dạng tiện ích"
                    width={280}
                    height={180}
                    className="rounded-xl  object-contain"
                    style={{ maxWidth: '280px', height: 'auto' }}
                  />
                </div>
              </div>

              <div className={`${styles["feature-card"]} absolute -bottom-10 left-8 w-[400px] ${styles["animate-float-delayed"]} p-4`}>
                <div className="flex gap-6 items-center">
                  <Image
                    src="/images/sv.png"
                    alt="Đơn giản hóa mọi thủ tục hành chính"
                    width={180}
                    height={180}
                    className="rounded-xl object-cover flex-shrink-0"
                    style={{ width: '180px', height: '140px' }}
                  />
                  <div className="flex-1 h-[140px] flex flex-col justify-center">
                    <p className="font-semibold text-lg text-red-200 mb-3">Đơn giản hóa</p>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      Sử dụng định danh điện tử thay thế các loại giấy tờ truyền thống, không phải kê khai biểu mẫu giấy.
                    </p>
                  </div>
                </div>
              </div>
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

