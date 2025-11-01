import Link from "next/link";

import { services, wantedPersons } from "../data";

const wantedService = services.find((service) => service.id === "truy-na");

export default function WantedInformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-gradient-to-r from-red-900/85 via-slate-950 to-amber-900/40 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Thông tin truy nã</p>
            <h1 className="mt-3 text-3xl md:text-4xl">{wantedService?.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">{wantedService?.description}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-amber-300/60 px-5 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/10"
          >
            ← Quay lại trang dịch vụ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <section className="space-y-6">
          <div className="rounded-3xl border border-amber-300/60 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <h2 className="text-xl font-semibold text-amber-200">Danh sách đối tượng cần truy tìm</h2>
            <p className="mt-2 text-sm text-slate-200">
              Khi phát hiện thông tin liên quan, hãy liên hệ đường dây nóng <span className="font-semibold">113</span> hoặc gửi
              báo cáo ẩn danh qua cổng thông tin. Mọi dữ liệu cung cấp sẽ được bảo mật tuyệt đối.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {wantedPersons.map((person) => (
              <article
                key={person.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/65 p-5 shadow-xl shadow-black/40 transition hover:-translate-y-1 hover:border-amber-300/60"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="h-24 w-24 rounded-2xl object-cover shadow-lg shadow-black/40"
                  />
                  <div>
                    <p className="text-lg font-semibold text-white">{person.name}</p>
                    <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">{person.alias}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-semibold text-amber-200">Tội danh:</span> {person.crime}
                  </p>
                  <p>
                    <span className="font-semibold text-amber-200">Lần xuất hiện gần nhất:</span> {person.lastSeen}
                  </p>
                  {person.bounty && (
                    <p className="rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-200">
                      {person.bounty}
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-300">
                  Ghi nhớ: Không tự ý tiếp cận đối tượng. Hãy cung cấp thông tin cho cơ quan chức năng thông qua đường dây nóng
                  hoặc kênh báo cáo trực tuyến.
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
