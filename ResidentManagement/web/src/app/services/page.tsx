"use client";

import Link from "next/link";
import { FormEvent, useMemo, useRef, useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
};

type WantedPerson = {
  id: string;
  name: string;
  alias: string;
  crime: string;
  bounty?: string;
  lastSeen: string;
  imageUrl: string;
};

type NotificationItem = {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
};

type PetitionFormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  content: string;
  captcha: string;
  attachment: File | null;
};

const services: Service[] = [
  {
    id: "nop-phi",
    name: "Thanh Toán",
    description:
      "Thanh toán trực tuyến các loại phí, lệ phí hành chính nhanh chóng, an toàn và tiện lợi.",
    features: ["Phí y tế  xã hội", "Phí hành chính công", "Phí giao thông"],
  },
  {
    id: "thong-bao",
    name: "Thông báo",
    description:
      "Nhận thông tin kịp thời từ cơ quan quản lý về các thủ tục cư trú, giấy tờ và cập nhật dân cư.",
    features: ["Thông báo sắp hết hạn giấy tờ", "Thông tin bảo trì hệ thống", "Tin nhắn từ cán bộ phụ trách"],
  },
  {
    id: "kien-nghi",
    name: "Kiến nghị & phản ánh",
    description:
      "Gửi phản ánh, kiến nghị trực tuyến và theo dõi tiến độ xử lý minh bạch, nhanh chóng.",
    features: ["Nộp kiến nghị trực tuyến", "Theo dõi trạng thái xử lý", "Nhận phản hồi chính thức"],
  },
  {
    id: "truy-na",
    name: "Thông tin truy nã",
    description:
      "Cập nhật danh sách đối tượng truy nã, hỗ trợ người dân chủ động phối hợp đảm bảo an ninh.",
    features: ["Danh sách đối tượng mới cập nhật", "Kênh tiếp nhận thông tin ẩn danh", "Số điện thoại đường dây nóng"],
  },
];

const wantedPersons: WantedPerson[] = [
  {
    id: "wp-01",
    name: "Nguyễn Văn Hùng",
    alias: "Hùng \"Đồng Nai\"",
    crime: "Liên quan đến vụ án cướp tài sản có vũ trang tại Đồng Nai (2024)",
    bounty: "Thưởng 200.000.000đ cho thông tin xác thực",
    lastSeen: "Xuất hiện lần cuối tại khu vực chợ đêm Đà Nẵng (04/2025)",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "wp-02",
    name: "Trần Thị Mỹ Dung",
    alias: "Dung \"Hoa Hồng\"",
    crime: "Cầm đầu đường dây lừa đảo tài chính xuyên quốc gia",
    bounty: "Thưởng 150.000.000đ cho thông tin giúp bắt giữ",
    lastSeen: "Nghi vấn di chuyển qua cửa khẩu Mộc Bài (03/2025)",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "wp-03",
    name: "Phạm Quốc Đạt",
    alias: "Đạt \"X"",
    crime: "Tổ chức sản xuất ma túy tổng hợp với quy mô lớn",
    bounty: "Thưởng 300.000.000đ và bảo mật danh tính người cung cấp",
    lastSeen: "Phát hiện di chuyển tại tuyến cao tốc Hà Nội - Lào Cai (05/2025)",
    imageUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
  },
];

const notifications: NotificationItem[] = [
  {
    id: "noti-01",
    title: "Bảo trì hệ thống cư trú điện tử",
    summary: "Cổng thông tin sẽ bảo trì từ 22:00 đến 23:30 ngày 28/05/2025. Các dịch vụ tạm thời gián đoạn.",
    timestamp: "Cập nhật 26/05/2025",
  },
  {
    id: "noti-02",
    title: "Nhắc nhở gia hạn tạm trú",
    summary: "Các hồ sơ tạm trú hết hạn trong tháng 6 cần hoàn tất gia hạn trước ngày 15/06 để tránh gián đoạn cư trú.",
    timestamp: "Cập nhật 25/05/2025",
  },
  {
    id: "noti-03",
    title: "Phát hiện lừa đảo giả mạo cán bộ",
    summary: "Cảnh báo các cuộc gọi yêu cầu cung cấp mã OTP để chiếm đoạt tài khoản dịch vụ công.",
    timestamp: "Cập nhật 23/05/2025",
  },
];

