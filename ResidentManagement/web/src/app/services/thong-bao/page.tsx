import Link from "next/link";

import { notifications, services } from "../data";

const notificationService = services.find((service) => service.id === "thong-bao");

export default function NotificationServicePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-gradient-to-br from-red-900 via-red-700 to-red-500 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-100">Bản tin hằng ngày</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">{notificationService?.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-red-50 md:text-base">{notificationService?.description}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ← Quay lại trang dịch vụ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">
        <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-xl shadow-red-200/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-red-800">Thông tin đáng chú ý trong ngày</h2>
              <p className="mt-1 text-sm text-slate-600">
                Cập nhật nhanh các thông báo quan trọng liên quan tới cư trú, giấy tờ và cảnh báo an ninh.
              </p>
            </div>
            <button className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-red-300 transition hover:bg-red-700">
              Đăng ký nhận thông báo
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-gradient-to-b from-white via-white to-red-50 p-5 shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-500">{notification.timestamp}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{notification.title}</h3>
                  <p className="mt-3 text-sm text-slate-700">{notification.summary}</p>
                </div>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center text-sm font-semibold text-red-600 transition hover:text-red-700"
                >
                  Xem chi tiết →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
          <h2 className="text-lg font-semibold text-slate-900">Các kênh tiếp nhận thông báo</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-red-700">Email</p>
              <p className="mt-2 text-slate-600">Nhận bản tin tổng hợp mỗi sáng với những thay đổi quan trọng.</p>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-red-700">SMS</p>
              <p className="mt-2 text-slate-600">Nhận tin nhắn khẩn cấp về cư trú, truy nã hoặc thiên tai.</p>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-red-700">Ứng dụng di động</p>
              <p className="mt-2 text-slate-600">Theo dõi và quản lý thông báo theo thời gian thực trên điện thoại.</p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
