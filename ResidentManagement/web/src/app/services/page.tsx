import Link from "next/link";

import { services } from "./data";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-red-900 via-red-700 to-red-500 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-red-100">Dịch vụ trực tuyến</p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Cổng thông tin dịch vụ công dân</h1>
          <p className="mt-3 max-w-2xl text-base text-red-100 md:text-lg">
            Truy cập nhanh các dịch vụ hồ sơ sức khỏe, thông báo cư trú, tiếp nhận kiến nghị phản ánh và tra cứu thông tin truy
            nã.
          </p>
        </div>
      </section>

      <nav className="relative z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6 px-6 py-4">
          {services.map((service) => (
            <div key={service.id} className="group relative">
              <Link
                href={`#${service.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-800 transition hover:border-red-500 hover:bg-red-50"
              >
                {service.name}
              </Link>
              <div className="invisible absolute left-0 top-full mt-3 w-72 translate-y-2 rounded-2xl border border-slate-200 bg-white p-4 opacity-0 shadow-xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-slate-900">Tính năng nổi bật</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-red-500">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <form className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm md:flex-row md:items-center">
            <div className="flex-1">
              <label htmlFor="global-search" className="block text-sm font-medium text-slate-600">
                Tìm kiếm nhanh
              </label>
              <input
                id="global-search"
                type="search"
                placeholder="Nhập từ khóa: số hồ sơ, tên dịch vụ, mã thông báo..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            id={service.id}
            className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur transition hover:-translate-y-1 hover:border-red-400 hover:shadow-red-200"
          >
            <h2 className="text-xl font-semibold text-red-800">{service.name}</h2>
            <p className="mt-3 text-sm text-slate-600">{service.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link href={`/services/${service.id}`} className="font-semibold text-red-600 transition hover:text-red-700">
                Xem chi tiết
              </Link>
              <Link
                href={`/services/${service.id}`}
                className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 font-medium text-red-700 transition hover:border-red-500 hover:bg-red-50"
              >
                Bắt đầu ngay
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
