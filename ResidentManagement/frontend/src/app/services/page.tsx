import Link from "next/link";
import styles from "../custom_css/css.module.css";
import { services } from "./data";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <section
        className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 ${styles["hero-spotlight1"]}`}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-transparent to-amber-500/30 mix-blend-screen"
          aria-hidden
        />

        <div className="relative mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200">Dịch vụ trực tuyến</p>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">Cổng thông tin dịch vụ công dân</h1>
          <p className="mt-3 max-w-2xl text-base text-slate-200 md:text-lg">
            Truy cập nhanh các dịch vụ hồ sơ sức khỏe, thông báo cư trú, tiếp nhận kiến nghị phản ánh và tra cứu thông tin truy
            nã.
          </p>
        </div>
      </section>




      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <form className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-4 shadow md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="global-search" className="block text-sm font-semibold text-gray-800">
                Tìm kiếm nhanh
              </label>
              <input
                id="global-search"
                type="search"
                placeholder="Nhập từ khóa: số hồ sơ, tên dịch vụ, mã thông báo..."
                className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-red-0"
              />
            </div>

            <button
              type="submit"
              className="h-12 inline-flex items-center justify-center rounded-xl bg-red-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-12 md:grid-cols-2 bg-white">
        {services.map((service) => (
          <article
            key={service.id}
            id={service.id}
            className="group relative overflow-hidden rounded-3xl border border-red-300 p-6 shadow-lg transition hover:-translate-y-1 hover:border-red-500 hover:shadow-xl min-h-[380px] flex flex-col justify-end"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${service.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 flex via-slate-900/80 to-transparent opacity-90 transition duration-500 group-hover:opacity-100" />

            <div className="relative z-10 mt-auto flex flex-col gap-3">
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                {service.name}
              </h2>

              <p className="text-sm text-gray-200 drop-shadow leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2 text-sm text-gray-200 mt-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-600/80 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                      ✓
                    </span>
                    <span className="drop-shadow-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex items-center justify-start text-sm">
                <Link
                  href={`/services/${service.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-red-400/50 bg-red-600/90 px-6 py-2.5 font-semibold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-red-500 hover:border-red-400"
                >
                  Bắt đầu ngay
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

    </div>
  );
}