const initialPetitionState: PetitionFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  title: "",
  content: "",
  captcha: "",
  attachment: null,
};

const PETITION_CAPTCHA = "8ZFQ";

export default function ServicesPage() {
  const [showWantedList, setShowWantedList] = useState(false);
  const [petitionState, setPetitionState] = useState<PetitionFormState>(initialPetitionState);
  const [petitionStatus, setPetitionStatus] = useState<"idle" | "success" | "error">("idle");
  const [petitionMessage, setPetitionMessage] = useState<string>(
    "Điền form trực tiếp trên trang và nhấn \"Gửi\" để hoàn tất kiến nghị.",
  );
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handlePetitionChange = <Field extends keyof PetitionFormState>(field: Field, value: PetitionFormState[Field]) => {
    setPetitionState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditorCommand = (command: "bold" | "italic" | "insertUnorderedList") => {
    if (typeof document === "undefined") return;

    document.execCommand(command);
    if (editorRef.current) {
      handlePetitionChange("content", editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    handlePetitionChange("content", editorRef.current.innerHTML);
  };

  const handlePetitionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (petitionState.captcha.trim().toUpperCase() !== PETITION_CAPTCHA) {
      setPetitionStatus("error");
      setPetitionMessage("Mã xác nhận chưa chính xác. Vui lòng kiểm tra và nhập lại.");
      return;
    }

    setPetitionStatus("success");
    setPetitionMessage(
      "Kiến nghị đã được ghi nhận. Hệ thống sẽ gửi email xác nhận nếu bạn cung cấp địa chỉ email hợp lệ.",
    );
  };

  const handlePetitionReset = () => {
    setPetitionState(initialPetitionState);
    setPetitionStatus("idle");
    setPetitionMessage("Điền form trực tiếp trên trang và nhấn \"Gửi\" để hoàn tất kiến nghị.");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const notificationColumns = useMemo(() => [notifications.slice(0, 2), notifications.slice(2)], []);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-red-900 via-red-700 to-red-500 text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-red-100">Dịch vụ trực tuyến</p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Cổng thông tin dịch vụ công dân</h1>
          <p className="mt-3 max-w-2xl text-base text-red-100 md:text-lg">
            Truy cập nhanh các dịch vụ hồ sơ sức khỏe, thông báo cư trú, tiếp nhận kiến nghị phản ánh và tra cứu thông tin truy nã.
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

            {service.id === "truy-na" && (
              <div className="mt-6 space-y-4">
                <button
                  type="button"
                  onClick={() => setShowWantedList((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-500 hover:bg-red-50"
                >
                  {showWantedList ? "Ẩn danh sách truy nã" : "Hiện danh sách truy nã"}
                </button>

                {showWantedList && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {wantedPersons.map((person) => (
                      <div
                        key={person.id}
                        className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50/70 p-4 text-sm text-slate-700 shadow-inner shadow-red-200"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={person.imageUrl}
                            alt={person.name}
                            className="h-20 w-20 rounded-xl object-cover shadow-md shadow-red-200"
                          />
                          <div>
                            <p className="text-base font-semibold text-red-900">{person.name}</p>
                            <p className="text-xs uppercase tracking-wide text-red-600">{person.alias}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <span className="font-semibold text-red-800">Tội danh:</span> {person.crime}
                          </p>
                          <p>
                            <span className="font-semibold text-red-800">Lần xuất hiện gần nhất:</span> {person.lastSeen}
                          </p>
                          {person.bounty && (
                            <p className="rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-red-700 shadow">
                              {person.bounty}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-red-700">
                          Mọi thông tin cung cấp sẽ được bảo mật tuyệt đối. Liên hệ đường dây nóng 113 hoặc gửi qua kênh ẩn danh.
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {service.id === "thong-bao" && (
              <div className="mt-6 grid gap-4">
                {notificationColumns.map((column, columnIndex) => (
                  <div key={`column-${columnIndex}`} className="space-y-3">
                    {column.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm shadow-sm shadow-slate-200"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-500">{item.timestamp}</p>
                        <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-2 text-slate-600">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {service.id === "kien-nghi" && (
              <form className="mt-6 space-y-4" onSubmit={handlePetitionSubmit} onReset={handlePetitionReset}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="petition-full-name" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Họ và tên người gửi <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="petition-full-name"
                      type="text"
                      required
                      value={petitionState.fullName}
                      onChange={(event) => handlePetitionChange("fullName", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="Nguyễn Văn B"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="petition-email" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="petition-email"
                      type="email"
                      required
                      value={petitionState.email}
                      onChange={(event) => handlePetitionChange("email", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="nguoidan@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="petition-phone" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="petition-phone"
                      type="tel"
                      pattern="(0|\+84)[0-9]{9,10}"
                      required
                      value={petitionState.phone}
                      onChange={(event) => handlePetitionChange("phone", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="0912345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="petition-address" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Địa chỉ liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="petition-address"
                      type="text"
                      required
                      value={petitionState.address}
                      onChange={(event) => handlePetitionChange("address", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="petition-title" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Tiêu đề kiến nghị <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="petition-title"
                    type="text"
                    required
                    value={petitionState.title}
                    onChange={(event) => handlePetitionChange("title", event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                    placeholder="Nội dung chính của kiến nghị"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Nội dung kiến nghị <span className="text-red-500">*</span>
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-600">
                      RadEditor
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditorCommand("bold")}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:border-red-400 hover:text-red-600"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditorCommand("italic")}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold italic text-slate-700 shadow-sm hover:border-red-400 hover:text-red-600"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEditorCommand("insertUnorderedList")}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:border-red-400 hover:text-red-600"
                    >
                      Danh sách
                    </button>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorInput}
                    className="min-h-[160px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none"
                    aria-label="Trình chỉnh sửa nội dung kiến nghị"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="petition-attachment" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Tệp đính kèm (hình ảnh, tài liệu)
                  </label>
                  <input
                    id="petition-attachment"
                    type="file"
                    onChange={(event) => handlePetitionChange("attachment", event.target.files?.[0] ?? null)}
                    className="w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                  {petitionState.attachment && (
                    <p className="text-xs text-slate-500">Đã chọn: {petitionState.attachment.name}</p>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-[auto,1fr] md:items-center">
                  <div className="flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 text-lg font-semibold tracking-[0.3em] text-white shadow-inner shadow-slate-400">
                    {PETITION_CAPTCHA}
                  </div>
                  <input
                    type="text"
                    required
                    value={petitionState.captcha}
                    onChange={(event) => handlePetitionChange("captcha", event.target.value.toUpperCase())}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm uppercase tracking-[0.3em] text-slate-900 shadow-inner focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                    placeholder="Nhập mã xác nhận"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-300 transition hover:bg-red-700"
                  >
                    Gửi
                  </button>
                  <button
                    type="reset"
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-400 hover:text-red-600"
                  >
                    Nhập lại
                  </button>
                </div>

                <div
                  className={`rounded-2xl border p-4 text-xs font-semibold ${
                    petitionStatus === "success"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : petitionStatus === "error"
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  {petitionMessage}
                </div>
              </form>
            )}

            <div className="mt-6 flex items-center justify-between text-sm">
              <Link href={`/services/${service.id}`} className="font-semibold text-red-600 transition hover:text-red-700">
                Xem chi tiết
              </Link>
              <button className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 font-medium text-red-700 transition hover:border-red-500 hover:bg-red-50">
                Bắt đầu ngay
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
