'use client';

import React, { useSyncExternalStore } from 'react';
import LoginCtaButton from "@/components/auth/LoginCtaButton";
import ScrollToTop from "@/utils/scroll_to_top";
import styles from "./custom_css/css.module.css";
import Image from "next/image";
import alerts from "./data/alerts_data";
import news from "./data/news_data";
import steps from "./data/steps_data";
import UserWelcome from "@/components/auth/UserWelcome";

// Import màn hình chờ
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Home() {
  const hasVisited = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') {
        return () => { };
      }

      const handler = () => callback();
      window.addEventListener('hasVisitedPortfolio', handler);

      return () => window.removeEventListener('hasVisitedPortfolio', handler);
    },
    () => typeof window !== 'undefined' && sessionStorage.getItem('hasVisitedPortfolio') === 'true',
    () => false,
  );

  // 1. Kiểm soát hiển thị dựa trên trạng thái đã xem
  const showWelcome = !hasVisited;
  const showContent = hasVisited;

  const handleWelcomeComplete = () => {
    // 3. Khi Welcome chạy xong -> Lưu vào bộ nhớ là "Đã xem"
    sessionStorage.setItem('hasVisitedPortfolio', 'true');
    window.dispatchEvent(new Event('hasVisitedPortfolio'));
  };

  return (
    <main>
      {/* 4. Chỉ hiện Welcome khi biến showWelcome = true */}
      {showWelcome && (
        <WelcomeScreen onLoadingComplete={handleWelcomeComplete} />
      )}

      {/* 5. Nội dung chính - Always compile so images load behind the screen */}
      <div className={showWelcome ? "h-screen overflow-hidden" : "animate-[fadeIn_1s_ease-in-out]"}>
        {/* --- BẮT ĐẦU NỘI DUNG CŨ CỦA BẠN --- */}
        <ScrollToTop></ScrollToTop>
        <div className="relative overflow-hidden bg-slate-950 text-slate-50">
          <section className={`relative ${styles["hero-spotlight"]}`}>
            <div className="absolute inset-0 overflow-hidden">
              <div className={`${styles["hero-grid"]}`} aria-hidden />
              <div className={`${styles["hero-orb"]} ${styles["orb-1"]}`} aria-hidden />
              <div className={`${styles["hero-orb"]} ${styles["orb-2"]}`} aria-hidden />
            </div>

            <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <div className={`space-y-6 text-center lg:text-left ${styles["animate-fade-in"]}`}>
                <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-200 backdrop-blur">
                  Hệ thống Quản lý dân cư quốc gia
                </span>
                <h1 className="text-2xl leading-snug text-balance sm:text-3xl md:text-5xl">
                  Tiện lợi, an toàn và minh bạch trong mọi thủ tục cư trú
                </h1>
                <p className="mx-auto max-w-2xl text-sm text-slate-200 sm:text-base md:text-lg lg:mx-0">
                  Cổng thông tin chính thức hỗ trợ người dân thực hiện thủ tục hộ khẩu, tạm trú, khai báo tạm vắng và tra cứu thông tin dân cư nhanh chóng.
                </p>
                <UserWelcome className="mx-auto text-sm text-amber-200 sm:text-base md:text-lg lg:mx-0" />
                <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
                  <LoginCtaButton />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                  {[{ label: 'Hồ sơ xử lý trong ngày', value: '4.512' }, { label: 'Tỷ lệ đúng hạn', value: '98%' }, { label: 'Hotline hỗ trợ', value: '1800 1096' }].map(
                    (stat) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur transition hover:border-white/40 hover:bg-white/10 sm:p-6 sm:text-left">
                        <p className="text-xs uppercase tracking-wide text-slate-300">{stat.label}</p>
                        <p className="mt-2 text-xl font-bold text-white sm:text-2xl">{stat.value}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="relative flex flex-col items-center gap-6 lg:items-start">
                <div
                  className={`${styles["feature-card"]} ${styles["feature-card-primary"]} ${styles["animate-float"]} flex flex-col items-center justify-center relative py-6 px-6`}
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
                      className="w-full max-w-[220px] rounded-xl object-contain sm:max-w-[280px]"
                    />
                  </div>
                </div>

                <div className={`${styles["feature-card"]} ${styles["feature-card-secondary"]} ${styles["animate-float-delayed"]} w-full p-4 lg:absolute lg:-bottom-10 lg:left-8`}>
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                    <Image
                      src="/images/sv.png"
                      alt="Đơn giản hóa mọi thủ tục hành chính"
                      width={180}
                      height={180}
                      className="h-auto w-32 flex-shrink-0 rounded-xl object-cover sm:h-[140px] sm:w-[180px]"
                    />
                    <div className="flex flex-1 flex-col justify-center text-center sm:h-[140px] sm:text-left">
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

          <section className="relative  bg-white">
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className={styles["section-title"]}>
                <span className={styles["section-icon"]}>⚠️</span>
                Cảnh báo và Thông báo quan trọng
              </h2>

              <div className={`grid gap-6 md:grid-cols-2 ${styles["wrapper"]}`}>
                {alerts.map((alert, index) => (
                  <article
                    key={alert.title}
                    className="group rounded-2xl border border-red-300 bg-white p-6 shadow transition duration-500 hover:-translate-y-1 hover:border-red-500"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold uppercase text-black">
                      {alert.title}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">
                      {alert.content}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="relative bg-white border-white">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className={styles["section-title"]}>
                <span className={styles["section-icon"]}>📰</span>
                Tin tức và cập nhật hệ thống
              </h2>

              <div className="grid gap-6 lg:grid-cols-3">
                {news.map((item, index) => (
                  <article
                    key={item.title}
                    className="group rounded-2xl border border-red-300 bg-white p-6 transition duration-500 hover:-translate-y-1 hover:border-red-500"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <p className="text-xs font-semibold uppercase text-gray-500">
                      {item.date}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold text-black">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="relative  bg-white">
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
              <h2 className={styles["section-title"]}>
                <span className={styles["section-icon"]}>🛠️</span>
                Hướng dẫn sử dụng dành cho người dân
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                {steps.map((step, index) => (
                  <article
                    key={step.title}
                    className="rounded-2xl border border-red-300 bg-white p-6 transition duration-500 hover:-translate-y-1 hover:border-red-500"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <h3 className="text-lg font-semibold text-black">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">
                      {step.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="support" className="relative bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
              <div className="grid gap-8 rounded-3xl bg-white p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase text-gray-500">
                    Cần hỗ trợ thêm?
                  </p>
                  <h2 className="text-2xl font-bold text-black">
                    Đội ngũ chăm sóc luôn sẵn sàng 24/7
                  </h2>
                  <p className="text-sm text-gray-700">
                    Nhận tư vấn về quy trình cư trú, báo cáo sự cố hoặc gửi góp ý trực tiếp đến
                    cán bộ quản lý.
                  </p>
                </div>

                <div className="grid gap-4 text-sm text-black">
                  <div className="flex flex-col items-start gap-2 rounded-2xl border border-gray-300 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium">Hotline phản ánh</span>
                    <strong className="text-lg">1800 1096</strong>
                  </div>
                  <div className="flex flex-col items-start gap-2 rounded-2xl border border-gray-300 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-medium">Email hỗ trợ</span>
                    <strong className="text-lg break-words">
                      hotro@quanlycuutru.gov.vn
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {/* --- KẾT THÚC NỘI DUNG CŨ --- */}
      </div>
    </main>
  );
}
