import Link from "next/link";
import styles from "../custom_css/css.module.css";
import { services } from "./data";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
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

      <nav className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-6 px-6 py-4 text-sm">
          {services.map((service) => (
            <div key={service.id} className="group relative">
              <Link
                href={`#${service.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold text-amber-200 transition hover:border-amber-300/80 hover:bg-amber-300/10"
              >
                {service.name}
              </Link>
              <div className="invisible absolute left-0 top-full mt-3 w-72 translate-y-2 rounded-2xl border border-white/10 bg-slate-950/95 p-4 text-slate-200 opacity-0 shadow-2xl shadow-amber-500/10 backdrop-blur transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-white">Tính năng nổi bật</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-300">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-amber-300">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <section className="border-b border-white/10 bg-slate-950/80">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <form className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30 backdrop-blur md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="global-search" className="block text-sm font-semibold text-slate-100">
                Tìm kiếm nhanh
              </label>
              <input
                id="global-search"
                type="search"
                placeholder="Nhập từ khóa: số hồ sơ, tên dịch vụ, mã thông báo..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white shadow-inner shadow-black/30 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-400/60 h-12"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 px-6 py-3 text-sm font-semibold text-red-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-amber-200 h-12"
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
            className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-200 shadow-xl shadow-black/30 backdrop-blur transition hover:-translate-y-1 hover:border-amber-300/70 hover:bg-white/10"
          >
            <h2 className="text-xl font-semibold text-white">{service.name}</h2>
            <p className="mt-3 text-sm text-slate-300">{service.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-300/20 text-xs font-semibold text-amber-200">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between text-sm text-slate-200">
              <Link
                href={`/services/${service.id}`}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 font-medium text-amber-200 transition hover:border-amber-300/80 hover:bg-amber-300/10"
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
