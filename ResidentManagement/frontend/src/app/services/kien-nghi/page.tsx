"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";

import { initialPetitionState, services, type PetitionFormState } from "../data";

const petitionService = services.find((service) => service.id === "kien-nghi");

const createEmptyPetitionState = (): PetitionFormState => ({ ...initialPetitionState });

type PetitionStatus = "idle" | "success" | "error";

export default function PetitionPage() {
  const [petitionState, setPetitionState] = useState<PetitionFormState>(() => createEmptyPetitionState());
  const [petitionStatus, setPetitionStatus] = useState<PetitionStatus>("idle");
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

  const handlePetitionSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // 1. QUAN TRỌNG NHẤT: Phải có dòng này thì mới không bị reload trang
    event.preventDefault();

    setPetitionMessage("Đang gửi dữ liệu...");

    try {
      const formData = new FormData();
      formData.append("fullName", petitionState.fullName);
      formData.append("email", petitionState.email);
      formData.append("phone", petitionState.phone);
      formData.append("address", petitionState.address);
      formData.append("title", petitionState.title);
      formData.append("content", petitionState.content); 
      
      if (petitionState.attachment) {
        formData.append("attachment", petitionState.attachment);
      }

      // 2. Sửa lại đường dẫn API. 
      const response = await fetch("/feedbacks/userid", { 
        method: "POST",
        body: formData, 
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối server");
      }

      const data = await response.json(); 

      setPetitionStatus("success");
      setPetitionMessage(
        "Gửi thành công! Mã: " + (data.id || "Mới")
      );
    } catch (error) {
      setPetitionStatus("error");
      setPetitionMessage("Đã xảy ra lỗi khi gửi kiến nghị.");
    }
  };

  const handlePetitionReset = () => {
    setPetitionState(createEmptyPetitionState());
    setPetitionStatus("idle");
    setPetitionMessage("Điền form trực tiếp trên trang và nhấn \"Gửi\" để hoàn tất kiến nghị.");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-gradient-to-br from-red-900 via-red-700 to-red-500 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-red-100">Gửi kiến nghị trực tuyến</p>
            <h1 className="mt-3 text-3xl font-bold md:text-4xl">{petitionService?.name}</h1>
            <p className="mt-3 max-w-2xl text-sm text-red-50 md:text-base">{petitionService?.description}</p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-full border border-white/50 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            ← Quay lại trang dịch vụ
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
        <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-xl shadow-red-200/40">
          <h2 className="text-xl font-semibold text-red-800">Quy trình gửi kiến nghị</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Điền đầy đủ thông tin người gửi để thuận tiện xác minh và phản hồi.</li>
            <li>Nhập tiêu đề và nội dung kiến nghị bằng trình soạn thảo hỗ trợ định dạng.</li>
            <li>Đính kèm tài liệu, hình ảnh minh chứng (nếu có).</li>
            <li>Kiểm tra thông tin và nhấn &ldquo;Gửi&rdquo; để hoàn tất.</li>
            <li>Hệ thống sẽ gửi email xác nhận khi cung cấp địa chỉ liên hệ hợp lệ.</li>
          </ol>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
          <form className="space-y-4" onSubmit={handlePetitionSubmit} onReset={handlePetitionReset}>
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
                  pattern="(0|\\+84)[0-9]{9,10}"
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
                className="min-h-[200px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-red-500 focus:outline-none"
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
        </section>
      </main>
    </div>
  );
}
