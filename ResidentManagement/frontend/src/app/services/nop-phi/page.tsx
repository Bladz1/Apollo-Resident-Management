"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { loadUsername, TOKEN_KEY } from "@/utils/auth-storage";

type FeeStatus = "Chưa nộp" | "Đã nộp" | "Đang xử lý";

type FeeCategory = {
  id: string;
  name: string;
  description: string;
};

interface FeeItem {
  id: string;
  categoryId: string;
  name: string;
  agency: string;
  amount: number;
  dueDate?: string;
  status: string;
  description: string;
}
interface Bill {
  id: string;
  name: string;
  description: string;
  fees: FeeItem[];
}

type PaymentMethod = "bank" | "wallet" | "card";

async function loadFeeItems(): Promise<FeeItem[]> {
  const response = await fetch(`http://localhost:8080/resident-management/fees/${loadUsername()}`, {
  headers: {
    method: "GET",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem(TOKEN_KEY) || ""}`,
  }
});

  if (!response.ok) {
    throw new Error("Failed to fetch fees");
  }

  const data = await response.json();

  const allFees = data.result;

  console.log(allFees);

  return allFees as FeeItem[];
}

const feeCategories: FeeCategory[] = [
  {
    id: "health-social",
    name: "Phí y tế - xã hội",
    description:
      "Bao gồm bảo hiểm y tế, phí khám chữa bệnh, phí cấp giấy khám sức khỏe.",
  },
  {
    id: "administrative",
    name: "Phí hành chính công",
    description:
      "Bao gồm phí cấp hộ chiếu, lệ phí chứng thực, phí cấp giấy phép kinh doanh.",
  },
  {
    id: "transport",
    name: "Phí giao thông",
    description:
      "Bao gồm phí đăng ký phương tiện, phí cầu đường, phạt vi phạm giao thông.",
  },
];

// const feeItemss: FeeItem[] = [
//   {
//     id: "passport",
//     categoryId: "administrative",
//     name: "Phí cấp hộ chiếu",
//     agency: "Cục Quản lý xuất nhập cảnh",
//     amount: 200_000,
//     dueDate: "2025-10-25",
//     status: "Chưa nộp",
//     description:
//       "Phí cấp hộ chiếu phổ thông theo quy định của Bộ Tài chính dành cho công dân trên 14 tuổi.",
//   },
//   {
//     id: "notarization",
//     categoryId: "administrative",
//     name: "Phí chứng thực",
//     agency: "UBND phường Trung Tự",
//     amount: 30_000,
//     status: "Đã nộp",
//     description:
//       "Phí chứng thực bản sao giấy tờ, tài liệu hành chính theo Nghị định 23/2015/NĐ-CP.",
//   },
//   {
//     id: "business-license",
//     categoryId: "administrative",
//     name: "Lệ phí cấp giấy phép kinh doanh",
//     agency: "Sở Kế hoạch và Đầu tư Hà Nội",
//     amount: 300_000,
//     dueDate: "2025-04-30",
//     status: "Đang xử lý",
//     description:
//       "Lệ phí cấp mới giấy chứng nhận đăng ký doanh nghiệp cho hộ kinh doanh cá thể.",
//   },
//   {
//     id: "health-insurance",
//     categoryId: "health-social",
//     name: "Gia hạn bảo hiểm y tế hộ gia đình",
//     agency: "BHXH quận Đống Đa",
//     amount: 804_600,
//     dueDate: "2025-02-15",
//     status: "Chưa nộp",
//     description:
//       "Gia hạn thẻ bảo hiểm y tế hộ gia đình thời hạn 12 tháng theo mức đóng hiện hành.",
//   },
//   {
//     id: "medical-check",
//     categoryId: "health-social",
//     name: "Phí khám sức khỏe tổng quát",
//     agency: "Bệnh viện Đa khoa Hà Nội",
//     amount: 950_000,
//     status: "Chưa nộp",
//     description:
//       "Gói khám sức khỏe tổng quát định kỳ bao gồm xét nghiệm máu, nước tiểu và chẩn đoán hình ảnh.",
//   },
//   {
//     id: "driving-penalty",
//     categoryId: "transport",
//     name: "Phạt vi phạm giao thông đường bộ",
//     agency: "Phòng Cảnh sát giao thông Hà Nội",
//     amount: 1_500_000,
//     dueDate: "2025-01-20",
//     status: "Chưa nộp",
//     description:
//       "Nộp phạt vi phạm lỗi vượt đèn đỏ theo quyết định xử phạt của lực lượng chức năng.",
//   },
//   {
//     id: "toll-pass",
//     categoryId: "transport",
//     name: "Phí dịch vụ sử dụng đường bộ (vé tháng)",
//     agency: "Trạm thu phí Pháp Vân - Cầu Giẽ",
//     amount: 600_000,
//     status: "Đã nộp",
//     description:
//       "Gia hạn vé tháng sử dụng dịch vụ đường bộ trên tuyến cao tốc Pháp Vân - Cầu Giẽ.",
//   },
//   {
//     id: "vehicle-registration",
//     categoryId: "transport",
//     name: "Lệ phí đăng ký xe máy",
//     agency: "Phòng CSGT đường bộ, đường sắt",
//     amount: 2_000_000,
//     dueDate: "2025-03-10",
//     status: "Đang xử lý",
//     description:
//       "Lệ phí đăng ký lần đầu xe máy tại khu vực nội thành thuộc thành phố trực thuộc Trung ương.",
//   },
// ];

const statusOptions: ("all" | FeeStatus)[] = ["all", "Chưa nộp", "Đang xử lý", "Đã nộp"];

export default function FeeDetailPage() {

  const [selectedCategory, setSelectedCategory] = useState<FeeCategory>(feeCategories[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>("all");
  const [agencyFilter, setAgencyFilter] = useState("all");
  const [selectedFee, setSelectedFee] = useState<FeeItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [feeItems, setFeeItems] = useState<FeeItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadFeeItems()
      .then(setFeeItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  console.log(feeItems);

  const agencies = useMemo(() => {
    const set = new Set<string>();
    feeItems.forEach((item) => {
      if (item.categoryId === selectedCategory.id) {
        set.add(item.agency);
      }
    });
    return ["all", ...Array.from(set)];
  }, [selectedCategory.id, feeItems]);

  // testing filtering
  const filteredFees = useMemo(() => {
    return feeItems.filter((item) => {
      if (item.categoryId !== selectedCategory.id) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (agencyFilter !== "all" && item.agency !== agencyFilter) return false;
      if (!searchTerm) return true;
      const query = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.agency.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory.id, statusFilter, agencyFilter, searchTerm, feeItems]);

  const summary = useMemo(() => {
    const totalPending = filteredFees.filter((item) => item.status === "Chưa nộp").length;
    const totalAmount = filteredFees
      .filter((item) => item.status === "Chưa nộp")
      .reduce((sum, item) => sum + item.amount, 0);
    const dueSoon = filteredFees.filter((item) => {
      if (!item.dueDate) return false;
      const today = new Date();
      const due = new Date(item.dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length;

    return { totalPending, totalAmount, dueSoon };
  }, [filteredFees]);

  const dueSoonNotices = useMemo(() => {
    return filteredFees.filter((item) => {
      if (!item.dueDate) return false;
      const today = new Date();
      const due = new Date(item.dueDate);
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });
  }, [filteredFees]);

  const handleSelectCategory = (category: FeeCategory) => {
    setSelectedCategory(category);
    setSelectedFee(null);
    setPaymentSuccess(false);
    setSearchTerm("");
    setStatusFilter("all");
    setAgencyFilter("all");
  };

  const handleSelectFee = (fee: FeeItem) => {
    setSelectedFee(fee);
    setPaymentSuccess(false);
    setPaymentMethod("bank");
  };

  const handleConfirmPayment = () => {
    setPaymentSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-slate-100">Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-slate-100">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pb-12 text-slate-100">
      <header className="border-b border-white/10 bg-gradient-to-r from-red-900/85 via-slate-950 to-amber-900/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">Thanh toán trực tuyến</p>
            <h1 className="mt-3 text-3xl md:text-4xl">Quản lý các khoản phí cần nộp</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
              Xem toàn bộ danh mục phí, theo dõi trạng thái xử lý và hoàn tất thanh toán trực tuyến chỉ trong vài bước.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <Link href="/services" className="inline-flex items-center gap-2 text-amber-200 transition hover:text-amber-100">
                ← Quay lại danh sách dịch vụ
              </Link>
              <span className="hidden h-4 w-px bg-amber-300/70 md:block" aria-hidden="true" />
              <span>Hướng dẫn: Chọn nhóm phí → chọn khoản phí → thanh toán trực tuyến</span>
            </div>
          </div>
          <div className="rounded-3xl border border-amber-300/60 bg-slate-900/70 p-6 text-sm backdrop-blur">
            <p className="text-amber-200">Tổng quan nhanh</p>
            <ul className="mt-3 space-y-2 text-left text-slate-200">
              <li>• {summary.totalPending} khoản phí chưa nộp</li>
              <li>
                • Tổng tiền tạm tính: {summary.totalAmount.toLocaleString("vi-VN")}₫
              </li>
              <li>• {summary.dueSoon} khoản sắp hết hạn</li>
            </ul>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100">Danh mục phí</h2>
            <p className="mt-2 text-sm text-slate-300">
              Lựa chọn một nhóm phí để xem và quản lý các khoản cần thanh toán.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {feeCategories.map((category) => {
                const isActive = selectedCategory.id === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelectCategory(category)}
                    className={`text-left rounded-2xl border p-4 transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                      isActive
                        ? "border-amber-300/70 bg-amber-400/15 text-amber-200 shadow-lg shadow-amber-500/20"
                        : "border-white/10 bg-slate-900/75 text-slate-200 hover:border-amber-300/60 hover:bg-amber-200/10"
                    }`}
                  >
                    <h3 className="text-base font-semibold">{category.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed">{category.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-slate-300">
                  Tìm kiếm phí
                </label>
                <input
                  id="search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Nhập tên phí hoặc cơ quan thu..."
                  className="mt-2 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-100 shadow-inner focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                />
              </div>
              <div className="grid w-full gap-4 sm:grid-cols-2 lg:w-auto">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-slate-300">
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as (typeof statusOptions)[number])}
                    className="mt-2 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-100 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === "all" ? "Tất cả" : option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="agency" className="block text-sm font-medium text-slate-300">
                    Cơ quan thu
                  </label>
                  <select
                    id="agency"
                    value={agencyFilter}
                    onChange={(event) => setAgencyFilter(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-100 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200/40"
                  >
                    {agencies.map((agency) => (
                      <option key={agency} value={agency}>
                        {agency === "all" ? "Tất cả" : agency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {dueSoonNotices.length > 0 && (
              <div className="mt-6 rounded-2xl border border-amber-300/60 bg-amber-400/10 p-4 text-sm text-amber-100">
                <p className="font-semibold">Thông báo hạn nộp</p>
                <ul className="mt-2 space-y-1">
                  {dueSoonNotices.map((item) => (
                    <li key={item.id}>
                      {item.name} cần nộp trước ngày {new Date(item.dueDate!).toLocaleDateString("vi-VN")}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-sm">
                <thead className="bg-slate-900/70 text-left text-xs font-semibold uppercase tracking-wide text-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tên phí</th>
                    <th className="px-4 py-3">Cơ quan thu</th>
                    <th className="px-4 py-3">Số tiền</th>
                    <th className="px-4 py-3">Hạn nộp</th>
                    <th className="px-4 py-3">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-900/60">
                  {filteredFees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-300">
                        Không tìm thấy khoản phí phù hợp với tiêu chí lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredFees.map((fee) => (
                      <tr key={fee.id} className="transition hover:bg-amber-200/10">
                        <td className="px-4 py-4 font-medium text-slate-100">{fee.name}</td>
                        <td className="px-4 py-4 text-slate-300">{fee.agency}</td>
                        <td className="px-4 py-4 text-slate-100">{fee.amount.toLocaleString("vi-VN")}₫</td>
                        <td className="px-4 py-4 text-slate-300">
                          {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString("vi-VN") : "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                              fee.status === "Đã nộp"
                                ? "border-emerald-300/60 bg-emerald-400/10 text-emerald-200"
                                : fee.status === "Đang xử lý"
                                  ? "border-amber-300/60 bg-amber-400/10 text-amber-200"
                                  : "border-rose-400/60 bg-rose-400/10 text-rose-200"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleSelectFee(fee)}
                            className="inline-flex items-center gap-2 rounded-full border border-amber-300/60 px-4 py-2 font-medium text-amber-200 transition hover:border-amber-300/70 hover:bg-amber-400/10"
                          >
                            {fee.status === "Đã nộp" ? "Chi tiết" : "Chi tiết / Nộp ngay"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-black/40 backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100">Chi tiết khoản phí</h2>
            {selectedFee ? (
              <div className="mt-4 space-y-5 text-sm text-slate-200">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Thông tin chung</p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li>
                      <span className="font-medium text-slate-100">Tên phí:</span> {selectedFee.name}
                    </li>
                    <li>
                      <span className="font-medium text-slate-100">Cơ quan thu:</span> {selectedFee.agency}
                    </li>
                    <li>
                      <span className="font-medium text-slate-100">Số tiền:</span> {selectedFee.amount.toLocaleString("vi-VN")}₫
                    </li>
                    <li>
                      <span className="font-medium text-slate-100">Hạn nộp:</span>{" "}
                      {selectedFee.dueDate
                        ? new Date(selectedFee.dueDate).toLocaleDateString("vi-VN")
                        : "Không quy định"}
                    </li>
                    <li>
                      <span className="font-medium text-slate-100">Trạng thái:</span> {selectedFee.status}
                    </li>
                  </ul>
                  <p className="mt-3 rounded-xl border border-white/10 bg-slate-900/60 p-3 text-sm leading-relaxed text-slate-200">
                    {selectedFee.description}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Phương thức thanh toán</p>
                  <div className="mt-3 space-y-3">
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-3 hover:border-amber-300/60">
                      <input
                        type="radio"
                        name="payment-method"
                        value="bank"
                        checked={paymentMethod === "bank"}
                        onChange={() => setPaymentMethod("bank")}
                        className="h-4 w-4 text-amber-200 focus:ring-amber-300"
                      />
                      <div>
                        <p className="font-medium text-slate-100">Ngân hàng nội địa</p>
                        <p className="text-xs text-slate-300">Hỗ trợ tài khoản Vietcombank, BIDV, Vietinbank...</p>
                      </div>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-3 hover:border-amber-300/60">
                      <input
                        type="radio"
                        name="payment-method"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={() => setPaymentMethod("wallet")}
                        className="h-4 w-4 text-amber-200 focus:ring-amber-300"
                      />
                      <div>
                        <p className="font-medium text-slate-100">Ví điện tử</p>
                        <p className="text-xs text-slate-300">Thanh toán qua MoMo, VNPay, ZaloPay.</p>
                      </div>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 p-3 hover:border-amber-300/60">
                      <input
                        type="radio"
                        name="payment-method"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4 text-amber-200 focus:ring-amber-300"
                      />
                      <div>
                        <p className="font-medium text-slate-100">Thẻ tín dụng / ghi nợ</p>
                        <p className="text-xs text-slate-300">Hỗ trợ Visa, Mastercard, JCB.</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/65 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Xác nhận &amp; biên lai</p>
                  {!paymentSuccess ? (
                    <>
                      <p className="text-sm text-slate-300">
                        Sau khi nhấn thanh toán, hệ thống sẽ chuyển tới cổng thanh toán tương ứng để xác nhận giao dịch.
                      </p>
                      <button
                        type="button"
                        onClick={handleConfirmPayment}
                        className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/40 transition hover:-translate-y-0.5"
                      >
                        Xác nhận thanh toán
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3 text-sm text-slate-200">
                      <div className="rounded-2xl border border-emerald-300/60 bg-emerald-400/10 p-3 text-emerald-200">
                        <p className="font-semibold">Thanh toán thành công</p>
                        <p>Mã giao dịch: TT-{selectedFee.id.toUpperCase()}-2025</p>
                        <p>Thời gian: {new Date().toLocaleString("vi-VN")}</p>
                        <p>Số tiền: {selectedFee.amount.toLocaleString("vi-VN")}₫</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button className="inline-flex flex-1 items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-300/60 hover:text-amber-200">
                          Tải biên lai PDF
                        </button>
                        <button className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5">
                          Gửi biên lai qua email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-300">
                Vui lòng chọn một khoản phí ở danh sách bên trái để xem thông tin chi tiết và tiến hành thanh toán.
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 text-sm shadow-xl shadow-black/40 backdrop-blur">
            <h2 className="text-lg font-semibold text-slate-100">Tổng kết nhanh</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-slate-300">Khoản chưa nộp</span>
                <span className="font-semibold text-slate-100">{summary.totalPending}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-slate-300">Tổng tiền chưa nộp</span>
                <span className="font-semibold text-slate-100">{summary.totalAmount.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-slate-300">Sắp đến hạn</span>
                <span className="font-semibold text-slate-100">{summary.dueSoon}</span>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
