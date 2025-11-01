import Link from "next/link";

import { notifications, services } from "../data";

const notificationService = services.find((service) => service.id === "thong-bao");

export default function NotificationServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-gradient-to-r from-red-900/85 via-slate-950 to-amber-900/40">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Bản tin hằng ngày</p>
            <h1 className="mt-3 text-3xl md:text-4xl">{notificationService?.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">{notificationService?.description}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-amber-300/60 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/10"
          >
            ← Quay lại trang dịch vụ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">
        <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-amber-200">Thông tin đáng chú ý trong ngày</h2>
              <p className="mt-1 text-sm text-slate-300">
                Cập nhật nhanh các thông báo quan trọng liên quan tới cư trú, giấy tờ và cảnh báo an ninh.
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:-translate-y-0.5">
              Đăng ký nhận thông báo
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-900/65 p-5 shadow-lg shadow-black/40 transition hover:border-amber-300/60"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">{notification.timestamp}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-100">{notification.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{notification.summary}</p>
                </div>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-amber-200 transition hover:text-amber-100"
                >
                  Xem chi tiết →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
          <h2 className="text-lg font-semibold text-amber-200">Các kênh tiếp nhận thông báo</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            <li className="rounded-2xl border border-white/10 bg-slate-900/65 p-4 text-sm text-slate-300">
              <p className="font-semibold text-amber-200">Email</p>
              <p className="mt-2 text-slate-300">Nhận bản tin tổng hợp mỗi sáng với những thay đổi quan trọng.</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-slate-900/65 p-4 text-sm text-slate-300">
              <p className="font-semibold text-amber-200">SMS</p>
              <p className="mt-2 text-slate-300">Nhận tin nhắn khẩn cấp về cư trú, truy nã hoặc thiên tai.</p>
            </li>
            <li className="rounded-2xl border border-white/10 bg-slate-900/65 p-4 text-sm text-slate-300">
              <p className="font-semibold text-amber-200">Ứng dụng di động</p>
              <p className="mt-2 text-slate-300">Theo dõi và quản lý thông báo theo thời gian thực trên điện thoại.</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
